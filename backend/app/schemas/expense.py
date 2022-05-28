# expense.py (schemas) - these are the pydantic models fastapi uses
# to validate request bodies and shape the json responses

from datetime import date, datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field

# same categories as the frontend, keep these in sync!
Category = Literal[
    "Food", "Transport", "Education", "Shopping", "Entertainment", "Bills", "Other"
]


# fields needed when creating a new expense
class ExpenseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0, description="amount must be more than 0")
    category: Category
    date: date
    description: Optional[str] = None
    payment_method: Optional[str] = None


# for editing an expense, basically same fields as create
class ExpenseUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0)
    category: Category
    date: date
    description: Optional[str] = None
    payment_method: Optional[str] = None


# what we send back to the frontend
class ExpenseOut(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    date: date
    description: Optional[str] = None
    payment_method: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True  # lets pydantic read straight from the sqlalchemy model


class ImportError_(BaseModel):
    row: int
    error: str


class ImportResult(BaseModel):
    created: int
    errors: list[ImportError_]
