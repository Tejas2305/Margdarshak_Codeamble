from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
import httpx

from app.database import get_db
from app.models.user import User
from app.models.road_segment import RoadSegment
from app.schemas.map import (
    SpeedLimitResponse,
    RouteSafetyRequest,
    RouteSafetyResponse,
    SearchResponse,
    PlaceResult,
    SearchPlaceResponse,
)
from app.utils.auth import get_current_user
from app.services.spatial_service import (
    find_nearest_road_segment,
    evaluate_osrm_routes,
    search_places as search_places_service,
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
    results = await search_places_service(query)
    return SearchResponse(query=query, results=results)


@router.post("/route-safety", response_model=RouteSafetyResponse)
async def analyze_route_safety(
    request: RouteSafetyRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    safety_response = await evaluate_osrm_routes(request.origin, request.destination, db)
    return safety_response


@router.get("/search", response_model=SearchPlaceResponse)
async def search_places(
    query: str = Query(..., min_length=1, description="Search query for places"),
    lat: Optional[float] = Query(None, description="Latitude for proximity search"),
    lng: Optional[float] = Query(None, description="Longitude for proximity search"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
    current_user: User = Depends(get_current_user)
):
    """
    Search for places using Nominatim (OpenStreetMap) geocoding service.
    Supports searching for addresses, landmarks, and points of interest.
    """
    
    # Use Nominatim API (OpenStreetMap's geocoding service)
    base_url = "https://nominatim.openstreetmap.org/search"
    
    params = {
        "q": query,
        "format": "json",
        "limit": limit,
        "addressdetails": 1,
    }
    
    # Add proximity bias if coordinates provided
    if lat is not None and lng is not None:
        params["viewbox"] = f"{lng-0.1},{lat-0.1},{lng+0.1},{lat+0.1}"
        params["bounded"] = 0  # Prefer but don't strictly require results in viewbox
    
    headers = {
        "User-Agent": "Margdarshak Safety App/1.0"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(base_url, params=params, headers=headers, timeout=10.0)
            response.raise_for_status()
            data = response.json()
        
        # Convert to our format
        results = []
        for item in data:
            results.append(
                PlaceResult(
                    name=item.get("display_name", "Unknown Place"),
                    lat=float(item.get("lat", 0)),
                    lng=float(item.get("lon", 0)),
                    place_id=item.get("place_id"),
                    address=item.get("display_name")
                )
            )
        
        return SearchPlaceResponse(query=query, results=results)
    
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Geocoding service unavailable: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Search failed: {str(e)}"
        )
