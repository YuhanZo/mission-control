# James Blinds — Mission Control

Internal operations system for James Blinds.

---

## Project Structure

```
mission-control/
├── backend/       Node.js + Express REST API + PostgreSQL
├── frontend/      React app (coming soon)
├── .gitignore
└── README.md
```

---

## Prerequisites — Install These First

### 1. Node.js (v18 or higher)
Download: https://nodejs.org — choose the **LTS** version.
```bash
node -v
npm -v
```

### 2. PostgreSQL (v14 or higher)
Download: https://www.postgresql.org/download/windows  
Click **Download the installer** → pick the latest version → run it.

During installation:
- Set a password for the `postgres` user — **remember this**
- Keep the default port **5432** (use 5433 only if 5432 is already taken)
- Close Stack Builder when it appears at the end

Add PostgreSQL to your PATH:  
Add `C:\Program Files\PostgreSQL\<version>\bin` to Environment Variables → Path, then reopen your terminal.

### 3. Git
Download: https://git-scm.com

---

## Backend Setup (First Time Only)

### Step 1 — Clone the repo
```bash
git clone https://github.com/YuhanZo/mission-control.git
cd mission-control
```

### Step 2 — Create the database
```bash
psql -U postgres -c "CREATE DATABASE james_blinds_mvp;"
```

### Step 3 — Create the tables
```bash
psql -U postgres -d james_blinds_mvp -f backend/database/schema.sql
```
You should see 4 lines of `CREATE TABLE`.

### Step 4 — Configure environment
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and fill in your `DB_PASSWORD`. If your PostgreSQL runs on port 5433, update `DB_PORT` too.

### Step 5 — Install dependencies
```bash
cd backend
npm install
```

### Step 6 — Seed the database
```bash
npm run seed
```
**Default login credentials:**
- Email: `admin@jamesblinds.com`
- Password: `password123`

### Step 7 — Start the API server
```bash
npm run dev
```
API running at: http://localhost:3000

---

## Running After Initial Setup

```bash
cd backend
npm run dev
```

---

## API Endpoints

| Method | Path               | Auth     | Description                  |
|--------|--------------------|----------|------------------------------|
| POST   | `/api/auth/login`  | No       | Login, returns session user  |
| POST   | `/api/auth/logout` | No       | Destroy session              |
| GET    | `/api/auth/me`     | Required | Return current session user  |
| GET    | `/api/dashboard`   | Required | Stats + recent projects      |

---

## Backend Structure

```
backend/
├── app.js                  # Express entry point
├── config/
│   └── db.js               # PostgreSQL connection pool
├── database/
│   ├── schema.sql          # CREATE TABLE statements (run once)
│   └── seed.js             # Seed script (run once)
├── models/                 # SQL queries — one file per table
├── controllers/            # Business logic, returns JSON
├── routes/                 # Route definitions (mounted under /api)
├── middleware/
│   └── authMiddleware.js   # Session-based auth guard
├── .env                    # Your local config — never commit this
└── .env.example            # Template — safe to commit
```

---

## Planned Modules

- `/api/projects` — project CRUD + user assignment
- `/api/users` — user management
- Materials, scheduling, punch list modules
- QBO billing integration
- React frontend (replaces EJS views)
- JWT auth (replaces session when React is ready)
- AI assistant
