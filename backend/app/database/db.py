# db.py
# this file sets up the connection to our sqlite database

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# if theres no .env file just fall back to a local sqlite file
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./expense_tracker.db")

# check_same_thread is needed only for sqlite (fastapi uses multiple threads)
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# this is a fastapi dependency, gives each request its own db session
# and makes sure it gets closed afterwards
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
