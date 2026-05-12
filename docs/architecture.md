# James Blinds — Mission Control: Architecture

## Overview

Mission Control is an internal web application for James Blinds to manage customers, jobs, quotes, orders, installations, inventory, and staff tasks. It replaces scattered spreadsheets and manual processes with a single searchable system.

---

## Stack

| Layer      | Technology                          | Notes                                    |
|------------|-------------------------------------|------------------------------------------|
| Frontend   | React 18 + TypeScript + Vite        | SPA, no SSR required                     |
| Routing    | React Router v6                     | Client-side routing                      |
| Database   | Supabase (PostgreSQL)               | Hosted, managed Postgres                 |
| Auth       | Supabase Auth                       | JWT-based, ready to wire up              |
| Styles     | Vanilla CSS (CSS custom properties) | No CSS-in-JS overhead, easy to override  |
| State      | React local state (`useState`)      | No global state manager for v1           |

---

## Repository Structure

```
james-blinds/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/        # AppLayout, Sidebar, Topbar, PageHeader
│   │   ├── data/
│   │   │   └── mockData.ts    # Mock data for local development
│   │   ├── lib/
│   │   │   └── supabaseClient.ts  # Single Supabase client instance
│   │   ├── pages/             # One file per route
│   │   ├── services/          # All Supabase calls live here
│   │   ├── styles/            # CSS tokens + global styles
│   │   ├── types/             # TypeScript entity interfaces
│   │   ├── utils/             # Formatters, helpers
│   │   ├── App.tsx            # Router
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── docs/
│   └── architecture.md        # This file
├── .env.example
├── .gitignore
└── README.md
```

---

## Frontend Architecture

### Layering rules

```
Page component
  └─ calls service function(s)
       └─ calls Supabase client
            └─ returns typed result { data, error }
```

- **Pages** own layout and local UI state only. No direct Supabase calls.
- **Services** (`src/services/`) are the only place that import `supabaseClient`. They return typed `ServiceResult<T>` objects.
- **Types** (`src/types/index.ts`) mirror the database schema exactly. Services cast Supabase responses to these types.
- **Mock data** (`src/data/mockData.ts`) lets the UI work without a live Supabase project. Swap service calls from mock returns to real calls to go live.

### Routing

React Router v6 nested under `/`. No authentication guard in v1 — add a `<ProtectedRoute>` wrapper wrapping the route tree once Supabase Auth is configured.

### Styling

All design tokens live in `src/styles/tokens.css` (CSS custom properties). `global.css` provides reusable utility classes (`.card`, `.btn`, `.badge`, `.table`, `.stat-card`) used across pages. No component-scoped CSS files — the global classes are small enough to stay manageable for v1.

---

## Database Design

### Key decisions

**UUIDs everywhere** — avoids sequential ID guessing; safe for external references in emails/PDFs.

**Normalized structure** — `customers` → `addresses` + `contacts` are separate tables so a customer can have multiple sites and contacts without denormalization.

**Job as the central work unit** — everything (quotes, measurements, orders, installations) belongs to a job, not directly to a customer. This accurately models how a blinds business works: a customer may place multiple jobs over years.

**Job number sequence** — auto-generated as `JB-YYYY-NNNN` via a Postgres trigger; human-readable and safe to share with customers.

**Status history log** — `job_status_history` is an immutable append-only table. Never update rows — only insert. This gives a full audit trail.

**Activity log** — `activity_logs` is a generic append-only event table. `entity_type` + `entity_id` identify the affected record. `metadata JSONB` holds flexible extra data without schema migrations.

**Computed columns** — `quote_items.total_price` and `order_items.total_cost` are `GENERATED ALWAYS AS` stored columns, ensuring the arithmetic is always consistent.

### Entity relationships (simplified)

```
customers
  ├── addresses        (many)
  ├── contacts         (many)
  └── jobs             (many)
        ├── measurements     (many)
        ├── quotes           (many)
        │     └── quote_items (many)
        ├── orders           (many)
        │     └── order_items (many)
        ├── installations    (many)
        ├── tasks            (many)
        └── job_status_history (many, append-only)

staff_users
  ├── assigned jobs
  ├── assigned tasks
  └── assigned installations

products          (catalogue, referenced by quote_items and order_items)
inventory_items   (warehouse stock, loosely linked to products)
activity_logs     (append-only, references any entity by type+id)
```

---

## Development Roadmap

### Phase 1 (current) — Foundation
- [x] Project scaffold
- [x] Database schema
- [x] Frontend layout + all pages (mock data)
- [x] Service layer structure

### Phase 2 — Supabase integration
- [ ] Connect frontend to live Supabase project
- [ ] Replace mock data calls with real service calls
- [ ] Supabase Auth login screen + protected routes
- [ ] Row-Level Security (RLS) policies per table

### Phase 3 — Core workflows
- [ ] Create/edit customer form
- [ ] Create/edit job form with status transitions
- [ ] Quote builder (line items, PDF export)
- [ ] Installation calendar view
- [ ] Task creation + assignment

### Phase 4 — Advanced features
- [ ] Order tracking with supplier integration
- [ ] Inventory adjustments and low-stock alerts
- [ ] Activity log feed per job/customer
- [ ] Staff dashboard / mobile-friendly layout
- [ ] Reporting (revenue by month, jobs by status)

---

## Environment Variables

| Variable                | Purpose                           |
|-------------------------|-----------------------------------|
| `VITE_SUPABASE_URL`     | Your Supabase project URL         |
| `VITE_SUPABASE_ANON_KEY`| Public anon key for client access |

Both are injected by Vite at build time. Never commit `.env` — only `.env.example`.
