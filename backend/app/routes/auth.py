# auth.py - register + login endpoints

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut, Token
from app.services import auth_service
from app.auth.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = auth_service.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return auth_service.register_user(db, user_data)


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}
