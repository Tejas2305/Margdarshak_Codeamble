from sqlalchemy import Column, Integer, String, Date
from app.database import Base


class FIR(Base):
    __tablename__ = "firs"

    id = Column(Integer, primary_key=True, index=True)
    fir_number = Column(String(20), unique=True, nullable=False)
    registration_date = Column(Date)
    incident_date = Column(Date)
    area = Column(String(100), index=True)
    police_station = Column(String(150))
    fir_title = Column(String(150))
    bns_section = Column(String(100))
