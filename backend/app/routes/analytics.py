# analytics.py - api endpoints for the analytics page (per logged in user)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.analytics import SummaryOut, CategoryTotal, MonthlyTotal, TopTitle, WeekdayBreakdown
from app.services import analytics_service
from app.models.user import User
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=SummaryOut)
def summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return analytics_service.get_summary(db, current_user.id)


@router.get("/categories", response_model=list[CategoryTotal])
def categories(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return analytics_service.get_category_breakdown(db, current_user.id)


@router.get("/monthly", response_model=list[MonthlyTotal])
def monthly(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return analytics_service.get_monthly_breakdown(db, current_user.id)


@router.get("/top-titles", response_model=list[TopTitle])
def top_titles(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return analytics_service.get_top_titles(db, current_user.id)


@router.get("/weekday-breakdown", response_model=WeekdayBreakdown)
def weekday_breakdown(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return analytics_service.get_weekday_breakdown(db, current_user.id)
