from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.session import get_db
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.user import User
from app.models.course import Course
from app.core.security import get_current_active_user, require_admin
from app.schemas.schemas import EnrollmentResponse

router = APIRouter()


@router.get("/all")
async def get_all_enrollments(
    skip: int = 0,
    limit: int = 50,
    status: EnrollmentStatus = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get all enrollments for admin view"""
    try:
        query = db.query(Enrollment)
        
        if status:
            query = query.filter(Enrollment.status == status)
        
        enrollments = query.order_by(Enrollment.enrollment_date.desc()).offset(skip).limit(limit).all()
        
        # Manual serialization to avoid schema issues
        result = []
        for enrollment in enrollments:
            user = db.query(User).filter(User.id == enrollment.user_id).first()
            course = db.query(Course).filter(Course.id == enrollment.course_id).first()
            
            result.append({
                "id": enrollment.id,
                "user_id": enrollment.user_id,
                "course_id": enrollment.course_id,
                "enrollment_date": enrollment.enrollment_date.isoformat() if enrollment.enrollment_date else None,
                "progress_percentage": enrollment.progress_percentage or 0,
                "status": enrollment.status.value if enrollment.status else "unknown",
                "user": {
                    "full_name": user.full_name if user else "Unknown",
                    "email": user.email if user else "No email"
                },
                "course": {
                    "title": course.title if course else "Unknown Course",
                    "course_type": course.course_type.value if course and course.course_type else "N/A"
                }
            })
        
        return result
    except Exception as e:
        print(f"Error in get_all_enrollments: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{enrollment_id}/approve")
async def approve_enrollment(
    enrollment_id: int,
    notes: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Approve an enrollment request"""
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )
    
    if enrollment.status != EnrollmentStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enrollment is not pending"
        )
    
    enrollment.status = EnrollmentStatus.APPROVED
    enrollment.admin_notes = notes
    enrollment.approved_date = func.now()
    
    db.commit()
    
    # TODO: Send approval email to user
    
    return {"message": "Enrollment approved successfully"}


@router.post("/{enrollment_id}/reject")
async def reject_enrollment(
    enrollment_id: int,
    notes: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Reject an enrollment request"""
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enrollment not found"
        )
    
    if enrollment.status != EnrollmentStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enrollment is not pending"
        )
    
    enrollment.status = EnrollmentStatus.REJECTED
    enrollment.admin_notes = notes
    
    db.commit()
    
    # TODO: Send rejection email to user
    
    return {"message": "Enrollment rejected successfully"}


@router.get("/my", response_model=List[EnrollmentResponse])
async def get_my_enrollments(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """Get current user's enrollments"""
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).order_by(Enrollment.enrollment_date.desc()).all()
    return enrollments
