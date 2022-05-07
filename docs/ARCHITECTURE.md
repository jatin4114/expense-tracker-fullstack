# Architecture

Quick overview of how this project is put together and why I made
some of the choices I did. Written mainly so future-me (or anyone
else reading this) doesn't have to reverse engineer it.

## High level

```
┌─────────────────┐        HTTP/JSON        ┌──────────────────┐        ┌──────────────┐
│  React frontend  │  ───────────────────▶  │  FastAPI backend  │  ───▶  │  SQLite db    │
│  (vite, :5173)    │  ◀───────────────────  │  (:8000)          │  ◀───  │  (a file)     │
└─────────────────┘                          └──────────────────┘        └──────────────┘
```

The frontend is a normal single page app (SPA) - it never talks to
the database directly, everything goes through the FastAPI backend
over a REST api. The backend is the only thing that knows the db even
exists.

## Why these choices

- **SQLite instead of postgres** - this project never gets deployed,
  its just meant to run on one machine. SQLite is literally just a
  file, no server to install/configure, perfect for that. If this
  ever needed to support multiple concurrent users on a real server,
  postgres would be a better fit (SQLite locks the whole file on
  writes, doesn't handle a lot of concurrent traffic well).

- **JWT instead of session cookies** - since the frontend and backend
  run on different ports during dev (5173 vs 8000) and this is a pure
  api + SPA setup (not server rendered pages), a token based approach
  is simpler than dealing with cookie/CORS/session store complexity.
  The token just gets stored in localStorage and sent as a header.

- **No Redux/Zustand/etc for state** - the app just isn't big enough
  to need a global state library. Each page fetches its own data with
  `useState`/`useEffect`, and the only truly global state (who's
  logged in) lives in a small React Context (`AuthContext`).

- **No Alembic migrations** - `Base.metadata.create_all()` just
  creates tables from the current models if they don't exist. Since
  this is a fresh local sqlite file that never needs to preserve data
  across schema changes in production, a real migration tool would be
  overkill. (If the schema changes during dev, I just delete the
  local `.db` file and let it recreate.)

## Backend structure

```
backend/app/
├── main.py          entry point - creates the FastAPI app, wires up
│                     CORS and all the routers
├── database/
│   └── db.py         sqlalchemy engine/session setup + get_db()
│                     dependency
├── models/            sqlalchemy ORM models (User, Expense, Budget) -
│                     these map directly to db tables
├── schemas/           pydantic models - define what shape of json is
│                     accepted/returned by each endpoint, plus
│                     validation rules (min length, > 0, etc)
├── routes/             the actual API endpoints. thin - they mostly
│                     just call into services/ and handle the
│                     http-specific stuff (status codes, 404s)
├── services/           the actual business logic / db queries live
│                     here, separate from the http layer so its
│                     easier to test and reason about
└── auth/
    ├── security.py    password hashing (bcrypt) + jwt encode/decode
    └── dependencies.py  get_current_user() - a FastAPI dependency
                         that reads the Authorization header, decodes
                         the token, and looks up the user. any route
                         that needs auth just adds this as a param
```

**Request flow example** (creating an expense):

1. `POST /expenses` hits `routes/expenses.py::add_expense`
2. `Depends(get_current_user)` runs first - decodes the JWT, loads the
   `User` row, and 401s if anything's wrong
3. The route calls `services/expense_service.py::create_expense()`
   with the validated `ExpenseCreate` schema + the user's id
4. The service builds an `Expense` ORM object and commits it
5. The route returns it, and the `response_model=ExpenseOut` schema
   controls exactly what json shape gets sent back

## Frontend structure

```
frontend/src/
├── main.jsx            mounts the app, wraps it in BrowserRouter +
│                       AuthProvider
├── App.jsx             all the routes - public (login/register) vs
│                       protected (everything else, wrapped in
│                       ProtectedRoute + the DashboardLayout shell)
├── context/
│   └── AuthContext.jsx  holds the jwt token + logged in user's
│                       email, persisted to localStorage. exposes
│                       login()/register()/logout()
├── api/                 one file per resource (expenses.js,
│                       budget.js, etc) - thin wrappers around axios
│                       calls, this is the ONLY place that knows the
│                       api's urls/shapes
├── components/          reusable pieces, organized by feature
│   ├── layout/           sidebar, topbar, the DashboardLayout shell
│   ├── dashboard/         summary cards, recent expenses, chart
│   ├── expenses/          list, form (shared by add+edit), filters,
│   │                     delete confirmation
│   ├── analytics/         pie chart + line chart
│   ├── budget/             progress bar, budget form
│   └── common/             Modal, LoadingSpinner, EmptyState,
│                          ErrorMessage, ProtectedRoute - generic
│                          stuff used everywhere
├── pages/                one component per route - these compose
│                       the components above + fetch data + manage
│                       page level state (loading/error/etc)
└── utils/                small stuff like the categories list and
                        their colors, kept in one place so it's easy
                        to change later
```

**Auth flow:**

1. User logs in -> `AuthContext.login()` calls the api, gets a token
   back, stores it in state + localStorage
2. Every axios request automatically gets the token attached via a
   request interceptor (`api/axios.js`) - no page needs to think
   about this
3. `ProtectedRoute` checks `isAuthenticated` (just `!!token`) and
   redirects to `/login` if there's no token
4. If any api call ever gets back a `401` (token expired/invalid), a
   response interceptor automatically logs the user out and redirects
   them to login

## Data model

```
User
 └── has many Expenses (user_id foreign key)
 └── has one Budget    (user_id foreign key)
```

Nothing fancier than that - no per-category budgets, no shared/group
expenses, no recurring expenses. Kept intentionally simple for what
this project needs to demonstrate.
