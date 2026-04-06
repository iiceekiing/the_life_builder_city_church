from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.schemas import AppointmentResponse, AppointmentCreate, AppointmentUpdate, PastorResponse
from app.models.appointment import Appointment, Pastor
from app.core.security import require_admin_or_team_lead

router = APIRouter()


@router.get("/pastors", response_model=List[PastorResponse])
async def get_pastors(db: Session = Depends(get_db)):
    pastors = db.query(Pastor).filter(Pastor.is_available == True).all()
    return pastors


@router.post("/", response_model=AppointmentResponse)
async def create_appointment(appointment_data: AppointmentCreate, db: Session = Depends(get_db)):
    appointment = Appointment(**appointment_data.dict())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("/", response_model=List[AppointmentResponse])
async def get_appointments(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    appointments = db.query(Appointment).offset(skip).limit(limit).all()
    return appointments


@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    for field, value in appointment_data.dict(exclude_unset=True).items():
        setattr(appointment, field, value)
    
    db.commit()
    db.refresh(appointment)
    return appointment
