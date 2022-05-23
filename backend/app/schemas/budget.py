# budget.py (schemas)

from typing import Literal
from pydantic import BaseModel, Field

Category = Literal[
    "Food", "Transport", "Education", "Shopping", "Entertainment", "Bills", "Other"
]


class BudgetUpdate(BaseModel):
    monthly_limit: float = Field(ge=0, description="monthly budget cant be negative")


class BudgetOut(BaseModel):
    monthly_limit: float

    class Config:
        from_attributes = True


class CategoryBudgetUpdate(BaseModel):
    monthly_limit: float = Field(ge=0, description="monthly budget cant be negative")


class CategoryBudgetOut(BaseModel):
    category: str
    monthly_limit: float
    spent: float = 0

    class Config:
        from_attributes = True
