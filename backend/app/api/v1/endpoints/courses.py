from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.schemas import CourseResponse, CourseCreate, CourseUpdate, LessonResponse, LessonCreate, EnrollmentResponse
from app.models.course import Course, Lesson
from app.models.enrollment import Enrollment
from app.core.security import get_current_active_user, require_admin_or_team_lead

router = APIRouter()


@router.get("/all", response_model=List[CourseResponse])
async def get_all_courses(
    skip: int = 0,
    limit: int = 50,
    course_type: str = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin_or_team_lead)
):
    """Get all courses for admin (including unpublished)"""
    query = db.query(Course)
    
    if course_type:
        query = query.filter(Course.course_type == course_type)
    
    courses = query.order_by(Course.created_at.desc()).offset(skip).limit(limit).all()
    return courses


@router.get("/", response_model=List[CourseResponse])
async def get_courses(
    skip: int = 0,
    limit: int = 20,
    course_type: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Course).filter(Course.is_published == True)
    
    if course_type:
        query = query.filter(Course.course_type == course_type)
    
    courses = query.order_by(Course.created_at.desc()).offset(skip).limit(limit).all()
    return courses


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("/create", response_model=CourseResponse)
async def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin_or_team_lead)
):
    course = Course(**course_data.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    course_data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin_or_team_lead)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    for field, value in course_data.dict(exclude_unset=True).items():
        setattr(course, field, value)
    
    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}")
async def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin_or_team_lead)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(course)
    db.commit()
    return {"message": "Course deleted successfully"}


@router.post("/{course_id}/enroll", response_model=EnrollmentResponse)
async def enroll_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    # Check if course exists
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if already enrolled
    existing_enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    # Create enrollment
    enrollment = Enrollment(
        user_id=current_user.id,
        course_id=course_id
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    
    return enrollment


@router.get("/my/enrollments", response_model=List[EnrollmentResponse])
async def get_my_enrollments(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).all()
    return enrollments


@router.get("/{course_id}/lessons", response_model=List[LessonResponse])
async def get_course_lessons(
    course_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    # Check if enrolled
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course")
    
    lessons = db.query(Lesson).filter(
        Lesson.course_id == course_id,
        Lesson.is_published == True
    ).order_by(Lesson.order_index).all()
    
    return lessons
