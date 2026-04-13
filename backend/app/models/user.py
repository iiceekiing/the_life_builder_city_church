from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    team_lead = "team_lead"
    member = "member"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="member", nullable=False)
    department = Column(String(100), nullable=True)
    birthday = Column(DateTime, nullable=True)
    anniversary = Column(DateTime, nullable=True)
    profile_image = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    testimonies = relationship("Testimony", back_populates="user")
    appointments = relationship("Appointment", back_populates="user")
    enrollments = relationship("Enrollment", back_populates="user")
    certificates = relationship("Certificate", back_populates="user")
    courses_taught = relationship("Course", foreign_keys="Course.instructor_id")

    def __repr__(self):
        return f"<User {self.email}>"
