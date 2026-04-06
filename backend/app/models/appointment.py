from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class Pastor(Base):
    __tablename__ = "pastors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    title = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    appointments = relationship("Appointment", back_populates="pastor")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    pastor_id = Column(Integer, ForeignKey("pastors.id"), nullable=False)
    full_name = Column(String(200), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    subject = Column(String(300), nullable=False)
    message = Column(Text, nullable=True)
    appointment_date = Column(DateTime, nullable=False)
    status = Column(String(20), default="pending")  # pending, confirmed, cancelled, completed
    admin_note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="appointments")
    pastor = relationship("Pastor", back_populates="appointments")

    def __repr__(self):
        return f"<Appointment {self.full_name} - {self.appointment_date}>"
