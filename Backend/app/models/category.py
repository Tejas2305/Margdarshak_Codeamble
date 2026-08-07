from sqlalchemy import Column, Integer, String, Text, Float, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text)
    severity_min = Column(Float, default=50.0)
    severity_max = Column(Float, default=70.0)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

