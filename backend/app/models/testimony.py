from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class Testimony(Base):
    __tablename__ = "testimonies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    author_name = Column(String(200), nullable=False)
    author_email = Column(String(255), nullable=True)
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=True)
    audio_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    testimony_type = Column(String(20), default="text")  # text, audio, video
    status = Column(String(20), default="pending")  # pending, approved, rejected
    admin_note = Column(Text, nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="testimonies")

    def __repr__(self):
        return f"<Testimony {self.title}>"
