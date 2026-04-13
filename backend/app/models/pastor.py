from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class Pastor(Base):
    __tablename__ = "pastors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    image_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    is_global_lead = Column(Boolean, default=False)
    max_appointments_per_day = Column(Integer, default=4)
    max_appointments_per_week = Column(Integer, default=12)
    available_days = Column(Text, nullable=True)  # JSON string of available days
    available_times = Column(Text, nullable=True)  # JSON string of available time slots
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    appointments = relationship("Appointment", back_populates="pastor")

    def __repr__(self):
        return f"<Pastor {self.name}>"
