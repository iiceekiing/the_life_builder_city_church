#!/usr/bin/env python3
"""
Script to create sample courses and enrollments for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal, engine
from app.models.course import Course, CourseType, Lesson
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.user import User

def create_sample_data():
    db = SessionLocal()
    
    try:
        # Get admin user as instructor
        admin = db.query(User).filter(User.email == "miracleamajama14@gmail.com").first()
        if not admin:
            print("Admin user not found!")
            return
        
        # Create sample courses
        courses_data = [
            {
                "title": "Media Training - Sound Engineering",
                "description": "Learn the fundamentals of sound engineering for church services and events.",
                "course_type": CourseType.MEDIA_TRAINING,
                "instructor_id": admin.id,
                "is_published": True,
                "is_free": True,
                "duration_weeks": 4,
                "total_videos": 7,
                "passing_score": 50,
                "certification_passing_score": 80
            },
            {
                "title": "Membership Class",
                "description": "Discover your purpose and find your place in the Life Builder City Church family.",
                "course_type": CourseType.MEMBERSHIP_CLASS,
                "instructor_id": admin.id,
                "is_published": True,
                "is_free": True,
                "duration_weeks": 2,
                "total_videos": 5,
                "passing_score": 50,
                "certification_passing_score": 80
            },
            {
                "title": "Workers Training",
                "description": "Essential training for all church workers and ministry team members.",
                "course_type": CourseType.WORKERS_CLASS,
                "instructor_id": admin.id,
                "is_published": True,
                "is_free": True,
                "duration_weeks": 3,
                "total_videos": 6,
                "passing_score": 50,
                "certification_passing_score": 80
            },
            {
                "title": "School of Ministry",
                "description": "Advanced ministry training for those called to serve in full-time ministry.",
                "course_type": CourseType.SCHOOL_OF_MINISTRY,
                "instructor_id": admin.id,
                "is_published": True,
                "is_free": True,
                "duration_weeks": 12,
                "total_videos": 24,
                "passing_score": 60,
                "certification_passing_score": 85
            },
            {
                "title": "HILA Business Leadership",
                "description": "Professional business and leadership training program.",
                "course_type": CourseType.HILA,
                "instructor_id": admin.id,
                "is_published": False,  # Not yet published
                "is_free": False,
                "price": 299.99,
                "duration_weeks": 8,
                "total_videos": 16,
                "passing_score": 70,
                "certification_passing_score": 90
            }
        ]
        
        created_courses = []
        for course_data in courses_data:
            # Check if course already exists
            existing = db.query(Course).filter(Course.title == course_data["title"]).first()
            if not existing:
                course = Course(**course_data)
                db.add(course)
                created_courses.append(course)
                print(f"Created course: {course_data['title']}")
            else:
                created_courses.append(existing)
                print(f"Course already exists: {course_data['title']}")
        
        db.commit()
        
        # Get some regular users for sample enrollments
        regular_users = db.query(User).filter(User.role == "member").limit(3).all()
        
        if regular_users and created_courses:
            # Create sample enrollments
            for i, user in enumerate(regular_users):
                for j, course in enumerate(created_courses[:3]):  # Create enrollments for first 3 courses
                    if i < len(created_courses[:3]):  # Avoid duplicate enrollments
                        # Check if enrollment already exists
                        existing_enrollment = db.query(Enrollment).filter(
                            Enrollment.user_id == user.id,
                            Enrollment.course_id == course.id
                        ).first()
                        
                        if not existing_enrollment:
                            enrollment = Enrollment(
                                user_id=user.id,
                                course_id=course.id,
                                status=EnrollmentStatus.PENDING if j == 0 else EnrollmentStatus.APPROVED,
                                progress_percentage=0 if j == 0 else (25 * j)
                            )
                            db.add(enrollment)
                            print(f"Created enrollment: {user.full_name} -> {course.title}")
        
        db.commit()
        print("Sample data created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()
