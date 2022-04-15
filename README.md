# Smart Expense Tracker

This is my expense tracker project for college. Basically it lets you add your
daily expenses, put them into categories, set a monthly budget and see some
charts about your spending.

Made this to practice full stack dev - React on frontend and FastAPI on the
backend, with SQLite as the database (no need to set up a server for the db,
its just a file).

## Status

🚧 work in progress, building this feature by feature.

## Tech Stack

**Frontend**
- React (with Vite)
- React Router
- Axios (for calling the backend api)
- Recharts (for the charts)

**Backend**
- Python
- FastAPI
- SQLite + SQLAlchemy

## Project Structure

```
jatin4114/
├── backend/
│   ├── app/
│   │   ├── main.py        # fastapi app starts here
│   │   ├── routes/        # api endpoints
│   │   ├── models/        # db models (sqlalchemy)
│   │   ├── schemas/       # pydantic schemas (request/response shapes)
│   │   ├── services/      # business logic
│   │   ├── database/      # db connection/session stuff
│   │   └── auth/          # login/register/jwt stuff
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
└── README.md
```

## How to run it

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # on windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

backend will run at http://127.0.0.1:8000
you can check http://127.0.0.1:8000/docs for the auto generated api docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

frontend will run at http://127.0.0.1:5173

## Features (planned)

- [x] project setup
- [ ] dashboard with summary cards + chart
- [ ] add / edit / delete expenses
- [ ] search + filter expenses
- [ ] analytics page with charts
- [ ] monthly budget + warnings
- [ ] login / register (auth)

More docs (screenshots, api reference etc) will be added once the app is
further along.
