-- James Blinds MVP — Database Schema
-- Run once against your PostgreSQL database:
--   psql -d james_blinds_mvp -f database/schema.sql

CREATE TABLE IF NOT EXISTS roles (
  id   SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR NOT NULL,
  email         VARCHAR NOT NULL UNIQUE,
  phone         VARCHAR,
  user_type     VARCHAR,
  role_id       INTEGER REFERENCES roles(id),
  territory_id  INTEGER,
  active        BOOLEAN DEFAULT true,
  password_hash VARCHAR NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id                       SERIAL PRIMARY KEY,
  project_name             VARCHAR NOT NULL,
  customer_user_id         INTEGER REFERENCES users(id),
  territory_id             INTEGER,
  project_manager_user_id  INTEGER REFERENCES users(id),
  status                   VARCHAR,
  contract_value           NUMERIC,
  start_date               DATE,
  install_start_date       DATE,
  install_end_date         DATE,
  completion_date          DATE,
  created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_users (
  id                SERIAL PRIMARY KEY,
  project_id        INTEGER REFERENCES projects(id),
  user_id           INTEGER REFERENCES users(id),
  relationship_type VARCHAR,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
