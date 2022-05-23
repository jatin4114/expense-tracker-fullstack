# category_budget.py - optional per-category budget limits, separate
# from the one overall monthly budget (Budget model). a user doesnt
# have to set these - if they dont, the category just has no limit

from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database.db import Base


class CategoryBudget(Base):
    __tablename__ = "category_budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False)
    monthly_limit = Column(Float, nullable=False)
