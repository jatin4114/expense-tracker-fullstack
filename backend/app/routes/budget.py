# budget.py - api endpoints for getting/setting the monthly budget

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.budget import BudgetOut, BudgetUpdate
from app.services import budget_service

router = APIRouter(prefix="/budget", tags=["budget"])


@router.get("", response_model=BudgetOut)
def get_budget(db: Session = Depends(get_db)):
    # TODO phase 9: use the logged in user's id instead of None
    return budget_service.get_or_create_budget(db)


@router.put("", response_model=BudgetOut)
def set_budget(data: BudgetUpdate, db: Session = Depends(get_db)):
    return budget_service.update_budget(db, None, data.monthly_limit)
