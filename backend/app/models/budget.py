# budget.py - db model for a user's monthly budget
# keeping it simple: just one monthly_limit value per user (no per
# category budgets or anything fancy for this project)

from sqlalchemy import Column, Integer, Float, ForeignKey
from app.database.db import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    monthly_limit = Column(Float, nullable=False, default=0)
