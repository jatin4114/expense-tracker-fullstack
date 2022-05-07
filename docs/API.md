# API Reference

Base URL when running locally: `http://127.0.0.1:8000`

FastAPI also generates interactive docs automatically - once the
backend is running you can go to `http://127.0.0.1:8000/docs` (Swagger
UI) and actually try out the endpoints from the browser, which is way
easier than reading this file honestly. This doc is more for a quick
reference.

All endpoints except `/auth/register` and `/auth/login` require a JWT
token, sent like this:

```
Authorization: Bearer <your_token>
```

You get the token back from `/auth/login`.

---

## Auth

### POST /auth/register

Create a new account.

**Body:**
```json
{ "email": "you@college.edu", "password": "at least 6 chars" }
```

**Response `201`:**
```json
{ "id": 1, "email": "you@college.edu", "created_at": "2026-09-07T10:00:00" }
```

**Errors:** `400` if email already registered, `422` if email is
invalid or password is too short.

### POST /auth/login

**Body:**
```json
{ "email": "you@college.edu", "password": "yourpassword" }
```

**Response `200`:**
```json
{ "access_token": "eyJhbGciOi...", "token_type": "bearer" }
```

**Errors:** `401` if email/password is wrong.

---

## Expenses

All of these require the `Authorization` header and only ever
return/affect the logged in user's own expenses.

### GET /expenses

Returns a list of all your expenses, newest date first.

### POST /expenses

**Body:**
```json
{
  "title": "Pizza",
  "amount": 250,
  "category": "Food",
  "date": "2026-09-01",
  "description": "with friends",
  "payment_method": "UPI"
}
```

`category` has to be one of: `Food`, `Transport`, `Education`,
`Shopping`, `Entertainment`, `Bills`, `Other`. `amount` has to be
greater than 0. `description` and `payment_method` are optional.

**Response `201`:** the created expense (includes `id` and
`created_at`).

### GET /expenses/{id}

Returns a single expense. `404` if it doesn't exist or belongs to
someone else.

### PUT /expenses/{id}

Same body as POST, updates the expense. `404` if not found.

### DELETE /expenses/{id}

`204` No Content on success, `404` if not found.

---

## Analytics

### GET /analytics/summary

```json
{
  "total_spending": 850,
  "average_daily_spending": 50,
  "highest_expense": 500,
  "total_expenses": 3
}
```

`average_daily_spending` = total spending / number of days between
your first and last expense.

### GET /analytics/categories

Spending grouped by category:
```json
[
  { "category": "Food", "total": 250 },
  { "category": "Transport", "total": 100 }
]
```

### GET /analytics/monthly

Spending grouped by month:
```json
[
  { "month": "2026-08", "total": 500 },
  { "month": "2026-09", "total": 350 }
]
```

---

## Budget

### GET /budget

Returns your budget, creating a default one (`monthly_limit: 0`) the
first time you ask.

```json
{ "monthly_limit": 8000 }
```

### PUT /budget

**Body:**
```json
{ "monthly_limit": 8000 }
```

`monthly_limit` cant be negative (`422` if it is).
