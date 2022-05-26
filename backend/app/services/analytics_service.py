# analytics_service.py
# calculations for the analytics page - totals, averages, breakdowns etc

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.expense import Expense


def get_summary(db: Session, user_id: int = None):
    query = db.query(Expense)
    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)

    expenses = query.all()

    if not expenses:
        return {
            "total_spending": 0,
            "average_daily_spending": 0,
            "highest_expense": 0,
            "total_expenses": 0,
        }

    total_spending = sum(e.amount for e in expenses)
    highest_expense = max(e.amount for e in expenses)

    # average daily spending = total spent / number of days between the
    # first and last expense (so it doesnt look weirdly small/big
    # depending on when you started using the app)
    dates = [e.date for e in expenses]
    days_range = (max(dates) - min(dates)).days + 1
    average_daily_spending = total_spending / days_range

    return {
        "total_spending": round(total_spending, 2),
        "average_daily_spending": round(average_daily_spending, 2),
        "highest_expense": highest_expense,
        "total_expenses": len(expenses),
    }


def get_category_breakdown(db: Session, user_id: int = None):
    query = db.query(Expense.category, func.sum(Expense.amount).label("total"))
    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)

    results = query.group_by(Expense.category).all()
    return [{"category": category, "total": round(total, 2)} for category, total in results]


def get_monthly_breakdown(db: Session, user_id: int = None):
    query = db.query(Expense)
    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)

    expenses = query.all()

    # group manually by "YYYY-MM" string, sqlite date functions are a
    # bit annoying to work with so doing it in python instead
    totals = {}
    for e in expenses:
        month_key = e.date.strftime("%Y-%m")
        totals[month_key] = totals.get(month_key, 0) + e.amount

    # sort by month so the chart line goes left to right chronologically
    sorted_months = sorted(totals.keys())
    return [{"month": m, "total": round(totals[m], 2)} for m in sorted_months]


def get_top_titles(db: Session, user_id: int = None, limit: int = 5):
    # which expense titles show up most often - eg if "Coffee" appears
    # a bunch of times, that stands out here even if no single coffee
    # purchase was very expensive
    query = db.query(Expense.title, func.count(Expense.id).label("count"))
    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)

    results = (
        query.group_by(Expense.title)
        .order_by(func.count(Expense.id).desc())
        .limit(limit)
        .all()
    )
    return [{"title": title, "count": count} for title, count in results]


def get_weekday_breakdown(db: Session, user_id: int = None):
    # weekday (mon-fri) vs weekend (sat-sun) spending totals
    query = db.query(Expense)
    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)

    weekday_total = 0
    weekend_total = 0
    for e in query.all():
        if e.date.weekday() >= 5:  # 5=saturday, 6=sunday
            weekend_total += e.amount
        else:
            weekday_total += e.amount

    return {"weekday_total": round(weekday_total, 2), "weekend_total": round(weekend_total, 2)}
