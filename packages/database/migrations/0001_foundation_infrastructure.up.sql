CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS nelyo_foundation;

CREATE TABLE IF NOT EXISTS nelyo_foundation.synthetic_seed_reference (
  seed_key TEXT PRIMARY KEY,
  seed_value TEXT NOT NULL,
  seed_version TEXT NOT NULL,
  seeded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
