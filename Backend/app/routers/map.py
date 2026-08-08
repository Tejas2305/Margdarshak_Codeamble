from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.models.road_segment import RoadSegment
from app.schemas.map import (
    SpeedLimitResponse,
    RouteSafetyRequest,
    RouteSafetyResponse,
    SearchResponse,
)
from app.utils.auth import get_current_user
from app.services.spatial_service import (
    find_nearest_road_segment,
    evaluate_osrm_routes,
    search_places,
)

router = APIRouter(
    prefix="/map",
    tags=["Map & Safety Routing"]
)


@router.get("/speed-limit", response_model=SpeedLimitResponse)
async def get_speed_limit(
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    segment_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    segment = None
    if segment_id is not None:
        result = await db.execute(
            select(RoadSegment).where(RoadSegment.segment_id == segment_id)
        )
        segment = result.scalar_one_or_none()

    if not segment and (lat is not None and lng is not None):
        segment = await find_nearest_road_segment(db, lat, lng)

    if not segment:
        raise HTTPException(status_code=404, detail="Road segment not found")

    return SpeedLimitResponse(
        segment_id=segment.segment_id,
        road_name=segment.name or "Pune Road Segment",
        base_speed_kmh=segment.base_speed_kmh,
        updated_speed_kmh=segment.updated_speed_kmh,
        risk_score=segment.risk_score
    )


@router.get("/search", response_model=SearchResponse)
async def search_location(
    query: str = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = await search_places(query)
    return SearchResponse(query=query, results=results)


@router.post("/route-safety", response_model=RouteSafetyResponse)
async def analyze_route_safety(
    request: RouteSafetyRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    safety_response = await evaluate_osrm_routes(request.origin, request.destination, db)
    return safety_response
