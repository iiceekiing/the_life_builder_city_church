from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class QuestionType(str, enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)  # If null, it's a final exam
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    assessment_type = Column(Enum(QuestionType), default=QuestionType.MULTIPLE_CHOICE)
    total_questions = Column(Integer, default=21)  # 21 for regular assessments, 100 for final exam
    passing_score = Column(Integer, default=50)  # 50% for regular, 80% for final
    time_limit_minutes = Column(Integer, nullable=True)  # Optional time limit
    is_final_exam = Column(Boolean, default=False)  # True for final certification exam
    questions = Column(JSON, nullable=False)  # Store questions as JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    course = relationship("Course", back_populates="assessments")
    lesson = relationship("Lesson", back_populates="assessment")
    attempts = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Assessment {self.title}>"


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    answers = Column(JSON, nullable=False)  # User's answers as JSON
    score = Column(Float, nullable=True)  # Percentage score
    passed = Column(Boolean, nullable=True)
    time_taken_minutes = Column(Integer, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    attempts_count = Column(Integer, default=1)  # Number of attempts

    # Relationships
    enrollment = relationship("Enrollment", back_populates="assessment_attempts")
    assessment = relationship("Assessment", back_populates="attempts")

    def __repr__(self):
        return f"<AssessmentAttempt {self.enrollment_id}-{self.assessment_id}>"


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    certificate_number = Column(String(100), unique=True, nullable=False)
    issued_date = Column(DateTime(timezone=True), server_default=func.now())
    final_score = Column(Float, nullable=False)  # Final cumulative score
    certificate_url = Column(String(500), nullable=True)  # Path to generated certificate PDF
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String(50), unique=True, nullable=True)

    # Relationships
    enrollment = relationship("Enrollment")
    user = relationship("User")
    course = relationship("Course")

    def __repr__(self):
        return f"<Certificate {self.certificate_number}>"
