import asyncio
import os
import psycopg2
import httpx
from datetime import datetime
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


def log_event(message: str):
    """
    Logs timestamped messages to console AND to data/log.txt.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {message}"
    print(formatted)

    try:
        csv_dir = os.path.dirname(os.path.abspath(OSRM_SPEED_CSV_PATH)) if OSRM_SPEED_CSV_PATH else "data"
        os.makedirs(csv_dir, exist_ok=True)
        log_file = os.path.join(csv_dir, "log.txt")
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(formatted + "\n")
    except Exception as e:
        print(f"[Logger Warning] Could not write to log.txt: {e}")


async def export_speed_csv(db: AsyncSession, csv_path: str = OSRM_SPEED_CSV_PATH) -> int:
    """
    Exports non-default road segment adjusted speeds to CSV format for osrm-customize.
    CSV format: from_node,to_node,speed
    Queries PostGIS planet_osm_line and OSRM node annotations for specific road segments.
    """
    csv_abs = os.path.abspath(csv_path) if csv_path else "data/penalty.csv"
    os.makedirs(os.path.dirname(csv_abs), exist_ok=True)

    result = await db.execute(select(RoadSegment))
    segments = result.scalars().all()

    # Get segments with custom speeds, risk scores, or reports
    target_segments = [
        s for s in segments
        if s.risk_score > 0.1 or abs(s.updated_speed_kmh - s.base_speed_kmh) > 0.01 or s.community_score_b > 0
    ]

    if not target_segments:
        # Also check if any reports exist in database
        rep_res = await db.execute(select(Report).where(Report.status != "REJECTED").limit(1))
        if not rep_res.scalar_one_or_none():
            with open(csv_abs, "w", encoding="utf-8") as f:
                pass
            log_event(f"[OSRM Export] No active hazard segments or reports found. Created empty CSV at {csv_abs}")
            return 0
        target_segments = segments

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
        log_event(f"[OSRM Export Warning] Could not connect to PostGIS 'osrm' db: {e}")
        conn = None

    written_lines = 0
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            with open(csv_abs, "w", encoding="utf-8") as f:
                for seg in target_segments:
                    # Allow speed penalty to drop to 1 km/h for severe risk to force OSRM rerouting
                    speed_int = max(1, int(round(seg.base_speed_kmh * (1.0 - (seg.risk_score / 100.0) * 0.95))))

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
                            # Fetch road way segments within 200 meters (left 200m, right 200m) of incident location
                            if seg.name and seg.name != "Default Pune Road Segment":
                                cur.execute("""
                                    SELECT ST_AsText(way)
                                    FROM planet_osm_line
                                    WHERE (osm_id = %s OR name = %s)
                                    AND ST_DWithin(
                                        way::geography,
                                        ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                                        200
                                    );
                                """, (seg.osm_id, seg.name, ref_lng, ref_lat))
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
                                    AND ST_DWithin(
                                        way::geography,
                                        ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                                        200
                                    );
                                """, (ref_lng, ref_lat))
                                rows = cur.fetchall()
                            cur.close()
                        except Exception as pge:
                            log_event(f"[OSRM Export Warning] PostGIS query error for segment {seg.segment_id}: {pge}")

                    for row in rows:
                        wkt = row[0]
                        if not wkt or not wkt.startswith("LINESTRING"):
                            continue
                        coords = wkt.replace("LINESTRING(", "").replace(")", "").split(",")
                        points = [c.strip().split() for c in coords]
                        if len(points) < 2:
                            continue

                        # Sample points if list is long to avoid exceeding OSRM URL coordinate limits
                        if len(points) > 50:
                            step = (len(points) + 49) // 50
                            points = points[::step]

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
                            log_event(f"[OSRM Export Warning] OSRM node lookup failed for segment {seg.segment_id}: {osrm_e}")
                f.flush()
    except Exception as e:
        log_event(f"[OSRM Export Warning] Could not write speed CSV: {e}")
    finally:
        if conn:
            conn.close()

    log_event(f"[OSRM Export] Wrote {written_lines} node penalty records to '{csv_abs}'.")
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

        file_path = os.path.abspath(OSRM_FILE_PATH) if OSRM_FILE_PATH else ""
        csv_path_abs = os.path.abspath(OSRM_SPEED_CSV_PATH) if OSRM_SPEED_CSV_PATH else ""

        log_event(f"[OSRM Updater] Pipeline execution completed. Dirty segments updated: {updated_count}, CSV records: {csv_lines}.")

        # 3. Hot-swap OSRM memory metric if enabled or OSRM file exists
        if ENABLE_OSRM_SUBPROCESS_CUSTOMIZE or (file_path and os.path.exists(file_path)):
            try:
                log_event(f"[OSRM Updater] Executing osrm-customize on '{file_path}' using '--segment-speed-file {csv_path_abs}'...")
                proc1 = await asyncio.create_subprocess_exec(
                    "osrm-customize",
                    file_path,
                    "--segment-speed-file",
                    csv_path_abs,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                stdout1, stderr1 = await proc1.communicate()
                out1_str = (stdout1.decode() + "\n" + stderr1.decode()).strip()
                if out1_str:
                    log_event(f"[osrm-customize output]\n{out1_str}")
                log_event(f"[OSRM Updater] osrm-customize finished with return code {proc1.returncode}")

                log_event(f"[OSRM Updater] Executing osrm-datastore --only-metric=true on '{file_path}'...")
                proc2 = await asyncio.create_subprocess_exec(
                    "osrm-datastore",
                    "--only-metric=true",
                    file_path,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                stdout2, stderr2 = await proc2.communicate()
                out2_str = (stdout2.decode() + "\n" + stderr2.decode()).strip()
                if out2_str:
                    log_event(f"[osrm-datastore output]\n{out2_str}")
                log_event(f"[OSRM Updater] osrm-datastore finished with return code {proc2.returncode}")
            except Exception as e:
                log_event(f"[OSRM Subprocess Error] {e}")
