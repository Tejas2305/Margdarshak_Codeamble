from sqlalchemy import (
    Column,
    Integer,
    SmallInteger,
    String,
    Float,
    Text,
    ForeignKey,
    TIMESTAMP,
    UniqueConstraint
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)
    road_segment_id = Column(Integer, ForeignKey("road_segments.segment_id", ondelete="SET NULL"), nullable=True)
    user_rating = Column(SmallInteger, nullable=False, default=3)
    computed_severity = Column(Float, nullable=False, default=60.0)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String(20), default="PENDING", nullable=False)
    upvotes = Column(Integer, default=0, nullable=False)
    downvotes = Column(Integer, default=0, nullable=False)
    confidence_score = Column(Float, default=0.5, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    category = relationship("Category")
    user = relationship("User")
    road_segment = relationship("RoadSegment")
    votes = relationship("ReportVote", back_populates="report", cascade="all, delete-orphan")


class ReportVote(Base):
    __tablename__ = "report_votes"

    vote_id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.report_id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    vote_type = Column(SmallInteger, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "report_id", name="uq_user_report_vote"),
    )

    report = relationship("Report", back_populates="votes")
    user = relationship("User")
