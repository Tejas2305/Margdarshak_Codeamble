from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    Text,
    Boolean,
    ForeignKey,
    TIMESTAMP
)
from app.models.role import Role
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__="users"

    user_id = Column(Integer,primary_key=True, index=True)
    first_name = Column(String(50),nullable=False)
    last_name= Column(String(50),nullable=False)
    email= Column(String(100),nullable=False,unique=True)
    phone_number= Column(String(15),unique=True)
    password_hash=Column(String(255))
    google_id=Column(String(100),unique=True)
    login_provider = Column(String(20), default="LOCAL")
    date_of_birth = Column(Date)
    profile_photo_url = Column(Text)
    role_id = Column(
    Integer,
    ForeignKey("roles.role_id")
)
    is_verified = Column(Boolean, default=False)
    account_status = Column(String(20), default="ACTIVE")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    refresh_tokens = relationship(
    "RefreshToken",
    back_populates="user",
    cascade="all, delete-orphan"
)