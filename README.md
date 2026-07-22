# TaskFlow

A full-stack task management app built with React, Node.js, Express, TypeScript, and PostgreSQL. Log in, create tasks, track them by priority and status, and get a quick overview from the dashboard.

**Live Demo:** https://your-frontend-url.vercel.app  
**API:** https://your-backend-url.onrender.com

---

## Project Overview

After logging in you land on a dashboard showing how many tasks are pending, in progress, completed, or overdue. From there you can create tasks, edit them, delete them, search by title, filter by status or priority, and sort by date. There's also a dark mode toggle and the layout works on mobile.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router, Axios |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| Authentication | JWT + bcrypt |
| Validation | express-validator (backend), controlled forms (frontend) |
| Styling | Pure CSS with CSS custom properties |

---

## Installation Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- Git

### Clone the repository

```bash
git clone https://github.com/Zee-2004/task-management-system.git
cd task-management-system
```

---

## Environment Variables

### Backend

Copy the example file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_long_random_string
JWT_EXPIRES_IN=1h

CORS_ORIGIN=http://localhost:5173
```

To generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Database Setup

```bash
psql -U postgres -c "CREATE DATABASE task_management;"
psql -U postgres -d task_management -f database/schema.sql
psql -U postgres -d task_management -f database/seed.sql
```

Default login credentials:

| Field | Value |
|---|---|
| Email | admin@test.com |
| Password | 123456 |

---

## Running the Backend

```bash
cd backend
npm install
npm run dev
```

Runs at http://localhost:5000. Health check: GET /api/health

---

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173

---

## API Documentation

All endpoints except /api/auth/login require an `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/login | Log in, returns JWT token |
| POST | /api/auth/logout | Log out |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | List tasks (supports search, status, priority, sortBy params) |
| GET | /api/tasks/:id | Get one task |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| GET | /api/tasks/stats/dashboard | Get dashboard counts |

### Task fields

```json
{
  "title": "required, max 200 characters",
  "description": "optional",
  "priority": "Low | Medium | High",
  "status": "Pending | In Progress | Completed",
  "due_date": "YYYY-MM-DD, cannot be in the past"
}
```

---

## Folder Structure

The project is split into three main folders — `backend` for the API, `frontend` for the React app, and `database` for the SQL files. Inside the backend, code is organized by what it does: routes define the endpoints, controllers handle the logic, middleware handles auth and validation, and utils hold shared helpers. The frontend follows a similar pattern with pages, components, an api folder for all HTTP calls, and a context folder for auth state.

---

## Assumptions Made

- A single admin account is used as specified. No registration flow is implemented.
- Overdue means the due date has passed and the task is not completed.
- Search is case-insensitive and matches any part of the title.
- JWT was chosen over session-based auth as it was the preferred option.
- Tasks are scoped to user_id to support multiple users in future.
- Editing an existing overdue task allows saving without changing the date.

---

## Known Limitations

- No registration page (not required by spec).
- Sessions expire after 1 hour — refresh tokens not implemented.
- No automated test suite (listed as a bonus feature).
- Pagination is client-side, 8 tasks per page.

---

## Bonus Features Implemented

- Dark mode, persists across sessions via localStorage
- Toast notifications for all user actions
- Loading indicators and skeleton animations
- Pagination, 8 tasks per page
- Fully responsive across desktop, tablet, and mobile