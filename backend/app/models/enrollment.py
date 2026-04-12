from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class EnrollmentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.PENDING)
    progress_percentage = Column(Float, default=0.0)  # Overall course progress
    videos_completed = Column(Integer, default=0)  # Number of videos completed
    assessment_score = Column(Float, nullable=True)  # Average assessment score
    final_exam_score = Column(Float, nullable=True)  # Final certification exam score
    certificate_issued = Column(Boolean, default=False)
    certificate_url = Column(String(500), nullable=True)
    enrollment_date = Column(DateTime(timezone=True), server_default=func.now())
    approved_date = Column(DateTime(timezone=True), nullable=True)
    completed_date = Column(DateTime(timezone=True), nullable=True)
    admin_notes = Column(Text, nullable=True)  # Admin notes for approval/rejection

    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    progress = relationship("Progress", back_populates="enrollment", cascade="all, delete-orphan")
    assessment_attempts = relationship("AssessmentAttempt", back_populates="enrollment", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Enrollment {self.user_id}-{self.course_id}>"


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    video_watched = Column(Boolean, default=False)
    watch_time_seconds = Column(Integer, default=0)  # How much of the video has been watched
    total_video_duration = Column(Integer, default=0)  # Total video duration in seconds
    watch_percentage = Column(Float, default=0.0)  # Percentage of video watched
    assessment_completed = Column(Boolean, default=False)
    assessment_score = Column(Float, nullable=True)
    unlocked = Column(Boolean, default=False)  # Whether this lesson is unlocked for the user
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    enrollment = relationship("Enrollment", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")

    def __repr__(self):
        return f"<Progress {self.enrollment_id}-{self.lesson_id}>"
