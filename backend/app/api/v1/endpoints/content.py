from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.schemas.schemas import EventResponse, MediaResponse, PastorResponse
from app.models.event import Event, Media
from app.models.appointment import Pastor
from app.core.security import require_admin_or_team_lead

router = APIRouter()


@router.get("/events", response_model=List[EventResponse])
async def get_events(
    skip: int = 0,
    limit: int = 20,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Event).filter(Event.is_published == True)
    
    if featured_only:
        query = query.filter(Event.is_featured == True)
    
    events = query.order_by(Event.event_date.asc()).offset(skip).limit(limit).all()
    return events


@router.get("/media", response_model=List[MediaResponse])
async def get_media(
    skip: int = 0,
    limit: int = 50,
    category: Optional[str] = None,
    file_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Media).filter(Media.is_published == True)
    
    if category:
        query = query.filter(Media.category == category)
    
    if file_type:
        query = query.filter(Media.file_type == file_type)
    
    media = query.order_by(Media.created_at.desc()).offset(skip).limit(limit).all()
    return media


@router.get("/pastors", response_model=List[PastorResponse])
async def get_pastors(db: Session = Depends(get_db)):
    pastors = db.query(Pastor).filter(Pastor.is_available == True).all()
    return pastors
