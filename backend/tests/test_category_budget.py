# test_category_budget.py - tests for per-category budgets

from datetime import date


def test_list_category_budgets_empty(client, auth_headers):
    res = client.get("/budget/categories", headers=auth_headers)
    assert res.status_code == 200
    assert res.json() == []


def test_set_category_budget(client, auth_headers):
    res = client.put(
        "/budget/categories/Food", json={"monthly_limit": 1000}, headers=auth_headers
    )
    assert res.status_code == 200
    assert res.json()["category"] == "Food"
    assert res.json()["monthly_limit"] == 1000


def test_set_category_budget_invalid_category_fails(client, auth_headers):
    res = client.put(
        "/budget/categories/NotACategory", json={"monthly_limit": 1000}, headers=auth_headers
    )
    assert res.status_code == 422


def test_category_budget_shows_spent_amount(client, auth_headers):
    client.put("/budget/categories/Food", json={"monthly_limit": 1000}, headers=auth_headers)
    today = date.today().isoformat()
    client.post(
        "/expenses",
        json={"title": "Pizza", "amount": 300, "category": "Food", "date": today},
        headers=auth_headers,
    )

    res = client.get("/budget/categories", headers=auth_headers)
    food_budget = next(b for b in res.json() if b["category"] == "Food")
    assert food_budget["spent"] == 300


def test_update_existing_category_budget(client, auth_headers):
    client.put("/budget/categories/Food", json={"monthly_limit": 1000}, headers=auth_headers)
    res = client.put(
        "/budget/categories/Food", json={"monthly_limit": 1500}, headers=auth_headers
    )
    assert res.json()["monthly_limit"] == 1500

    # should still just be one row, not two
    list_res = client.get("/budget/categories", headers=auth_headers)
    assert len(list_res.json()) == 1


def test_delete_category_budget(client, auth_headers):
    client.put("/budget/categories/Food", json={"monthly_limit": 1000}, headers=auth_headers)
    del_res = client.delete("/budget/categories/Food", headers=auth_headers)
    assert del_res.status_code == 204

    list_res = client.get("/budget/categories", headers=auth_headers)
    assert list_res.json() == []


def test_category_budgets_require_auth(client):
    res = client.get("/budget/categories")
    assert res.status_code == 401
