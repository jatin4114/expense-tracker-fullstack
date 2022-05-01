# budget.py (schemas)

from pydantic import BaseModel, Field


class BudgetUpdate(BaseModel):
    monthly_limit: float = Field(ge=0, description="monthly budget cant be negative")


class BudgetOut(BaseModel):
    monthly_limit: float

    class Config:
        from_attributes = True
