from datetime import datetime

from pydantic import BaseModel, Field
from typing import Optional

class SosTriggerRequest(BaseModel):

    latitude: float = Field(
        ...,
        ge=-90,
        le=90
    )

    longitude: float = Field(
        ...,
        ge=-180,
        le=180
    )

    address: str | None = None

    battery_percentage: int | None = Field(
        default=None,
        ge=0,
        le=100
    )


class SosResponse(BaseModel):

    message: str
    sos_id: int
    status: str
    created_at: datetime

    google_maps_url: str


class SosHistoryResponse(BaseModel):

    sos_id: int

    latitude: float

    longitude: float

    address: Optional[str]

    battery_percentage: Optional[int]

    status: str

    created_at: datetime

    google_maps_url: str