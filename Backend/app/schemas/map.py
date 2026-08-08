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


class RouteSafetyOption(BaseModel):
    route_index: int
    distance_meters: float
    duration_seconds: float
    adjusted_duration_seconds: float
    average_risk_score: float
    safety_index: float
    is_safest: bool
    warnings: List[str]
    geometry: Optional[Dict[str, Any]] = None


class RouteSafetyResponse(BaseModel):
    routes: List[RouteSafetyOption]
    recommended_route_index: int


class PlaceResult(BaseModel):
    name: str
    lat: float
    lng: float
    place_id: Optional[str] = None
    address: Optional[str] = None


class SearchPlaceRequest(BaseModel):
    query: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    limit: int = 10


class SearchPlaceResponse(BaseModel):
    query: str
    results: List[PlaceResult]
