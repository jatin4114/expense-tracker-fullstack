# auth_service.py - register / login / account management logic

from sqlalchemy.orm import Session
from app.models.user import User
from app.models.expense import Expense
from app.models.budget import Budget
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


def change_password(db: Session, user: User, new_password: str):
    user.hashed_password = hash_password(new_password)
    db.commit()


def delete_account(db: Session, user: User):
    # clean up everything that belongs to this user before deleting
    # the user row itself, so we dont leave orphaned rows behind
    db.query(Expense).filter(Expense.user_id == user.id).delete()
    db.query(Budget).filter(Budget.user_id == user.id).delete()
    db.delete(user)
    db.commit()
