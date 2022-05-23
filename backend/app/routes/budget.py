# budget.py - api endpoints for getting/setting the monthly budget
# (both the one overall budget, and optional per-category ones)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.budget import BudgetOut, BudgetUpdate, CategoryBudgetOut, CategoryBudgetUpdate, Category
from app.services import budget_service
from app.models.user import User
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/budget", tags=["budget"])


@router.get("", response_model=BudgetOut)
def get_budget(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return budget_service.get_or_create_budget(db, current_user.id)


@router.put("", response_model=BudgetOut)
def set_budget(
    data: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return budget_service.update_budget(db, current_user.id, data.monthly_limit)


@router.get("/categories", response_model=list[CategoryBudgetOut])
def list_category_budgets(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return budget_service.get_category_budgets(db, current_user.id)


@router.put("/categories/{category}", response_model=CategoryBudgetOut)
def set_category_budget(
    category: Category,
    data: CategoryBudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = budget_service.set_category_budget(db, current_user.id, category, data.monthly_limit)
    return {"category": budget.category, "monthly_limit": budget.monthly_limit, "spent": 0}


@router.delete("/categories/{category}", status_code=204)
def remove_category_budget(
    category: Category,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget_service.delete_category_budget(db, current_user.id, category)
