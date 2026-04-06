from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.schemas import EventResponse, EventCreate, EventUpdate
from app.models.event import Event
from app.core.security import require_admin_or_team_lead

router = APIRouter()


@router.get("/", response_model=List[EventResponse])
async def get_events(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    events = db.query(Event).filter(
        Event.is_published == True
    ).order_by(Event.event_date.asc()).offset(skip).limit(limit).all()
    return events


@router.post("/", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    event = Event(**event_data.dict())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    for field, value in event_data.dict(exclude_unset=True).items():
        setattr(event, field, value)
    
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}")
async def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}
