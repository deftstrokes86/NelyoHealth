-- Identity & Access bounded context — persisted identity core (roadmap M1.1).
-- Owns: Person, ContactPoint, UserAccount, ExternalIdentity
-- (Session/Device follow in M1.2; Address follows tenancy in M2.1).
-- Contract source: packages/domain/src/identity-tenancy-model.ts.
-- Context isolation rule (domain-boundaries.md): other contexts must not
-- query nelyo_identity tables directly; they reference person/account ids.

CREATE SCHEMA IF NOT EXISTS nelyo_identity;

-- One verified human. Identity is permanent (Manifest Principle 1):
-- rows are never deleted; FKs below use RESTRICT to enforce that posture.
CREATE TABLE nelyo_identity.person (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  date_of_birth DATE,
  primary_contact_point_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nelyo_identity.contact_point (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES nelyo_identity.person (id) ON DELETE RESTRICT,
  kind TEXT NOT NULL CHECK (kind IN ('email', 'phone')),
  value TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT contact_point_unique_per_person UNIQUE (person_id, kind, value)
);

ALTER TABLE nelyo_identity.person
  ADD CONSTRAINT person_primary_contact_point_fk
  FOREIGN KEY (primary_contact_point_id)
  REFERENCES nelyo_identity.contact_point (id)
  ON DELETE SET NULL;

-- Authentication principal. One account per person
-- (one human = one verified identity = one login principal).
CREATE TABLE nelyo_identity.user_account (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL UNIQUE REFERENCES nelyo_identity.person (id) ON DELETE RESTRICT,
  login_email TEXT,
  login_phone_e164 TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'suspended', 'recovery-locked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_account_login_present
    CHECK (login_email IS NOT NULL OR login_phone_e164 IS NOT NULL)
);

CREATE UNIQUE INDEX user_account_login_email_unique
  ON nelyo_identity.user_account (LOWER(login_email))
  WHERE login_email IS NOT NULL;

CREATE UNIQUE INDEX user_account_login_phone_unique
  ON nelyo_identity.user_account (login_phone_e164)
  WHERE login_phone_e164 IS NOT NULL;

-- External authentication provider linkage (phone/email OTP, OIDC, SAML, SCIM).
CREATE TABLE nelyo_identity.external_identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_account_id UUID NOT NULL REFERENCES nelyo_identity.user_account (id) ON DELETE RESTRICT,
  provider TEXT NOT NULL
    CHECK (provider IN ('phone-otp', 'email-otp', 'oidc', 'saml', 'scim')),
  external_subject TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT external_identity_subject_unique UNIQUE (provider, external_subject)
);

CREATE INDEX contact_point_person_idx ON nelyo_identity.contact_point (person_id);
CREATE INDEX external_identity_account_idx ON nelyo_identity.external_identity (user_account_id);
