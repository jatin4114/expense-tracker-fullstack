# analytics.py - api endpoints for the analytics page

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.analytics import SummaryOut, CategoryTotal, MonthlyTotal
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=SummaryOut)
def summary(db: Session = Depends(get_db)):
    return analytics_service.get_summary(db)


@router.get("/categories", response_model=list[CategoryTotal])
def categories(db: Session = Depends(get_db)):
    return analytics_service.get_category_breakdown(db)


@router.get("/monthly", response_model=list[MonthlyTotal])
def monthly(db: Session = Depends(get_db)):
    return analytics_service.get_monthly_breakdown(db)
