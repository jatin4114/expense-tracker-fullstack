# test_expenses.py - tests for the expense CRUD endpoints


def test_cannot_list_expenses_without_token(client):
    res = client.get("/expenses")
    assert res.status_code == 401


def test_create_and_list_expense(client, auth_headers):
    res = client.post(
        "/expenses",
        json={"title": "Pizza", "amount": 250, "category": "Food", "date": "2026-09-01"},
        headers=auth_headers,
    )
    assert res.status_code == 201
    assert res.json()["title"] == "Pizza"

    res = client.get("/expenses", headers=auth_headers)
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_create_expense_invalid_amount_fails(client, auth_headers):
    res = client.post(
        "/expenses",
        json={"title": "Bad", "amount": -5, "category": "Food", "date": "2026-09-01"},
        headers=auth_headers,
    )
    assert res.status_code == 422


def test_create_expense_invalid_category_fails(client, auth_headers):
    res = client.post(
        "/expenses",
        json={"title": "Bad", "amount": 10, "category": "NotACategory", "date": "2026-09-01"},
        headers=auth_headers,
    )
    assert res.status_code == 422


def test_update_expense(client, auth_headers):
    create_res = client.post(
        "/expenses",
        json={"title": "Pizza", "amount": 250, "category": "Food", "date": "2026-09-01"},
        headers=auth_headers,
    )
    expense_id = create_res.json()["id"]

    update_res = client.put(
        f"/expenses/{expense_id}",
        json={"title": "Pizza Large", "amount": 350, "category": "Food", "date": "2026-09-01"},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Pizza Large"
    assert update_res.json()["amount"] == 350


def test_delete_expense(client, auth_headers):
    create_res = client.post(
        "/expenses",
        json={"title": "Pizza", "amount": 250, "category": "Food", "date": "2026-09-01"},
        headers=auth_headers,
    )
    expense_id = create_res.json()["id"]

    delete_res = client.delete(f"/expenses/{expense_id}", headers=auth_headers)
    assert delete_res.status_code == 204

    get_res = client.get(f"/expenses/{expense_id}", headers=auth_headers)
    assert get_res.status_code == 404


def test_get_nonexistent_expense_404s(client, auth_headers):
    res = client.get("/expenses/9999", headers=auth_headers)
    assert res.status_code == 404


def test_export_csv(client, auth_headers):
    client.post(
        "/expenses",
        json={"title": "Pizza", "amount": 250, "category": "Food", "date": "2026-09-01"},
        headers=auth_headers,
    )
    res = client.get("/expenses/export", headers=auth_headers)
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("text/csv")
    assert "attachment" in res.headers["content-disposition"]
    assert "Title,Amount,Category,Date,Description,Payment Method" in res.text
    assert "Pizza" in res.text


def test_export_csv_requires_auth(client):
    res = client.get("/expenses/export")
    assert res.status_code == 401


def test_users_only_see_their_own_expenses(client):
    # register two separate users
    client.post("/auth/register", json={"email": "userA@test.com", "password": "pass123"})
    client.post("/auth/register", json={"email": "userB@test.com", "password": "pass123"})

    token_a = client.post(
        "/auth/login", json={"email": "userA@test.com", "password": "pass123"}
    ).json()["access_token"]
    token_b = client.post(
        "/auth/login", json={"email": "userB@test.com", "password": "pass123"}
    ).json()["access_token"]

    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # user A creates an expense
    create_res = client.post(
        "/expenses",
        json={"title": "Secret expense", "amount": 100, "category": "Food", "date": "2026-09-01"},
        headers=headers_a,
    )
    expense_id = create_res.json()["id"]

    # user B's list should be empty
    res = client.get("/expenses", headers=headers_b)
    assert res.json() == []

    # user B shouldnt be able to fetch user A's expense by id either
    res = client.get(f"/expenses/{expense_id}", headers=headers_b)
    assert res.status_code == 404
