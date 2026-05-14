# James Blinds — Mission Control

Internal operations system for James Blinds.

---

## Project Structure

```
mission-control/
├── backend/       Node.js + Express API + PostgreSQL
├── frontend/      React app (coming soon)
├── .gitignore
└── README.md
```

---

## Prerequisites — Install These First

Before running anything, make sure you have the following installed:

### 1. Node.js (v18 or higher)
Download: https://nodejs.org  
Choose the **LTS** version. After installing, verify:
```bash
node -v
npm -v
```

### 2. PostgreSQL (v14 or higher)
Download: https://www.postgresql.org/download/windows  
Click **Download the installer** → pick the latest version → run installer.

During installation:
- Set a password for the `postgres` user — **remember this password**
- Keep the default port **5432** (use 5433 only if 5432 is already taken)
- When Stack Builder pops up at the end, just close it

After installing, add PostgreSQL to your system PATH:  
Add `C:\Program Files\PostgreSQL\<version>\bin` to your Environment Variables → Path.  
Then reopen your terminal.

### 3. Git
Download: https://git-scm.com  
After installing, verify:
```bash
git --version
```

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
It will ask for your postgres password.

### Step 3 — Create the tables
```bash
psql -U postgres -d james_blinds_mvp -f backend/database/schema.sql
```
You should see 4 lines of `CREATE TABLE`.

### Step 4 — Configure environment
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and fill in:
```
DB_PASSWORD=your_postgres_password
```
Everything else can stay as default unless your PostgreSQL port is not 5432.

### Step 5 — Install dependencies
```bash
cd backend
npm install
```

### Step 6 — Seed the database
```bash
npm run seed
```
This creates roles, an admin user, and sample projects.

**Default login credentials:**
- Email: `admin@jamesblinds.com`
- Password: `password123`

### Step 7 — Start the server
```bash
npm run dev
```
Open your browser at: http://localhost:3000

---

## Running After Initial Setup

Once set up, you only need to run:
```bash
cd backend
npm run dev
```

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
├── controllers/            # Request handling and business logic
├── routes/                 # Route definitions
├── middleware/
│   └── authMiddleware.js   # Session-based auth guard
├── views/                  # HTML templates (MVP — replaced by React later)
├── public/                 # Static CSS/JS (MVP — replaced by React later)
├── .env                    # Your local config — never commit this
└── .env.example            # Template — safe to commit
```

## API Routes

| Method | Path         | Description                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Redirects to `/login`          |
| GET    | `/login`     | Login page                     |
| POST   | `/login`     | Authenticate, start session    |
| GET    | `/logout`    | Destroy session                |
| GET    | `/dashboard` | Dashboard (requires login)     |

---

## Planned Modules

- Projects CRUD + user assignment
- User management
- Materials module
- Scheduling module
- Punch list module
- QBO billing integration
- React frontend (replaces EJS views)
- AI assistant
