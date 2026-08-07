from sqlalchemy import (
    Column,
    Integer,
    Double,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class SosEvent(Base):

    __tablename__ = "sos_events"

    sos_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.user_id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    latitude = Column(
        Double,
        nullable=False
    )

    longitude = Column(
        Double,
        nullable=False
    )

    address = Column(
        Text
    )

    battery_percentage = Column(
        Integer
    )

    status = Column(
        String(20),
        default="ACTIVE",
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="sos_events"
    )