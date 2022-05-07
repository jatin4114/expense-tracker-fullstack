# test_auth.py - tests for register/login


def test_register_creates_user(client):
    res = client.post("/auth/register", json={"email": "new@test.com", "password": "pass123"})
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "new@test.com"
    assert "id" in data
    # password should never come back in the response
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email_fails(client):
    client.post("/auth/register", json={"email": "dupe@test.com", "password": "pass123"})
    res = client.post("/auth/register", json={"email": "dupe@test.com", "password": "pass123"})
    assert res.status_code == 400


def test_register_short_password_fails(client):
    res = client.post("/auth/register", json={"email": "short@test.com", "password": "123"})
    assert res.status_code == 422


def test_register_invalid_email_fails(client):
    res = client.post("/auth/register", json={"email": "not-an-email", "password": "pass123"})
    assert res.status_code == 422


def test_login_success(client):
    client.post("/auth/register", json={"email": "login@test.com", "password": "pass123"})
    res = client.post("/auth/login", json={"email": "login@test.com", "password": "pass123"})
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_wrong_password_fails(client):
    client.post("/auth/register", json={"email": "login2@test.com", "password": "pass123"})
    res = client.post("/auth/login", json={"email": "login2@test.com", "password": "wrong"})
    assert res.status_code == 401


def test_login_nonexistent_user_fails(client):
    res = client.post("/auth/login", json={"email": "ghost@test.com", "password": "pass123"})
    assert res.status_code == 401
