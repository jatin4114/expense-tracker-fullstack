# budget_service.py - get/create/update logic for the budget

from sqlalchemy.orm import Session
from app.models.budget import Budget


def get_or_create_budget(db: Session, user_id: int = None):
    budget = db.query(Budget).filter(Budget.user_id == user_id).first()

    # if this user doesnt have a budget row yet, make one with 0 as
    # the default so the frontend has something to show
    if not budget:
        budget = Budget(user_id=user_id, monthly_limit=0)
        db.add(budget)
        db.commit()
        db.refresh(budget)

    return budget


def update_budget(db: Session, user_id: int, new_limit: float):
    budget = get_or_create_budget(db, user_id)
    budget.monthly_limit = new_limit
    db.commit()
    db.refresh(budget)
    return budget
