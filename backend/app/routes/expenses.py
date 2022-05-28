# expenses.py - api endpoints for CRUD on expenses
# all of these require login, and only ever touch the logged in user's
# own expenses

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseOut, ImportResult
from app.services import expense_service
from app.models.user import User
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("", response_model=list[ExpenseOut])
def list_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return expense_service.get_expenses(db, current_user.id)


# NOTE: this has to be defined before GET /{expense_id}, otherwise
# fastapi tries to match "export" as an expense_id and 422s
@router.get("/export")
def export_expenses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    csv_data = expense_service.export_expenses_csv(db, current_user.id)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=expenses.csv"},
    )


@router.post("/import", response_model=ImportResult)
async def import_expenses(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a .csv file")

    contents = await file.read()
    csv_text = contents.decode("utf-8")
    return expense_service.import_expenses_csv(db, csv_text, current_user.id)


@router.post("", response_model=ExpenseOut, status_code=201)
def add_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return expense_service.create_expense(db, expense, current_user.id)


@router.get("/{expense_id}", response_model=ExpenseOut)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = expense_service.get_expense_by_id(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseOut)
def edit_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = expense_service.get_expense_by_id(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense_service.update_expense(db, expense, expense_data)


@router.delete("/{expense_id}", status_code=204)
def remove_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = expense_service.get_expense_by_id(db, expense_id, current_user.id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    expense_service.delete_expense(db, expense)
