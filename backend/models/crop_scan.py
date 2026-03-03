from sqlalchemy import Boolean, Column, DateTime, Integer, String, func

from app.database import Base


class CropScan(Base):
    __tablename__ = "crop_scans"

    id = Column(Integer, primary_key=True, index=True)
    prediction = Column(String(255), nullable=False, index=True)
    is_healthy = Column(Boolean, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
