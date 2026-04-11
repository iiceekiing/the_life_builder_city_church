from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class CourseType(str, enum.Enum):
    BIBLICAL_STUDIES = "biblical_studies"
    LEADERSHIP = "leadership"
    MINISTRY_TRAINING = "ministry_training"
    DISCIPLESHIP = "discipleship"
    THEOLOGY = "theology"
    PRACTICAL_LIFE = "practical_life"
    MEDIA_TRAINING = "media_training"
    MEMBERSHIP_CLASS = "membership_class"
    WORKERS_CLASS = "workers_class"
    SCHOOL_OF_MINISTRY = "school_of_ministry"
    HILA = "hila"


class MediaSubcategory(str, enum.Enum):
    SOUND_TRAINING = "sound_training"
    LIGHT_TRAINING = "light_training"
    LIVE_STREAMING = "live_streaming"
    PHOTOGRAPHY = "photography"
    VIDEOGRAPHY = "videography"
    GRAPHICS_DESIGN = "graphics_design"
    SOCIAL_MEDIA = "social_media"
    DEVOTIONAL = "devotional"
    FACILITY_MAINTENANCE = "facility_maintenance"


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    course_type = Column(Enum(CourseType), nullable=False)
    media_subcategory = Column(Enum(MediaSubcategory), nullable=True)  # Only for media training
    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=False)
    is_free = Column(Boolean, default=True)
    price = Column(Float, nullable=True)  # For paid courses like HILA
    duration_weeks = Column(Integer, nullable=True)
    total_videos = Column(Integer, default=7)  # Number of videos in course
    passing_score = Column(Integer, default=50)  # Minimum score for assessments
    certification_passing_score = Column(Integer, default=80)  # For final exam
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    instructor = relationship("User", foreign_keys=[instructor_id])
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course")
    assessments = relationship("Assessment", back_populates="course", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Course {self.title}>"


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    video_url = Column(String(500), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    order_index = Column(Integer, default=0)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="lessons")
    progress = relationship("Progress", back_populates="lesson")
    assessment = relationship("Assessment", back_populates="lesson")

    def __repr__(self):
        return f"<Lesson {self.title}>"
