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


def test_get_me(client, auth_headers):
    res = client.get("/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["email"] == "test@example.com"


def test_get_me_requires_auth(client):
    res = client.get("/auth/me")
    assert res.status_code == 401


def test_change_password(client, auth_headers):
    res = client.put(
        "/auth/password",
        json={"current_password": "pass123", "new_password": "newpass456"},
        headers=auth_headers,
    )
    assert res.status_code == 200

    # old password should no longer work
    old_login = client.post(
        "/auth/login", json={"email": "test@example.com", "password": "pass123"}
    )
    assert old_login.status_code == 401

    # new password should work
    new_login = client.post(
        "/auth/login", json={"email": "test@example.com", "password": "newpass456"}
    )
    assert new_login.status_code == 200


def test_change_password_wrong_current_fails(client, auth_headers):
    res = client.put(
        "/auth/password",
        json={"current_password": "wrongpassword", "new_password": "newpass456"},
        headers=auth_headers,
    )
    assert res.status_code == 400


def test_delete_account(client, auth_headers):
    res = client.request(
        "DELETE", "/auth/me", json={"password": "pass123"}, headers=auth_headers
    )
    assert res.status_code == 204

    # cant log in anymore after deleting
    login_res = client.post(
        "/auth/login", json={"email": "test@example.com", "password": "pass123"}
    )
    assert login_res.status_code == 401


def test_delete_account_wrong_password_fails(client, auth_headers):
    res = client.request(
        "DELETE", "/auth/me", json={"password": "wrongpassword"}, headers=auth_headers
    )
    assert res.status_code == 400
