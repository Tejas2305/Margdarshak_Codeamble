import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.road_segment import RoadSegment
from app.services.dirty_segment_service import recalculate_dirty_segments
from app.config import (
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
    """
    result = await db.execute(select(RoadSegment))
    segments = result.scalars().all()

    written_lines = 0
    try:
        os.makedirs(os.path.dirname(os.path.abspath(csv_path)), exist_ok=True)
        with open(csv_path, "w", encoding="utf-8") as f:
            for seg in segments:
                if seg.osm_id and seg.updated_speed_kmh != seg.base_speed_kmh:
                    # Write node speed entry
                    speed_int = max(15, int(round(seg.updated_speed_kmh)))
                    f.write(f"{seg.osm_id},{speed_int}\n")
                    written_lines += 1
    except Exception as e:
        print(f"[OSRM Export Warning] Could not write speed CSV: {e}")

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
