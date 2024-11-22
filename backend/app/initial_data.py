from app.db.session import SessionLocal
from app.crud import crud_user
from app.schemas.user import UserCreate

def init_db():
    db = SessionLocal()
    try:
        # Create admin user if it doesn't exist
        admin_user = UserCreate(
            email="admin@example.com",
            password="fahim123",
            full_name="Admin User",
            is_superuser=True,
            department="Administration",
            designation="System Administrator",
            salary=0
        )
        user = crud_user.get_by_email(db, email=admin_user.email)
        if not user:
            crud_user.create(db, obj_in=admin_user)
            print("Admin user created successfully")
        else:
            print("Admin user already exists")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
