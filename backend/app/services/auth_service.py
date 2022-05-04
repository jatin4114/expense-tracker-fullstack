# auth_service.py - register / login logic

from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.auth.security import hash_password, verify_password


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def register_user(db: Session, user_data: UserCreate) -> User:
    new_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
