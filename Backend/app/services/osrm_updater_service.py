import asyncio
import os
import psycopg2
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.road_segment import RoadSegment
from app.models.report import Report
from app.services.dirty_segment_service import recalculate_dirty_segments
from app.config import (
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    OSRM_UPDATE_DEBOUNCE_SECONDS,
    OSRM_FILE_PATH,
    OSRM_SPEED_CSV_PATH,
    ENABLE_OSRM_SUBPROCESS_CUSTOMIZE,
)

_update_pending: bool = False
_datastore_lock = asyncio.Lock()


async def export_speed_csv(db: AsyncSession, csv_path: str = OSRM_SPEED_CSV_PATH) -> int:
    """
    Exports non-default road segment adjusted speeds to CSV format for osrm-customize.
    CSV format: from_node,to_node,speed
    Queries PostGIS planet_osm_line and OSRM node annotations for specific road segments.
    """
    result = await db.execute(select(RoadSegment))
    segments = result.scalars().all()

    dirty_segments = [s for s in segments if abs(s.updated_speed_kmh - s.base_speed_kmh) > 0.01]
    if not dirty_segments:
        try:
            os.makedirs(os.path.dirname(os.path.abspath(csv_path)), exist_ok=True)
            with open(csv_path, "w", encoding="utf-8") as f:
                pass
        except Exception:
            pass
        return 0

    conn = None
    try:
        conn = psycopg2.connect(
            dbname="osrm",
            user=DB_USER or "postgres",
            password=DB_PASSWORD or "tejas",
            host=DB_HOST or "localhost",
            port=int(DB_PORT or 5432),
        )
    except Exception as e:
        print(f"[OSRM Export Warning] Could not connect to PostGIS 'osrm' db: {e}")
        conn = None

    written_lines = 0
    try:
        os.makedirs(os.path.dirname(os.path.abspath(csv_path)), exist_ok=True)
        async with httpx.AsyncClient(timeout=10.0) as client:
            with open(csv_path, "w", encoding="utf-8") as f:
                for seg in dirty_segments:
                    speed_int = max(15, int(round(seg.updated_speed_kmh)))

                    # Fetch a sample report linked to this segment to obtain coordinates reference
                    reports_res = await db.execute(
                        select(Report).where(Report.road_segment_id == seg.segment_id).limit(1)
                    )
                    sample_report = reports_res.scalar_one_or_none()

                    ref_lat = sample_report.latitude if sample_report else 18.5204
                    ref_lng = sample_report.longitude if sample_report else 73.8567

                    rows = []
                    if conn:
                        try:
                            cur = conn.cursor()
                            if seg.name and seg.name != "Default Pune Road Segment":
                                cur.execute("""
                                    SELECT ST_AsText(way)
                                    FROM planet_osm_line
                                    WHERE name = %s
                                    AND ST_DWithin(
                                        way::geography,
                                        ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                                        1000
                                    );
                                """, (seg.name, ref_lng, ref_lat))
                                rows = cur.fetchall()

                            if not rows and seg.osm_id:
                                cur.execute("""
                                    SELECT ST_AsText(way)
                                    FROM planet_osm_line
                                    WHERE osm_id = %s;
                                """, (seg.osm_id,))
                                rows = cur.fetchall()

                            if not rows:
                                cur.execute("""
                                    SELECT ST_AsText(way)
                                    FROM planet_osm_line
                                    WHERE highway IS NOT NULL
                                    ORDER BY way <-> ST_SetSRID(ST_MakePoint(%s, %s), 4326)
                                    LIMIT 1;
                                """, (ref_lng, ref_lat))
                                rows = cur.fetchall()
                            cur.close()
                        except Exception as pge:
                            print(f"[OSRM Export Warning] PostGIS query error for segment {seg.segment_id}: {pge}")

                    for row in rows:
                        wkt = row[0]
                        if not wkt or not wkt.startswith("LINESTRING"):
                            continue
                        coords = wkt.replace("LINESTRING(", "").replace(")", "").split(",")
                        points = [c.strip().split() for c in coords]
                        if len(points) < 2:
                            continue

                        coord_str = ";".join(f"{p[0]},{p[1]}" for p in points)
                        osrm_url = f"http://localhost:5000/route/v1/driving/{coord_str}"

                        try:
                            resp = await client.get(osrm_url, params={"overview": "false", "annotations": "nodes"})
                            if resp.status_code == 200:
                                data = resp.json()
                                if data.get("code") == "Ok":
                                    legs = data.get("routes", [{}])[0].get("legs", [])
                                    for leg in legs:
                                        nodes = leg.get("annotation", {}).get("nodes", [])
                                        for i in range(len(nodes) - 1):
                                            n1, n2 = nodes[i], nodes[i + 1]
                                            if n1 and n2:
                                                f.write(f"{n1},{n2},{speed_int}\n")
                                                f.write(f"{n2},{n1},{speed_int}\n")
                                                written_lines += 2
                        except Exception as osrm_e:
                            print(f"[OSRM Export Warning] OSRM node lookup failed for segment {seg.segment_id}: {osrm_e}")
    except Exception as e:
        print(f"[OSRM Export Warning] Could not write speed CSV: {e}")
    finally:
        if conn:
            conn.close()

    return written_lines


async def trigger_debounced_osrm_update():
    """
    Triggers debounced OSRM update task.
    First event starts a coalescing window (default 30 seconds from .env).
    Subsequent events landing during the window ride along on the same update execution.
    """
    global _update_pending
    if _update_pending:
        return  # Event coalesced into existing queued run

    _update_pending = True
    asyncio.create_task(_run_update_pipeline())


async def _run_update_pipeline():
    global _update_pending
    try:
        # Debounce coalescing sleep window
        debounce_secs = max(1.0, OSRM_UPDATE_DEBOUNCE_SECONDS)
        await asyncio.sleep(debounce_secs)
    finally:
        _update_pending = False

    async with _datastore_lock:
        async with AsyncSessionLocal() as db:
            # 1. Recalculate dirty segment risk scores & adjusted speeds
            updated_count = await recalculate_dirty_segments(db)
            # 2. Export updated speeds CSV
            csv_lines = await export_speed_csv(db)

        print(f"[OSRM Updater] Recalculated {updated_count} dirty segments. Exported {csv_lines} CSV records.")

        # 3. Hot-swap OSRM memory metric if subprocess customize is enabled
        if ENABLE_OSRM_SUBPROCESS_CUSTOMIZE and os.path.exists(OSRM_FILE_PATH):
            try:
                proc1 = await asyncio.create_subprocess_exec(
                    "osrm-customize",
                    OSRM_FILE_PATH,
                    "--segment-speed-file",
                    OSRM_SPEED_CSV_PATH,
                )
                await proc1.wait()

                proc2 = await asyncio.create_subprocess_exec(
                    "osrm-datastore",
                    "--only-metric",
                    OSRM_FILE_PATH,
                )
                await proc2.wait()
                print("[OSRM Updater] osrm-customize and osrm-datastore executed successfully.")
            except Exception as e:
                print(f"[OSRM Subprocess Error] {e}")
