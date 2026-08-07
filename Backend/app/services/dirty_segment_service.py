from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.road_segment import RoadSegment
from app.models.report import Report
from app.services.scoring_service import (
    calculate_community_score_b,
    calculate_government_score_a,
    calculate_environment_score_c,
    calculate_total_risk_score,
    calculate_adjusted_speed,
)


async def recalculate_dirty_segments(db: AsyncSession) -> int:
    """
    Recalculates scores for all dirty road segments and updates their adjusted speeds.
    Returns the count of updated segments.
    """
    result = await db.execute(
        select(RoadSegment).where(RoadSegment.is_dirty == True)
    )
    dirty_segments = result.scalars().all()

    if not dirty_segments:
        return 0

    updated_count = 0
    for seg in dirty_segments:
        # Fetch reports associated with this segment
        reports_result = await db.execute(
            select(Report).where(
                Report.road_segment_id == seg.segment_id,
                Report.status != "REJECTED"
            )
        )
        reports = reports_result.scalars().all()

        report_dicts = [
            {
                "computed_severity": r.computed_severity,
                "confidence_score": r.confidence_score
            }
            for r in reports
        ]

        # Recalculate Community Score B
        score_b = calculate_community_score_b(report_dicts)
        seg.community_score_b = score_b

        # Recalculate Government Score A and Environment Score C
        score_a = calculate_government_score_a(seg.fir_score, seg.population_score)
        score_c = calculate_environment_score_c(15.0, seg.pollution_score)

        # Recalculate Total Risk
        total_risk = calculate_total_risk_score(score_a, score_b, score_c)
        seg.risk_score = total_risk

        # Recalculate Adjusted Speed with 15 km/h floor
        seg.updated_speed_kmh = calculate_adjusted_speed(seg.base_speed_kmh, total_risk)

        # Clear dirty flag
        seg.is_dirty = False
        updated_count += 1

    await db.commit()
    return updated_count
