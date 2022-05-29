# auth_service.py - register / login / account management logic

from sqlalchemy.orm import Session
from app.models.user import User
from app.models.expense import Expense
from app.models.budget import Budget
from app.models.category_budget import CategoryBudget
from app.schemas.user import UserCreate
from app.auth.security import hash_password, verify_password
from app.logging_config import get_logger

logger = get_logger(__name__)


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
    logger.info("New user registered: user_id=%s", new_user.id)
    return new_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        logger.warning("Login attempt for unknown email")
        return None
    if not verify_password(password, user.hashed_password):
        logger.warning("Failed login attempt: user_id=%s", user.id)
        return None
    logger.info("User logged in: user_id=%s", user.id)
    return user


def change_password(db: Session, user: User, new_password: str):
    user.hashed_password = hash_password(new_password)
    db.commit()
    logger.info("Password changed: user_id=%s", user.id)


def delete_account(db: Session, user: User):
    # clean up everything that belongs to this user before deleting
    # the user row itself, so we dont leave orphaned rows behind
    db.query(Expense).filter(Expense.user_id == user.id).delete()
    db.query(Budget).filter(Budget.user_id == user.id).delete()
    db.delete(user)
    db.commit()
    logger.info("Account deleted: user_id=%s", user.id)


def export_account_data(db: Session, user: User) -> dict:
    # everything that belongs to this user, as one json blob - lets
    # them keep a full backup outside the app (unlike the csv export,
    # which is just expenses)
    expenses = db.query(Expense).filter(Expense.user_id == user.id).all()
    budget = db.query(Budget).filter(Budget.user_id == user.id).first()
    category_budgets = (
        db.query(CategoryBudget).filter(CategoryBudget.user_id == user.id).all()
    )

    return {
        "account": {"email": user.email, "created_at": user.created_at.isoformat()},
        "budget": {"monthly_limit": budget.monthly_limit} if budget else None,
        "category_budgets": [
            {"category": b.category, "monthly_limit": b.monthly_limit}
            for b in category_budgets
        ],
        "expenses": [
            {
                "title": e.title,
                "amount": e.amount,
                "category": e.category,
                "date": e.date.isoformat(),
                "description": e.description,
                "payment_method": e.payment_method,
                "created_at": e.created_at.isoformat(),
            }
            for e in expenses
        ],
    }
