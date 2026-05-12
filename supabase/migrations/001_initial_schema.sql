-- =============================================================================
-- James Blinds — Initial Database Schema
-- =============================================================================
-- Design principles:
--   • UUID primary keys for all tables (safe for distributed inserts)
--   • created_at / updated_at on every table (audit trail)
--   • Foreign keys with ON DELETE RESTRICT unless soft-delete is intentional
--   • Indexes on all FK columns and common filter columns
--   • ENUMs encoded as text with CHECK constraints (easier to evolve)
-- =============================================================================

-- Utility function: keep updated_at current automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper macro: attach the trigger to any table
CREATE OR REPLACE FUNCTION create_updated_at_trigger(tbl text)
RETURNS void AS $$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER trg_%I_updated_at
     BEFORE UPDATE ON %I
     FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
    tbl, tbl
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- STAFF USERS
-- Mirror of auth.users with business-specific fields.
-- Auth is handled by Supabase Auth; this table stores display/role info.
-- =============================================================================
CREATE TABLE staff_users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id     UUID UNIQUE,                     -- links to auth.users.id
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL DEFAULT 'staff'
                CHECK (role IN ('admin', 'manager', 'staff', 'installer', 'readonly')),
  phone       TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('staff_users');

-- =============================================================================
-- CUSTOMERS
-- Core entity. A customer may have many jobs.
-- =============================================================================
CREATE TABLE customers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  company_name  TEXT,
  email         TEXT,
  phone         TEXT,
  phone_alt     TEXT,
  source        TEXT CHECK (source IN ('referral','walk_in','website','google','facebook','other')),
  notes         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_by    UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('customers');
CREATE INDEX idx_customers_last_name  ON customers(last_name);
CREATE INDEX idx_customers_email      ON customers(email);
CREATE INDEX idx_customers_company    ON customers(company_name);

-- =============================================================================
-- ADDRESSES
-- Reusable address records. Linked to customers and jobs separately so
-- a customer's billing address can differ from their installation address.
-- =============================================================================
CREATE TABLE addresses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID REFERENCES customers(id) ON DELETE CASCADE,
  label         TEXT DEFAULT 'primary'        -- e.g. 'primary', 'billing', 'site'
                  CHECK (label IN ('primary','billing','site','other')),
  line1         TEXT NOT NULL,
  line2         TEXT,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL DEFAULT 'NSW',
  postcode      TEXT NOT NULL,
  country       TEXT NOT NULL DEFAULT 'Australia',
  is_default    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('addresses');
CREATE INDEX idx_addresses_customer ON addresses(customer_id);

-- =============================================================================
-- CONTACTS
-- Additional contacts under a customer (e.g. site manager, spouse).
-- =============================================================================
CREATE TABLE contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  role          TEXT,                          -- e.g. 'site manager', 'spouse'
  email         TEXT,
  phone         TEXT,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('contacts');
CREATE INDEX idx_contacts_customer ON contacts(customer_id);

-- =============================================================================
-- JOBS
-- Central work unit. One customer → many jobs.
-- A job progresses through statuses tracked in job_status_history.
-- =============================================================================
CREATE TABLE jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  address_id      UUID REFERENCES addresses(id) ON DELETE SET NULL,
  assigned_to     UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'enquiry'
                    CHECK (status IN (
                      'enquiry','measurement_booked','measured',
                      'quote_sent','quote_approved','ordered',
                      'in_production','ready_to_install','installation_booked',
                      'installed','completed','cancelled','on_hold'
                    )),
  priority        TEXT NOT NULL DEFAULT 'normal'
                    CHECK (priority IN ('low','normal','high','urgent')),
  job_number      TEXT UNIQUE,               -- human-readable ref, e.g. JB-2024-0001
  source_notes    TEXT,
  is_commercial   BOOLEAN NOT NULL DEFAULT FALSE,
  created_by      UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('jobs');
CREATE INDEX idx_jobs_customer   ON jobs(customer_id);
CREATE INDEX idx_jobs_status     ON jobs(status);
CREATE INDEX idx_jobs_assigned   ON jobs(assigned_to);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- Auto-generate human-readable job numbers: JB-YYYY-NNNN
CREATE SEQUENCE job_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_number IS NULL THEN
    NEW.job_number := 'JB-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                      LPAD(nextval('job_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jobs_job_number
  BEFORE INSERT ON jobs
  FOR EACH ROW EXECUTE FUNCTION generate_job_number();

-- =============================================================================
-- JOB STATUS HISTORY
-- Immutable log of every status transition on a job.
-- =============================================================================
CREATE TABLE job_status_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id        UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  from_status   TEXT,
  to_status     TEXT NOT NULL,
  changed_by    UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  notes         TEXT,
  changed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_job_status_history_job ON job_status_history(job_id);

-- =============================================================================
-- MEASUREMENTS
-- One or more measurement visits per job. Records dimensions per window/room.
-- =============================================================================
CREATE TABLE measurements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  measured_by     UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  measured_at     TIMESTAMPTZ,
  location_name   TEXT NOT NULL,             -- e.g. 'Living Room', 'Bedroom 1'
  width_mm        NUMERIC(8,2),
  height_mm       NUMERIC(8,2),
  depth_mm        NUMERIC(8,2),
  mount_type      TEXT CHECK (mount_type IN ('inside','outside','ceiling')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('measurements');
CREATE INDEX idx_measurements_job ON measurements(job_id);

-- =============================================================================
-- PRODUCTS
-- Product catalogue: blind types, fabrics, hardware, accessories.
-- =============================================================================
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku             TEXT UNIQUE,
  name            TEXT NOT NULL,
  category        TEXT NOT NULL
                    CHECK (category IN (
                      'roller_blind','roman_blind','venetian','vertical',
                      'sheer_curtain','blockout_curtain','shutter',
                      'track_hardware','fabric','accessory','other'
                    )),
  description     TEXT,
  unit_cost       NUMERIC(10,2),
  unit_price      NUMERIC(10,2),
  unit            TEXT DEFAULT 'each',       -- each, m, m2
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  supplier_name   TEXT,
  supplier_sku    TEXT,
  lead_days       INT DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('products');
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku      ON products(sku);

-- =============================================================================
-- QUOTES
-- A quote belongs to a job. Multiple revisions are allowed (version column).
-- =============================================================================
CREATE TABLE quotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  version         INT NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','sent','approved','rejected','expired')),
  subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_pct    NUMERIC(5,2) DEFAULT 0,
  tax_pct         NUMERIC(5,2) DEFAULT 10,   -- GST
  total           NUMERIC(10,2) NOT NULL DEFAULT 0,
  valid_until     DATE,
  notes           TEXT,
  sent_at         TIMESTAMPTZ,
  approved_at     TIMESTAMPTZ,
  created_by      UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, version)
);
SELECT create_updated_at_trigger('quotes');
CREATE INDEX idx_quotes_job    ON quotes(job_id);
CREATE INDEX idx_quotes_status ON quotes(status);

CREATE TABLE quote_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id        UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  measurement_id  UUID REFERENCES measurements(id) ON DELETE SET NULL,
  product_id      UUID REFERENCES products(id) ON DELETE RESTRICT,
  description     TEXT NOT NULL,
  quantity        NUMERIC(8,2) NOT NULL DEFAULT 1,
  unit_price      NUMERIC(10,2) NOT NULL,
  total_price     NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sort_order      INT DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('quote_items');
CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);

-- =============================================================================
-- ORDERS
-- A confirmed purchase order raised after quote approval.
-- =============================================================================
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  quote_id        UUID REFERENCES quotes(id) ON DELETE SET NULL,
  order_number    TEXT UNIQUE,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','in_production','ready','delivered','cancelled')),
  supplier_name   TEXT,
  supplier_ref    TEXT,
  ordered_at      TIMESTAMPTZ,
  expected_at     DATE,
  received_at     TIMESTAMPTZ,
  subtotal        NUMERIC(10,2),
  tax             NUMERIC(10,2),
  total           NUMERIC(10,2),
  notes           TEXT,
  created_by      UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('orders');
CREATE INDEX idx_orders_job    ON orders(job_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE RESTRICT,
  description     TEXT NOT NULL,
  quantity        NUMERIC(8,2) NOT NULL DEFAULT 1,
  unit_cost       NUMERIC(10,2),
  total_cost      NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('order_items');
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =============================================================================
-- INSTALLATIONS
-- Scheduled installation event for a job.
-- =============================================================================
CREATE TABLE installations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  assigned_to     UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  status          TEXT NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled','in_progress','completed','rescheduled','cancelled')),
  scheduled_date  DATE NOT NULL,
  scheduled_time  TIME,
  duration_hours  NUMERIC(4,1),
  completed_at    TIMESTAMPTZ,
  notes           TEXT,
  customer_signed BOOLEAN DEFAULT FALSE,
  created_by      UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('installations');
CREATE INDEX idx_installations_job           ON installations(job_id);
CREATE INDEX idx_installations_assigned      ON installations(assigned_to);
CREATE INDEX idx_installations_scheduled_date ON installations(scheduled_date);

-- =============================================================================
-- INVENTORY ITEMS
-- Warehouse stock tracking. Not tied to a specific job (that's order_items).
-- =============================================================================
CREATE TABLE inventory_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
  sku             TEXT,
  name            TEXT NOT NULL,
  category        TEXT,
  location        TEXT,                      -- e.g. 'Shelf A3', 'Van 1'
  qty_on_hand     NUMERIC(10,2) NOT NULL DEFAULT 0,
  qty_reserved    NUMERIC(10,2) NOT NULL DEFAULT 0,
  qty_reorder     NUMERIC(10,2) DEFAULT 0,   -- reorder point
  unit_cost       NUMERIC(10,2),
  notes           TEXT,
  last_counted_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('inventory_items');
CREATE INDEX idx_inventory_product ON inventory_items(product_id);

-- =============================================================================
-- TASKS
-- Internal staff tasks, optionally linked to a job or customer.
-- =============================================================================
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID REFERENCES jobs(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE CASCADE,
  assigned_to     UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'todo'
                    CHECK (status IN ('todo','in_progress','done','cancelled')),
  priority        TEXT NOT NULL DEFAULT 'normal'
                    CHECK (priority IN ('low','normal','high','urgent')),
  due_date        DATE,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
SELECT create_updated_at_trigger('tasks');
CREATE INDEX idx_tasks_job         ON tasks(job_id);
CREATE INDEX idx_tasks_assigned    ON tasks(assigned_to);
CREATE INDEX idx_tasks_status      ON tasks(status);
CREATE INDEX idx_tasks_due_date    ON tasks(due_date);

-- =============================================================================
-- ACTIVITY LOGS
-- Append-only audit trail for any significant action in the system.
-- entity_type + entity_id identify which record was affected.
-- =============================================================================
CREATE TABLE activity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     TEXT NOT NULL,             -- 'job', 'customer', 'order', etc.
  entity_id       UUID NOT NULL,
  action          TEXT NOT NULL,             -- 'created', 'updated', 'status_changed', etc.
  description     TEXT,
  metadata        JSONB,                     -- flexible extra data
  performed_by    UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- no updated_at — this table is append-only
);
CREATE INDEX idx_activity_entity    ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_performed ON activity_logs(performed_by);
CREATE INDEX idx_activity_created   ON activity_logs(created_at DESC);

-- =============================================================================
-- SEED: demo staff user (replace with real auth integration)
-- =============================================================================
INSERT INTO staff_users (id, full_name, email, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'James Owner',
  'james@jamesblinds.com.au',
  'admin'
);
