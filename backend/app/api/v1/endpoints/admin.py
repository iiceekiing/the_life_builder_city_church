from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.core.security import require_admin
from app.models.user import User
from app.models.sermon import Sermon
from app.models.testimony import Testimony
from app.models.appointment import Appointment
from app.models.course import Course
from app.models.event import Event

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Get dashboard statistics"""
    total_users = db.query(User).count()
    total_sermons = db.query(Sermon).count()
    total_courses = db.query(Course).count()
    total_events = db.query(Event).count()
    total_testimonies = db.query(Testimony).count()
    pending_appointments = db.query(Appointment).filter(Appointment.status == "pending").count()
    
    # Recent registrations (last 30 days)
    from datetime import datetime, timedelta
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_registrations = db.query(User).filter(User.created_at >= thirty_days_ago).count()
    
    return {
        "total_users": total_users,
        "total_sermons": total_sermons,
        "total_courses": total_courses,
        "total_events": total_events,
        "total_testimonies": total_testimonies,
        "pending_appointments": pending_appointments,
        "recent_registrations": recent_registrations,
        "monthly_growth": 15.3  # This would be calculated based on historical data
    }

@router.get("/users", response_model=List[dict])
async def get_all_users(
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    role: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Get all users with filtering and pagination"""
    query = db.query(User)
    
    if search:
        query = query.filter(
            User.full_name.ilike(f"%{search}%") | 
            User.email.ilike(f"%{search}%")
        )
    
    if role:
        query = query.filter(User.role == role)
    
    users = query.offset(skip).limit(limit).all()
    
    return [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        for user in users
    ]

@router.get("/recent-activity")
async def get_recent_activity(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    """Get recent activity across all modules"""
    activities = []
    
    # Recent users
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(3).all()
    for user in recent_users:
        activities.append({
            "action": "New user registration",
            "user": user.full_name,
            "time": "Recently",
            "type": "user"
        })
    
    # Recent sermons
    recent_sermons = db.query(Sermon).order_by(Sermon.created_at.desc()).limit(2).all()
    for sermon in recent_sermons:
        activities.append({
            "action": "Sermon uploaded",
            "user": sermon.speaker or "Unknown",
            "time": "Recently",
            "type": "sermon"
        })
    
    # Recent testimonies
    recent_testimonies = db.query(Testimony).order_by(Testimony.created_at.desc()).limit(2).all()
    for testimony in recent_testimonies:
        activities.append({
            "action": "Testimony submitted",
            "user": testimony.author_name,
            "time": "Recently",
            "type": "testimony"
        })
    
    # Recent appointments
    recent_appointments = db.query(Appointment).order_by(Appointment.created_at.desc()).limit(2).all()
    for appointment in recent_appointments:
        activities.append({
            "action": "Appointment booked",
            "user": appointment.full_name,
            "time": "Recently",
            "type": "appointment"
        })
    
    return activities[:limit]
