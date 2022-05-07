# test_budget.py - tests for budget endpoints


def test_get_budget_creates_default(client, auth_headers):
    res = client.get("/budget", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["monthly_limit"] == 0


def test_update_budget(client, auth_headers):
    res = client.put("/budget", json={"monthly_limit": 8000}, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["monthly_limit"] == 8000

    # should persist on next get
    res = client.get("/budget", headers=auth_headers)
    assert res.json()["monthly_limit"] == 8000


def test_negative_budget_fails(client, auth_headers):
    res = client.put("/budget", json={"monthly_limit": -100}, headers=auth_headers)
    assert res.status_code == 422


def test_budget_requires_auth(client):
    res = client.get("/budget")
    assert res.status_code == 401
