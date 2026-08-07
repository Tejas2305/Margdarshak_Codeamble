from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    func
)

from sqlalchemy.orm import relationship

from app.database import Base


class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"

    otp_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    otp = Column(String(6), nullable=False)

    is_used = Column(Boolean, default=False, nullable=False)

    expires_at = Column(DateTime(timezone=True), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User")