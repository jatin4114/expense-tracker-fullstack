# budget_service.py - get/create/update logic for the budget

from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.budget import Budget
from app.models.category_budget import CategoryBudget
from app.models.expense import Expense


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


def get_category_budgets(db: Session, user_id: int):
    # how much has been spent per category so far *this month*, so
    # the frontend can show a progress bar per category budget
    today = date.today()
    month_start = today.replace(day=1)

    spent_rows = (
        db.query(Expense.category, func.sum(Expense.amount))
        .filter(Expense.user_id == user_id, Expense.date >= month_start)
        .group_by(Expense.category)
        .all()
    )
    spent_by_category = {category: total for category, total in spent_rows}

    budgets = db.query(CategoryBudget).filter(CategoryBudget.user_id == user_id).all()
    return [
        {
            "category": b.category,
            "monthly_limit": b.monthly_limit,
            "spent": spent_by_category.get(b.category, 0),
        }
        for b in budgets
    ]


def set_category_budget(db: Session, user_id: int, category: str, new_limit: float):
    budget = (
        db.query(CategoryBudget)
        .filter(CategoryBudget.user_id == user_id, CategoryBudget.category == category)
        .first()
    )
    if budget:
        budget.monthly_limit = new_limit
    else:
        budget = CategoryBudget(user_id=user_id, category=category, monthly_limit=new_limit)
        db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


def delete_category_budget(db: Session, user_id: int, category: str):
    db.query(CategoryBudget).filter(
        CategoryBudget.user_id == user_id, CategoryBudget.category == category
    ).delete()
    db.commit()
