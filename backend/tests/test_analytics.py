# test_analytics.py - tests for the analytics calculations


def seed_expenses(client, headers):
    client.post(
        "/expenses",
        json={"title": "Pizza", "amount": 250, "category": "Food", "date": "2026-09-01"},
        headers=headers,
    )
    client.post(
        "/expenses",
        json={"title": "Bus", "amount": 100, "category": "Transport", "date": "2026-09-05"},
        headers=headers,
    )
    client.post(
        "/expenses",
        json={"title": "Book", "amount": 500, "category": "Education", "date": "2026-08-20"},
        headers=headers,
    )


def test_summary_with_no_expenses(client, auth_headers):
    res = client.get("/analytics/summary", headers=auth_headers)
    assert res.status_code == 200
    assert res.json() == {
        "total_spending": 0,
        "average_daily_spending": 0,
        "highest_expense": 0,
        "total_expenses": 0,
    }


def test_summary_calculations(client, auth_headers):
    seed_expenses(client, auth_headers)
    res = client.get("/analytics/summary", headers=auth_headers)
    data = res.json()
    assert data["total_spending"] == 850
    assert data["highest_expense"] == 500
    assert data["total_expenses"] == 3
    # aug 20 -> sep 5 is 17 days, 850 / 17 = 50
    assert data["average_daily_spending"] == 50


def test_category_breakdown(client, auth_headers):
    seed_expenses(client, auth_headers)
    res = client.get("/analytics/categories", headers=auth_headers)
    totals = {row["category"]: row["total"] for row in res.json()}
    assert totals == {"Food": 250, "Transport": 100, "Education": 500}


def test_monthly_breakdown(client, auth_headers):
    seed_expenses(client, auth_headers)
    res = client.get("/analytics/monthly", headers=auth_headers)
    totals = {row["month"]: row["total"] for row in res.json()}
    assert totals == {"2026-08": 500, "2026-09": 350}


def test_top_titles(client, auth_headers):
    for _ in range(3):
        client.post(
            "/expenses",
            json={"title": "Coffee", "amount": 50, "category": "Food", "date": "2026-09-01"},
            headers=auth_headers,
        )
    client.post(
        "/expenses",
        json={"title": "Pizza", "amount": 300, "category": "Food", "date": "2026-09-02"},
        headers=auth_headers,
    )

    res = client.get("/analytics/top-titles", headers=auth_headers)
    data = res.json()
    assert data[0] == {"title": "Coffee", "count": 3}
    assert data[1] == {"title": "Pizza", "count": 1}


def test_weekday_breakdown(client, auth_headers):
    # 2026-09-05 is a saturday, 2026-09-07 is a monday
    client.post(
        "/expenses",
        json={"title": "Weekend thing", "amount": 200, "category": "Food", "date": "2026-09-05"},
        headers=auth_headers,
    )
    client.post(
        "/expenses",
        json={"title": "Weekday thing", "amount": 100, "category": "Food", "date": "2026-09-07"},
        headers=auth_headers,
    )

    res = client.get("/analytics/weekday-breakdown", headers=auth_headers)
    assert res.json() == {"weekday_total": 100, "weekend_total": 200}
