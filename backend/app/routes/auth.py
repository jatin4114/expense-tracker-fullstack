# auth.py - register + login + account management endpoints

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut, Token, PasswordChange, AccountDelete
from app.services import auth_service
from app.auth.security import create_access_token, verify_password
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.auth.rate_limit import rate_limit

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db), _rl=Depends(rate_limit)):
    existing_user = auth_service.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return auth_service.register_user(db, user_data)


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db), _rl=Depends(rate_limit)):
    user = auth_service.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/password")
def update_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    auth_service.change_password(db, current_user, data.new_password)
    return {"message": "Password updated"}


@router.get("/export-data")
def export_my_data(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    data = auth_service.export_account_data(db, current_user)
    return JSONResponse(
        content=data,
        headers={"Content-Disposition": "attachment; filename=account_backup.json"},
    )


@router.delete("/me", status_code=204)
def delete_my_account(
    data: AccountDelete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    auth_service.delete_account(db, current_user)
