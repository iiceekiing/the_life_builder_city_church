from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def update_miracle_to_admin():
    db = SessionLocal()
    
    try:
        # Find Miracle Amajama
        user = db.query(User).filter(User.email == "miracleamajama14@gmail.com").first()
        
        if not user:
            print("User Miracle Amajama not found!")
            return
        
        print(f"Found user: {user.full_name} - Current role: {user.role}")
        
        # Update role and password
        user.role = "admin"
        user.hashed_password = get_password_hash("Zephyr@651818")
        user.phone = "07065181830"
        user.is_verified = True
        
        db.commit()
        
        print(f"✅ Updated {user.full_name}:")
        print(f"   Role: {user.role}")
        print(f"   Email: {user.email}")
        print(f"   Phone: {user.phone}")
        print(f"   Password: Zephyr@651818 (updated)")
        
    except Exception as e:
        print(f"Error updating user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_miracle_to_admin()
