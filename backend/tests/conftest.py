# conftest.py - shared pytest fixtures for all the test files
# sets up a fresh in-memory sqlite db for every test so tests dont
# mess with each other (or with the real expense_tracker.db file)

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.database.db import Base, get_db
from app.auth.rate_limit import _attempts as _rate_limit_attempts

# in-memory db, StaticPool keeps the same connection alive for the
# whole test (normally sqlite in-memory dbs disappear between connections)
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def fresh_db():
    # runs before AND cleans up after every single test function, so
    # each test starts with empty tables
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    # the rate limiter tracks attempts in a plain module-level dict,
    # and every TestClient request looks like it comes from the same
    # fake IP - without this, tests would trip the real rate limit
    # after a handful of login/register calls across the whole suite
    _rate_limit_attempts.clear()
    yield


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def auth_headers(client):
    # registers + logs in a test user, returns headers ready to use
    # in any request that needs auth
    client.post("/auth/register", json={"email": "test@example.com", "password": "pass123"})
    login_res = client.post(
        "/auth/login", json={"email": "test@example.com", "password": "pass123"}
    )
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
