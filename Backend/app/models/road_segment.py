from sqlalchemy import Column, Integer, BigInteger, String, Float, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base


class RoadSegment(Base):
    __tablename__ = "road_segments"

    segment_id = Column(Integer, primary_key=True, index=True)
    osm_id = Column(BigInteger, index=True, nullable=True)
    name = Column(String(150), nullable=True)
    base_speed_kmh = Column(Float, default=50.0, nullable=False)
    updated_speed_kmh = Column(Float, default=50.0, nullable=False)
    fir_score = Column(Float, default=0.0, nullable=False)
    population_score = Column(Float, default=0.0, nullable=False)
    community_score_b = Column(Float, default=0.0, nullable=False)
    pollution_score = Column(Float, default=0.0, nullable=False)
    risk_score = Column(Float, default=0.0, nullable=False)
    is_dirty = Column(Boolean, default=False, nullable=False, index=True)
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
