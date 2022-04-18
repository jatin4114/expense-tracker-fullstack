# expenses.py - api endpoints for CRUD on expenses

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseOut
from app.services import expense_service

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("", response_model=list[ExpenseOut])
def list_expenses(db: Session = Depends(get_db)):
    # TODO phase 9: only return expenses for the logged in user
    return expense_service.get_expenses(db)


@router.post("", response_model=ExpenseOut, status_code=201)
def add_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    return expense_service.create_expense(db, expense)


@router.get("/{expense_id}", response_model=ExpenseOut)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = expense_service.get_expense_by_id(db, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseOut)
def edit_expense(expense_id: int, expense_data: ExpenseUpdate, db: Session = Depends(get_db)):
    expense = expense_service.get_expense_by_id(db, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense_service.update_expense(db, expense, expense_data)


@router.delete("/{expense_id}", status_code=204)
def remove_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = expense_service.get_expense_by_id(db, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    expense_service.delete_expense(db, expense)
