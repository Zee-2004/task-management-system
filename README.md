\# TaskFlow — Task Management System



A full-stack task management application built with React, Node.js, Express, TypeScript, and PostgreSQL. Users can authenticate, manage their daily tasks, and track progress through an intuitive dashboard.



\---

\*\*Live Demo:\*\* `https://your-frontend-url.vercel.app`

\*\*API:\*\* `https://your-backend-url.onrender.com`



\---

\## Project Overview



TaskFlow allows an authenticated user to create, view, update, and delete tasks. A real-time dashboard summarizes task counts by status (Pending, In Progress, Completed, Overdue). The application includes search, filtering, sorting, pagination, dark mode, and is fully responsive across desktop, tablet, and mobile.



\---



\## Technology Stack



| Layer | Technology |

|---|---|

| Frontend | React 18, TypeScript, Vite, React Router, Axios |

| Backend | Node.js, Express.js, TypeScript |

| Database | PostgreSQL |

| Authentication | JWT (JSON Web Tokens) + bcrypt |

| Validation | express-validator (backend), controlled forms (frontend) |

| Styling | Pure CSS with CSS custom properties |



\---



\## Installation Instructions



\### Prerequisites



\- Node.js v18+

\- PostgreSQL v14+

\- Git



\### Clone the repository



```bash

git clone <your-repo-url>

cd task-management-system

```



\---



\## Environment Variables



\### Backend — `backend/.env`



Copy the example file and fill in your values:



```bash

cp backend/.env.example backend/.env

```



```

PORT=5000

NODE\_ENV=development



DB\_HOST=localhost

DB\_PORT=5432

DB\_NAME=task\_management

DB\_USER=postgres

DB\_PASSWORD=your\_postgres\_password



JWT\_SECRET=your\_long\_random\_secret

JWT\_EXPIRES\_IN=1h



CORS\_ORIGIN=http://localhost:5173

```



Generate a secure JWT secret:

```bash

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

```



\### Frontend — `frontend/.env`



```bash

cp frontend/.env.example frontend/.env

```



```

VITE\_API\_BASE\_URL=http://localhost:5000/api

```



\---



\## Database Setup



\*\*1. Create the database:\*\*

```bash

psql -U postgres -c "CREATE DATABASE task\_management;"

```



\*\*2. Run the schema:\*\*

```bash

psql -U postgres -d task\_management -f database/schema.sql

```



\*\*3. Seed the default admin account:\*\*

```bash

psql -U postgres -d task\_management -f database/seed.sql

```



\*\*Default credentials:\*\*

| Field | Value |

|---|---|

| Email | admin@test.com |

| Password | 123456 |



\---



\## Running the Backend



```bash

cd backend

npm install

npm run dev

```



Server runs at `http://localhost:5000`



Health check: `GET http://localhost:5000/api/health`



\---



\## Running the Frontend



```bash

cd frontend

npm install

npm run dev

```



App runs at `http://localhost:5173`



\---



\## API Documentation



All endpoints except `/api/auth/login` require an `Authorization: Bearer <token>` header.



\### Authentication



| Method | Endpoint | Body | Description |

|---|---|---|---|

| POST | `/api/auth/login` | `{ email, password }` | Returns JWT token and user info |

| POST | `/api/auth/logout` | — | Clears session (client discards token) |



\### Tasks



| Method | Endpoint | Description |

|---|---|---|

| GET | `/api/tasks` | List tasks. Supports `search`, `status`, `priority`, `sortBy` query params |

| GET | `/api/tasks/:id` | Get a single task by ID |

| POST | `/api/tasks` | Create a new task |

| PUT | `/api/tasks/:id` | Update an existing task |

| DELETE | `/api/tasks/:id` | Delete a task |

| GET | `/api/tasks/stats/dashboard` | Get dashboard counts |



\### Task object



```json

{

&#x20; "title": "string (required, max 200 chars)",

&#x20; "description": "string (optional)",

&#x20; "priority": "Low | Medium | High (required)",

&#x20; "status": "Pending | In Progress | Completed (required)",

&#x20; "due\_date": "YYYY-MM-DD (required, cannot be in the past)"

}

```



\### Dashboard stats response



```json

{

&#x20; "total": 10,

&#x20; "pending": 4,

&#x20; "inProgress": 3,

&#x20; "completed": 2,

&#x20; "overdue": 1

}

```



\---

\## Folder structure



The project is split into three main folders — `backend` for the API, `frontend` for the React app, and `database` for the SQL files. Inside the backend, code is organized by what it does: routes define the endpoints, controllers handle the logic, middleware handles auth and validation, and utils hold shared helpers. The frontend follows a similar pattern with pages, components, an api folder for all HTTP calls, and a context folder for auth state.

\---



\## Assumptions Made



\- A single admin account is used as specified. No registration flow is implemented.

\- "Overdue" is defined as `due\_date < today AND status != Completed`.

\- Search matches partial, case-insensitive text against task title only.

\- JWT is used over session-based auth as it was the preferred option in the requirements.

\- Tasks are scoped to `user\_id` to support multiple users in future, even though only one account currently exists.

\- Frontend validation prevents past due dates on new tasks. Editing an existing overdue task allows saving without changing the date.



\---



\## Known Limitations



\- No registration flow (not required by spec).

\- JWT does not currently implement refresh tokens — session expires after 1 hour and requires re-login.

\- No automated test suite (listed as a bonus feature).

\- Pagination is client-side (8 tasks per page) rather than server-side.



\---



\## Bonus Features Implemented



\- Dark mode (persists across sessions via localStorage)

\- Toast notifications for all user actions

\- Loading indicators (spinner + skeleton animations)

\- Pagination (8 tasks per page)

\- Responsive design (desktop, tablet, mobile)

