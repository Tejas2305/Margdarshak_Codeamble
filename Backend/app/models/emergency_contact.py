from sqlalchemy import (
    Column,
    Integer,
    String,
    TIMESTAMP,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "phone_number",
            name="uq_user_contact_phone"
        ),
    )

    contact_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey(
            "users.user_id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=False)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="emergency_contacts"
    )