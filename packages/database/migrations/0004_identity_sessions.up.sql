-- Identity & Access — sessions, devices, authentication events (roadmap M1.2).
-- Extends the nelyo_identity schema owned by 0003_identity_access.
-- authentication_event is append-only (repository exposes no update path);
-- the central audit store unification follows in M3.x.

CREATE TABLE nelyo_identity.device (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_account_id UUID NOT NULL REFERENCES nelyo_identity.user_account (id) ON DELETE RESTRICT,
  display_name TEXT NOT NULL,
  trusted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX device_account_idx ON nelyo_identity.device (user_account_id);

CREATE TABLE nelyo_identity.session (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_account_id UUID NOT NULL REFERENCES nelyo_identity.user_account (id) ON DELETE RESTRICT,
  -- Tenant FK lands with the tenancy tables in M2.1; column typed now for continuity.
  active_tenant_id UUID,
  trusted_device_id UUID REFERENCES nelyo_identity.device (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'revoked')),
  auth_level TEXT NOT NULL DEFAULT 'primary'
    CHECK (auth_level IN ('primary', 'elevated')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX session_account_idx ON nelyo_identity.session (user_account_id);
CREATE INDEX session_account_active_idx
  ON nelyo_identity.session (user_account_id)
  WHERE status = 'active';

CREATE TABLE nelyo_identity.authentication_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Nullable: failed attempts against unknown identifiers are still recorded
  -- without asserting an account (prevents account-enumeration side channels).
  user_account_id UUID REFERENCES nelyo_identity.user_account (id) ON DELETE RESTRICT,
  tenant_id UUID,
  result TEXT NOT NULL CHECK (result IN ('success', 'failure', 'challenge-required')),
  method TEXT NOT NULL CHECK (method IN ('otp', 'password', 'mfa', 'recovery')),
  reason_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX authentication_event_account_idx
  ON nelyo_identity.authentication_event (user_account_id, created_at DESC);
