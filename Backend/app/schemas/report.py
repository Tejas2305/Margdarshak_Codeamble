from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportCreate(BaseModel):
    category_id: int
    user_rating: int
    description: Optional[str] = None
    latitude: float
    longitude: float


class ReportResponse(BaseModel):
    report_id: int
    incident_image: str | None = None
    user_id: int
    category_id: int
    category_name: Optional[str] = None
    user_rating: int
    computed_severity: float
    description: Optional[str] = None
    latitude: float
    longitude: float
    status: str
    upvotes: int
    downvotes: int
    confidence_score: float
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VoteRequest(BaseModel):
    vote_type: int


class VoteResponse(BaseModel):
    report_id: int
    upvotes: int
    downvotes: int
    confidence_score: float
    message: str
