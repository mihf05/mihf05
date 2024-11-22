from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User

def update_admin_password():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if admin:
            admin.hashed_password = get_password_hash("fahim123")
            db.commit()
            print("Admin password updated successfully")
        else:
            print("Admin user not found")
    finally:
        db.close()

if __name__ == "__main__":
    update_admin_password()
