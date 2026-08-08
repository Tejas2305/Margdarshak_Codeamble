from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class LocationPoint(BaseModel):
    lat: float
    lng: float


class SpeedLimitResponse(BaseModel):
    segment_id: Optional[int] = None
    road_name: Optional[str] = None
    base_speed_kmh: float
    updated_speed_kmh: float
    risk_score: float


class RouteSafetyRequest(BaseModel):
    origin: LocationPoint
    destination: LocationPoint


class WarningItem(BaseModel):
    latitude: float
    longitude: float
    message: str
    severity: int


class SearchResultItem(BaseModel):
    name: str
    lat: float
    lng: float


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem]


class RouteSafetyOption(BaseModel):
    route_index: int
    distance_meters: float
    duration_seconds: float
    adjusted_duration_seconds: float
    average_risk_score: float
    safety_index: float
    is_safest: bool
    warnings: List[WarningItem]
    geometry: Optional[Dict[str, Any]] = None


class RouteSafetyResponse(BaseModel):
    routes: List[RouteSafetyOption]
    recommended_route_index: int
