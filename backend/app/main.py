# main.py
# this is the entry point of my fastapi backend
# run it with: uvicorn app.main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import Base, engine
from app.models import user, expense  # noqa: F401 (needed so tables get created)
from app.routes import expenses, analytics

app = FastAPI(title="Smart Expense Tracker API")

# creates the sqlite tables if they dont already exist
# (not using alembic migrations for this project, keeping it simple)
Base.metadata.create_all(bind=engine)

# allow the react frontend (localhost:5173) to talk to this backend
# without this we get CORS errors in the browser console
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    # just a simple check to see if server is alive
    return {"message": "Smart Expense Tracker API is running!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(expenses.router)
app.include_router(analytics.router)

# NOTE: routers for auth and budget
# will be added here in later phases once they are built
