# expense.py - db model for a single expense entry

from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.db import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    # nullable for now since login isnt built yet (phase 9), once auth
    # is added every new expense will always have a user_id
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String, nullable=True)
    payment_method = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
