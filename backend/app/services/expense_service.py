# expense_service.py
# all the actual db logic for expenses lives here, so the routes file
# stays small and just handles http stuff

import csv
import io
from datetime import datetime
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate


def get_expenses(db: Session, user_id: int = None):
    query = db.query(Expense)
    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)
    # newest first, makes more sense for a list of expenses
    return query.order_by(Expense.date.desc()).all()


def get_expense_by_id(db: Session, expense_id: int, user_id: int = None):
    query = db.query(Expense).filter(Expense.id == expense_id)
    if user_id is not None:
        query = query.filter(Expense.user_id == user_id)
    return query.first()


def create_expense(db: Session, expense_data: ExpenseCreate, user_id: int = None):
    new_expense = Expense(
        title=expense_data.title,
        amount=expense_data.amount,
        category=expense_data.category,
        date=expense_data.date,
        description=expense_data.description,
        payment_method=expense_data.payment_method,
        user_id=user_id,
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


def update_expense(db: Session, expense: Expense, expense_data: ExpenseUpdate):
    expense.title = expense_data.title
    expense.amount = expense_data.amount
    expense.category = expense_data.category
    expense.date = expense_data.date
    expense.description = expense_data.description
    expense.payment_method = expense_data.payment_method

    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense: Expense):
    db.delete(expense)
    db.commit()


def export_expenses_csv(db: Session, user_id: int = None) -> str:
    # builds a csv file (as a string) of all the user's expenses, so
    # they can download their data and open it in excel/sheets
    expenses = get_expenses(db, user_id)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        ["Title", "Amount", "Category", "Date", "Description", "Payment Method"]
    )
    for exp in expenses:
        writer.writerow(
            [exp.title, exp.amount, exp.category, exp.date, exp.description or "", exp.payment_method or ""]
        )

    return output.getvalue()


def import_expenses_csv(db: Session, csv_text: str, user_id: int = None):
    # reads the same format export_expenses_csv writes, but is
    # forgiving about it - skips bad rows instead of failing the
    # whole import, and reports which ones it skipped and why
    reader = csv.DictReader(io.StringIO(csv_text))

    created = 0
    errors = []

    for row_num, row in enumerate(reader, start=2):  # row 1 is the header
        try:
            expense_data = ExpenseCreate(
                title=row.get("Title", ""),
                amount=float(row.get("Amount", 0)),
                category=row.get("Category", ""),
                date=datetime.strptime(row.get("Date", ""), "%Y-%m-%d").date(),
                description=row.get("Description") or None,
                payment_method=row.get("Payment Method") or None,
            )
        except (ValidationError, ValueError, TypeError) as e:
            errors.append({"row": row_num, "error": str(e)})
            continue

        create_expense(db, expense_data, user_id)
        created += 1

    return {"created": created, "errors": errors}
