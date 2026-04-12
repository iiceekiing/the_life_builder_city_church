#!/usr/bin/env python3
"""
Script to create sample enrollments for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.user import User
from app.models.course import Course

def create_sample_enrollments():
    db = SessionLocal()
    
    try:
        # Get some regular users
        regular_users = db.query(User).filter(User.role == "member").limit(3).all()
        
        if not regular_users:
            print("No regular users found. Creating sample users first...")
            # Create sample users
            sample_users = [
                User(
                    full_name="John Student",
                    email="john@example.com",
                    hashed_password="$2b$12$example_hash",
                    role="member",
                    is_active=True,
                    is_verified=True
                ),
                User(
                    full_name="Jane Learner", 
                    email="jane@example.com",
                    hashed_password="$2b$12$example_hash",
                    role="member",
                    is_active=True,
                    is_verified=True
                ),
                User(
                    full_name="Bob Trainee",
                    email="bob@example.com", 
                    hashed_password="$2b$12$example_hash",
                    role="member",
                    is_active=True,
                    is_verified=True
                )
            ]
            
            for user in sample_users:
                db.add(user)
            
            db.commit()
            regular_users = db.query(User).filter(User.role == "member").limit(3).all()
        
        # Get courses
        courses = db.query(Course).limit(3).all()
        
        if not courses:
            print("No courses found!")
            return
        
        # Create sample enrollments with different statuses
        enrollment_data = [
            # Pending enrollments
            (regular_users[0].id, courses[0].id, EnrollmentStatus.PENDING, 0),
            (regular_users[1].id, courses[0].id, EnrollmentStatus.PENDING, 0),
            
            # Approved enrollments with progress
            (regular_users[0].id, courses[1].id, EnrollmentStatus.APPROVED, 25),
            (regular_users[1].id, courses[1].id, EnrollmentStatus.APPROVED, 50),
            (regular_users[2].id, courses[2].id, EnrollmentStatus.APPROVED, 75),
            
            # Completed enrollments
            (regular_users[0].id, courses[2].id, EnrollmentStatus.COMPLETED, 100),
        ]
        
        created_count = 0
        for user_id, course_id, status, progress in enrollment_data:
            # Check if enrollment already exists
            existing = db.query(Enrollment).filter(
                Enrollment.user_id == user_id,
                Enrollment.course_id == course_id
            ).first()
            
            if not existing:
                enrollment = Enrollment(
                    user_id=user_id,
                    course_id=course_id,
                    status=status,
                    progress_percentage=progress
                )
                db.add(enrollment)
                created_count += 1
                print(f"Created enrollment: User {user_id} -> Course {course_id} ({status.value})")
        
        db.commit()
        print(f"Successfully created {created_count} sample enrollments!")
        
    except Exception as e:
        print(f"Error creating sample enrollments: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_enrollments()
