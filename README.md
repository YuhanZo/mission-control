# James Blinds — Mission Control

Internal operations system for James Blinds.

## Structure

```
mission-control/
├── backend/       Node.js + Express REST API + PostgreSQL
├── frontend/      React app (coming soon)
├── .gitignore
└── README.md
```

---

## Backend Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally

### 2. Create the database

```bash
psql -U postgres -c "CREATE DATABASE james_blinds_mvp;"
```

### 3. Run the schema

```bash
psql -U postgres -d james_blinds_mvp -f backend/database/schema.sql
```

### 4. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your PostgreSQL credentials and a session secret.

### 5. Install dependencies

```bash
cd backend
npm install
```

### 6. Seed the database

```bash
npm run seed
```

**Default admin credentials:**
- Email: `admin@jamesblinds.com`
- Password: `password123`

### 7. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Backend Structure

```
backend/
├── app.js               # Express entry point
├── config/
│   └── db.js            # PostgreSQL connection pool
├── database/
│   ├── schema.sql       # CREATE TABLE statements
│   └── seed.js          # Seed script
├── models/              # SQL queries — one file per table
├── controllers/         # Request handling and business logic
├── routes/              # Route definitions
├── middleware/
│   └── authMiddleware.js
├── views/               # EJS templates (MVP only — replaced by React later)
├── public/              # Static assets (MVP only)
└── .env.example
```

## Routes

| Method | Path         | Description                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Redirects to `/login`          |
| GET    | `/login`     | Login page                     |
| POST   | `/login`     | Authenticate, start session    |
| GET    | `/logout`    | Destroy session                |
| GET    | `/dashboard` | Dashboard (requires login)     |

## Planned Modules

- Projects CRUD + user assignment
- User management
- Materials module
- Scheduling module
- Punch list module
- QBO billing integration
- React frontend (replaces EJS views)
- AI assistant
