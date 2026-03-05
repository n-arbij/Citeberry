# Citeberry 🍓

A multi-tenant **Quote & Invoicing SaaS** platform built with FastAPI and React.

---

## Features

- **Multi-tenant organizations** — users create or join orgs; admins approve join requests
- **Quotes** — create, edit, view, and delete quotes with line items and auto-calculated totals; convert accepted quotes to invoices
- **Invoices** — full invoice lifecycle with status tracking (unpaid / paid / overdue)
- **Clients** — manage client records scoped to your organization
- **Notifications** — per-org notifications with unread badge and mark-as-read
- **Activity Logs** — audit trail of actions within the org
- **User Management** — admins can elevate/demote roles and lock/unlock accounts
- **User Profile** — edit username, email, password; delete account; admins can deactivate their org
- **Role-based access** — `admin` and `user` roles with guarded endpoints

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Python 3.11+, FastAPI, SQLAlchemy (SQLite)      |
| Auth      | JWT (python-jose), Argon2 password hashing      |
| Frontend  | React 19, Vite, React Router v7                 |
| DB        | SQLite (`citeberry.db`)                         |

---

## Project Structure

```
quote_invoicing_sys/
├── app/
│   ├── auth/           # JWT utilities
│   ├── models/         # Pydantic request/response schemas
│   ├── routers/        # FastAPI route handlers
│   ├── services/       # Business logic layer
│   ├── database.py     # SQLAlchemy ORM models + migrations
│   ├── dependencies.py # Shared DI (get_db, require_admin, etc.)
│   └── main.py         # App entry point, CORS, lifespan
├── frontend/
│   └── src/
│       ├── api/        # Fetch wrappers for each resource
│       ├── components/ # Reusable UI components
│       ├── pages/      # Top-level pages (Dashboard, Login, etc.)
│       └── sections/   # Dashboard section panels
├── requirements.txt
└── citeberry.db
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server (auto-reloads on file changes)
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## API Overview

All authenticated endpoints require `Authorization: Bearer <token>`.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/login` | Obtain JWT token |
| `POST` | `/auth/register` | Register a new user |
| `GET`  | `/api/v1/quotes/` | List org quotes |
| `POST` | `/api/v1/quotes/` | Create a quote |
| `GET`  | `/api/v1/invoices/` | List org invoices |
| `GET`  | `/api/v1/clients/` | List org clients |
| `GET`  | `/api/v1/notifications/` | List notifications |
| `PUT`  | `/api/v1/notifications/{id}/read` | Mark notification read |
| `GET`  | `/api/v1/users/` | List org users (admin) |
| `PUT`  | `/api/v1/users/me` | Update own profile |
| `DELETE` | `/api/v1/users/me` | Delete own account |
| `GET`  | `/api/v1/activity-logs/` | Org activity log (admin) |
| `GET`  | `/api/v1/organizations/` | List active organizations |
| `PUT`  | `/api/v1/organizations/{id}/deactivate` | Deactivate org (admin) |

---

## Default Admin Account

After first run, seed your database or register and manually promote a user.  
The app does not ship with a default admin — create one via `POST /auth/register` and update the `role` column directly.

---

## License

MIT
