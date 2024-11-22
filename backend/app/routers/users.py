from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import User, UserCreate, UserUpdate
from app.crud import crud_user
from app.core.security import oauth2_scheme

router = APIRouter()

@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = crud_user.create(db, obj_in=user_in)
    return user

@router.get("/me", response_model=User)
def read_user_me(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> Any:
    user = crud_user.get_current_user(db, token=token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.put("/me", response_model=User)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    user_in: UserUpdate,
) -> Any:
    user = crud_user.get_current_user(db, token=token)
    user = crud_user.update(db, db_obj=user, obj_in=user_in)
    return user
