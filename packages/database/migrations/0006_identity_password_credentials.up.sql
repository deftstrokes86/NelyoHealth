-- Identity & Access — password credentials (patient-web sign-in/sign-up).
-- Separate table (not a column on user_account), matching the existing
-- one-concern-per-table convention (session, device, authentication_event).
-- authentication-handlers.ts already models passwordVerified as an input to
-- the login decision; this table is what makes that boolean computable.

CREATE TABLE nelyo_identity.password_credential (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_account_id UUID NOT NULL UNIQUE
    REFERENCES nelyo_identity.user_account (id) ON DELETE RESTRICT,
  password_hash TEXT NOT NULL,
  -- Algorithm + cost tag stored alongside the hash so it can be rotated
  -- (e.g. scrypt cost bump) without a breaking migration.
  algorithm TEXT NOT NULL DEFAULT 'scrypt-n16384-r8-p1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
