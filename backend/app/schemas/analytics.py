# analytics.py (schemas) - response shapes for the analytics endpoints

from pydantic import BaseModel


class SummaryOut(BaseModel):
    total_spending: float
    average_daily_spending: float
    highest_expense: float
    total_expenses: int


class CategoryTotal(BaseModel):
    category: str
    total: float


class MonthlyTotal(BaseModel):
    month: str  # e.g. "2026-09"
    total: float


class TopTitle(BaseModel):
    title: str
    count: int


class WeekdayBreakdown(BaseModel):
    weekday_total: float
    weekend_total: float
