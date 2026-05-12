# James Blinds — Mission Control

Internal operations system for James Blinds. Manages customers, jobs, quotes, orders, installations, inventory, and staff tasks.

---

## Quick Start

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is fine for development)

### 1. Clone and install

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp ../.env.example .env
# Edit .env — fill in your Supabase URL and anon key
```

Find your keys in: **Supabase dashboard → Project Settings → API**

### 3. Run the database migration

In Supabase dashboard → **SQL Editor**, paste and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, indexes, triggers, and a seed admin user.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **Note:** The dashboard and all pages work immediately with mock data — no Supabase connection required for the initial UI. Connect Supabase when you're ready to work with real data.

---

## Project Structure

```
├── frontend/           React + TypeScript + Vite app
│   └── src/
│       ├── components/ Reusable UI components (layout)
│       ├── data/       Mock data for local development
│       ├── lib/        Supabase client singleton
│       ├── pages/      One component per route
│       ├── services/   All database operations
│       ├── styles/     CSS tokens and global utility classes
│       ├── types/      TypeScript entity types
│       └── utils/      Formatters and helpers
├── supabase/
│   └── migrations/     SQL schema files
├── docs/
│   └── architecture.md Full architecture documentation
├── .env.example        Environment variable template
└── README.md
```

---

## Pages

| Route                | Page                |
|----------------------|---------------------|
| `/`                  | Dashboard           |
| `/customers`         | Customer list       |
| `/customers/:id`     | Customer detail     |
| `/jobs`              | Job list            |
| `/jobs/:id`          | Job detail          |
| `/quotes`            | Quote list          |
| `/orders`            | Order list          |
| `/installations`     | Installation schedule |
| `/inventory`         | Inventory / stock   |
| `/tasks`             | Staff task board    |
| `/settings`          | System settings     |

---

## Database

See [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) for the full schema with inline comments explaining every design decision.

Core tables: `customers`, `addresses`, `contacts`, `jobs`, `job_status_history`, `measurements`, `products`, `quotes`, `quote_items`, `orders`, `order_items`, `installations`, `inventory_items`, `staff_users`, `tasks`, `activity_logs`

---

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the full architecture guide including layering rules, development roadmap, and design rationale.

---

## Available Scripts

From the `frontend/` directory:

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start dev server at localhost:5173   |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview production build locally     |
| `npm run typecheck` | Run TypeScript type checking       |
