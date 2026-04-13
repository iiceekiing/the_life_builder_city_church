from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List
from datetime import datetime, timedelta
import json
from app.db.session import get_db
from app.schemas.schemas import AppointmentResponse, AppointmentCreate, AppointmentUpdate, PastorResponse
from app.models.appointment import Appointment, Pastor
from app.core.security import require_admin_or_team_lead, get_current_active_user

router = APIRouter()


@router.get("/pastors", response_model=List[PastorResponse])
async def get_pastors(db: Session = Depends(get_db)):
    pastors = db.query(Pastor).filter(Pastor.is_available == True).all()
    return pastors


@router.get("/pastors/{pastor_id}/availability")
async def get_pastor_availability(pastor_id: int, db: Session = Depends(get_db)):
    # Get pastor
    pastor = db.query(Pastor).filter(Pastor.id == pastor_id).first()
    if not pastor:
        raise HTTPException(status_code=404, detail="Pastor not found")
    
    # Parse available days
    try:
        available_days = json.loads(pastor.available_days) if pastor.available_days else []
    except json.JSONDecodeError:
        available_days = []
    
    # Get current week start (Monday)
    today = datetime.now().date()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    
    availability = {}
    
    day_mapping = {
        'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3, 
        'friday': 4, 'saturday': 5, 'sunday': 6
    }
    
    for day in available_days:
        # Get appointments for this day of the current week
        day_appointments = db.query(Appointment).filter(
            and_(
                Appointment.pastor_id == pastor_id,
                Appointment.status.in_(['confirmed', 'pending']),
                func.date(Appointment.appointment_date) >= week_start,
                func.date(Appointment.appointment_date) <= week_end,
                func.extract('dow', Appointment.appointment_date) == day_mapping.get(day, 0)
            )
        ).all()
        
        # Count appointments per day
        daily_count = len(day_appointments)
        remaining_slots = pastor.max_appointments_per_day - daily_count
        
        # Get weekly count
        week_appointments = db.query(Appointment).filter(
            and_(
                Appointment.pastor_id == pastor_id,
                Appointment.status.in_(['confirmed', 'pending']),
                func.date(Appointment.appointment_date) >= week_start,
                func.date(Appointment.appointment_date) <= week_end
            )
        ).all()
        
        weekly_count = len(week_appointments)
        weekly_remaining = pastor.max_appointments_per_week - weekly_count
        
        availability[day] = {
            'daily_remaining': max(0, remaining_slots),
            'daily_max': pastor.max_appointments_per_day,
            'weekly_remaining': max(0, weekly_remaining),
            'weekly_max': pastor.max_appointments_per_week,
            'status': 'fully_booked' if remaining_slots <= 0 else 'available' if weekly_remaining <= 0 else 'available'
        }
    
    return {
        'pastor_name': pastor.name,
        'pastor_title': pastor.title,
        'available_days': availability,
        'week_start': week_start.isoformat(),
        'week_end': week_end.isoformat()
    }


@router.post("/", response_model=AppointmentResponse)
async def create_appointment(
    appointment_data: AppointmentCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    # Check if pastor exists and is available
    pastor = db.query(Pastor).filter(Pastor.id == appointment_data.pastor_id).first()
    if not pastor or not pastor.is_available:
        raise HTTPException(status_code=404, detail="Pastor not found or unavailable")
    
    # Check if appointment date/time is within pastor's availability
    appointment_datetime = appointment_data.appointment_date
    appointment_day = appointment_datetime.strftime("%A").lower()
    appointment_time = appointment_datetime.strftime("%H:%M")
    
    # Parse available days and times
    try:
        available_days = json.loads(pastor.available_days) if pastor.available_days else []
        available_times = json.loads(pastor.available_times) if pastor.available_times else []
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Pastor availability data is corrupted")
    
    # Check if day is available
    if available_days and appointment_day not in available_days:
        raise HTTPException(status_code=400, detail=f"Pastor is not available on {appointment_day}")
    
    # Check if time is within available slots
    if available_times:
        time_available = False
        for time_slot in available_times:
            if isinstance(time_slot, dict) and "start" in time_slot and "end" in time_slot:
                start_time = datetime.strptime(time_slot["start"], "%H:%M").time()
                end_time = datetime.strptime(time_slot["end"], "%H:%M").time()
                current_time = appointment_datetime.time()
                if start_time <= current_time <= end_time:
                    time_available = True
                    break
        if not time_available:
            raise HTTPException(status_code=400, detail="Selected time is not within pastor's available hours")
    
    # Check daily appointment limit
    day_start = appointment_datetime.replace(hour=0, minute=0, second=0, microsecond=0)
    day_end = day_start + timedelta(days=1)
    
    daily_appointments = db.query(Appointment).filter(
        and_(
            Appointment.pastor_id == appointment_data.pastor_id,
            Appointment.appointment_date >= day_start,
            Appointment.appointment_date < day_end,
            Appointment.status.in_(["pending", "confirmed"])
        )
    ).count()
    
    if daily_appointments >= pastor.max_appointments_per_day:
        raise HTTPException(
            status_code=400, 
            detail=f"Pastor has reached maximum appointments ({pastor.max_appointments_per_day}) for this day"
        )
    
    # Check weekly appointment limit
    week_start = appointment_datetime - timedelta(days=appointment_datetime.weekday())
    week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)
    week_end = week_start + timedelta(days=7)
    
    weekly_appointments = db.query(Appointment).filter(
        and_(
            Appointment.pastor_id == appointment_data.pastor_id,
            Appointment.appointment_date >= week_start,
            Appointment.appointment_date < week_end,
            Appointment.status.in_(["pending", "confirmed"])
        )
    ).count()
    
    if weekly_appointments >= pastor.max_appointments_per_week:
        raise HTTPException(
            status_code=400, 
            detail=f"Pastor is fully booked for the week. Please select another pastor."
        )
    
    # Create appointment
    appointment = Appointment(
        pastor_id=appointment_data.pastor_id,
        user_id=current_user.id if current_user else None,
        full_name=appointment_data.full_name,
        email=appointment_data.email,
        phone=appointment_data.phone,
        subject=appointment_data.subject,
        message=appointment_data.message,
        appointment_date=appointment_data.appointment_date,
        status="pending"
    )
    
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("/my", response_model=List[AppointmentResponse])
async def get_my_appointments(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    appointments = db.query(Appointment).filter(
        Appointment.user_id == current_user.id
    ).order_by(Appointment.appointment_date.desc()).offset(skip).limit(limit).all()
    return appointments


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
