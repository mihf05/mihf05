from typing import Optional
from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password, decode_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

def get_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create(db: Session, obj_in: UserCreate) -> User:
    db_obj = User(
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
        full_name=obj_in.full_name,
        department=obj_in.department,
        designation=obj_in.designation,
        salary=obj_in.salary,
        is_superuser=False,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def authenticate(db: Session, *, email: str, password: str) -> Optional[User]:
    print(f"Attempting authentication for email: {email}")
    user = get_by_email(db=db, email=email)
    if not user:
        print("User not found")
        return None
    if not verify_password(password, user.hashed_password):
        print(f"Password verification failed. Input: {password}, Hashed: {user.hashed_password}")
        return None
    print("Authentication successful")
    return user

def is_active(user: User) -> bool:
    return user.is_active

def is_superuser(user: User) -> bool:
    return user.is_superuser

def get_current_user(db: Session, token: str) -> Optional[User]:
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        if email is None:
            return None
        return get_by_email(db=db, email=email)
    except Exception:
        return None
