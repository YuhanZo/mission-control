# James Blinds — Mission Control MVP

Internal operations system for James Blinds. This MVP slice covers **login** and the **dashboard**.

## Stack

- Node.js + Express
- PostgreSQL
- EJS (server-rendered HTML templates)
- bcrypt (password hashing)
- express-session (auth sessions)

## Local Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally

### 2. Create the database

```bash
psql -U postgres -c "CREATE DATABASE james_blinds_mvp;"
```

### 3. Run the schema

```bash
psql -U postgres -d james_blinds_mvp -f database/schema.sql
```

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your PostgreSQL credentials and a session secret.

### 5. Install dependencies

```bash
npm install
```

### 6. Seed the database

```bash
npm run seed
```

This creates roles, an admin user, and sample projects.

**Default admin credentials:**
- Email: `admin@jamesblinds.com`
- Password: `password123`

### 7. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
├── app.js               # Express app entry point
├── config/
│   └── db.js            # PostgreSQL connection pool
├── database/
│   ├── schema.sql       # CREATE TABLE statements
│   └── seed.js          # Seed script (roles, admin user, sample projects)
├── models/              # SQL queries — one file per table
├── controllers/         # Request handling and business logic
├── routes/              # Route definitions
├── middleware/
│   └── authMiddleware.js  # Session-based auth guard
├── views/               # EJS templates rendered as .html
├── public/css/          # Static styles
└── .env.example         # Environment variable template
```

## Routes

| Method | Path         | Description                        |
|--------|--------------|------------------------------------|
| GET    | `/`          | Redirects to `/login`              |
| GET    | `/login`     | Login page                         |
| POST   | `/login`     | Authenticate and start session     |
| GET    | `/logout`    | Destroy session, redirect to login |
| GET    | `/dashboard` | Dashboard (requires login)         |

## Planned Modules (not yet built)

- `/projects` — full project CRUD and user assignment
- `/users` — user management
- Materials module
- Scheduling module
- Punch list module
- QBO billing integration
- AI assistant
