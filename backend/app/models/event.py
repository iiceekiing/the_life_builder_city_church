from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func

from app.db.session import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    location = Column(String(300), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    registration_link = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Event {self.title}>"


class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(20), nullable=False)  # image, video, audio
    category = Column(String(100), nullable=True)  # gallery, banner, profile
    week_label = Column(String(100), nullable=True)  # e.g. "Week of Jan 5, 2025"
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Media {self.title}>"


class Partnership(Base):
    __tablename__ = "partnerships"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    category = Column(String(100), nullable=False)  # life_plus, love_plus, media_arm, school_of_ministry, other
    message = Column(Text, nullable=True)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
