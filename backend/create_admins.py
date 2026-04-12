#!/usr/bin/env python3
"""
Script to create admin users with specified credentials
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal, engine
from app.models.user import User
from app.core.security import get_password_hash

def create_admin_users():
    db = SessionLocal()
    
    try:
        # Admin 1: Miracle Amajama
        admin1 = User(
            full_name="Miracle Amajama",
            email="miracleamajama14@gmail.com",
            hashed_password=get_password_hash("Zephyr@651818"),
            role="admin",
            is_active=True,
            is_verified=True
        )
        
        # Admin 2: Life Builder Admin
        admin2 = User(
            full_name="Life Builder Admin",
            email="lifebuilderscitychurch@gmail.com",
            hashed_password=get_password_hash("Zephyr@651818"),
            role="admin",
            is_active=True,
            is_verified=True
        )
        
        # Check if admins already exist
        existing_admin1 = db.query(User).filter(User.email == "miracleamajama14@gmail.com").first()
        existing_admin2 = db.query(User).filter(User.email == "lifebuilderscitychurch@gmail.com").first()
        
        if not existing_admin1:
            db.add(admin1)
            print("Created admin user: Miracle Amajama")
        else:
            print("Admin user already exists: Miracle Amajama")
            
        if not existing_admin2:
            db.add(admin2)
            print("Created admin user: Life Builder Admin")
        else:
            print("Admin user already exists: Life Builder Admin")
        
        db.commit()
        print("Admin users created successfully!")
        
    except Exception as e:
        print(f"Error creating admin users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_users()
