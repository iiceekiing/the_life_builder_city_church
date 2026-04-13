from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime


# ---- Testimony ----
class TestimonyCreate(BaseModel):
    author_name: str
    author_email: Optional[EmailStr] = None
    title: str
    content: Optional[str] = None
    testimony_type: str = "text"


class TestimonyUpdate(BaseModel):
    status: Optional[str] = None
    admin_note: Optional[str] = None
    is_featured: Optional[bool] = None


class TestimonyResponse(BaseModel):
    id: int
    author_name: str
    title: str
    content: Optional[str] = None
    audio_url: Optional[str] = None
    video_url: Optional[str] = None
    testimony_type: str
    status: str
    is_featured: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Appointment ----
class PastorCreate(BaseModel):
    name: str
    title: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None


class PastorResponse(BaseModel):
    id: int
    name: str
    title: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    is_available: bool
    is_global_lead: bool
    email: str
    phone: Optional[str] = None
    max_appointments_per_day: int
    max_appointments_per_week: int
    available_days: Optional[str] = None
    available_times: Optional[str] = None

    class Config:
        from_attributes = True


class AppointmentCreate(BaseModel):
    pastor_id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: Optional[str] = None
    appointment_date: datetime


class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    admin_note: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int
    full_name: str
    email: str
    subject: str
    appointment_date: datetime
    status: str
    pastor: Optional[PastorResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Event ----
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: datetime
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False
    registration_link: Optional[str] = None


class EventUpdate(EventCreate):
    title: Optional[str] = None
    event_date: Optional[datetime] = None
    is_published: Optional[bool] = None


class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    event_date: datetime
    end_date: Optional[datetime] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    is_published: bool
    is_featured: bool
    registration_link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Media ----
class MediaCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    file_url: str
    file_type: str
    category: Optional[str] = None
    week_label: Optional[str] = None


class MediaResponse(BaseModel):
    id: int
    title: Optional[str] = None
    file_url: str
    file_type: str
    category: Optional[str] = None
    week_label: Optional[str] = None
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Partnership ----
class PartnershipCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    category: str
    message: Optional[str] = None


class PartnershipResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    category: str
    message: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Course ----
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    course_type: str
    instructor_id: Optional[int] = None
    thumbnail_url: Optional[str] = None
    is_free: bool = True
    is_published: bool = False
    duration_weeks: Optional[int] = None


class CourseCreate(CourseBase):
    price: Optional[float] = 0.0
    total_videos: Optional[int] = 0
    passing_score: Optional[int] = 70
    certification_passing_score: Optional[int] = 80


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_published: Optional[bool] = None


class CourseResponse(CourseBase):
    id: int
    is_published: bool
    created_at: datetime
    lessons: List[Any] = []

    class Config:
        from_attributes = True


class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    order_index: int = 0


class LessonCreate(LessonBase):
    pass


class LessonResponse(LessonBase):
    id: int
    course_id: int
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True


class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: int
    enrollment_date: datetime
    progress_percentage: float
    status: str
    course: Optional[CourseResponse] = None
    user: Optional[dict] = None

    class Config:
        from_attributes = True
