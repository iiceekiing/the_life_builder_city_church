from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SermonCategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None


class SermonCategoryCreate(SermonCategoryBase):
    pass


class SermonCategoryResponse(SermonCategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SermonBase(BaseModel):
    title: str
    description: Optional[str] = None
    speaker: Optional[str] = None
    category_id: Optional[int] = None
    audio_url: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    is_downloadable: bool = True
    sermon_date: Optional[datetime] = None


class SermonCreate(SermonBase):
    pass


class SermonUpdate(SermonBase):
    title: Optional[str] = None
    is_published: Optional[bool] = None


class SermonResponse(SermonBase):
    id: int
    is_published: bool
    view_count: int
    download_count: int
    created_at: datetime
    category: Optional[SermonCategoryResponse] = None

    class Config:
        from_attributes = True
