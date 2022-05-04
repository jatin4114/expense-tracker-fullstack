# budget.py - api endpoints for getting/setting the monthly budget

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.budget import BudgetOut, BudgetUpdate
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
