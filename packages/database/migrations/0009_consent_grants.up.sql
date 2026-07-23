-- Consent persistence (roadmap M4.1 — Consent Persistence).
--
-- The Consent and Audit bounded context owns the authoritative record of what
-- a patient has consented to, within a given organization, at a given point in
-- time. Authorization decisions DERIVE consent status from the CURRENT version
-- at read time (derive-don't-persist) — no consent flag is cached on the
-- authorization path, so a withdrawal propagates to the very next decision.
--
-- Shape: one consent_record per (patient, organization) with an append-style
-- version history in consent_version. A grant either opens the record at
-- version 1 or supersedes the current version with a new one; a withdrawal
-- flips the current version to 'revoked'. current_version on the record always
-- points at the version that governs decisions right now.
--
-- Context isolation: patient/organization/actor are SOFT references (bare UUID
-- / TEXT ids) into other bounded contexts — no cross-schema foreign keys. The
-- only foreign key is intra-schema (version -> record), which is permitted.
--
-- No PHI: consent domains are consent-category labels (e.g. 'telemedicine'),
-- never clinical bodies; revocation_reason is a short operational label.

CREATE SCHEMA IF NOT EXISTS nelyo_consent;

CREATE TABLE nelyo_consent.consent_record (
  consent_id UUID PRIMARY KEY,
  patient_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  current_version INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One consent record per patient within an organization; a new grant
  -- supersedes rather than opening a second record.
  UNIQUE (patient_ref, organization_ref)
);

CREATE TABLE nelyo_consent.consent_version (
  consent_id UUID NOT NULL
    REFERENCES nelyo_consent.consent_record (consent_id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('granted', 'revoked', 'expired')),
  granted_domains TEXT[] NOT NULL DEFAULT '{}',
  effective_date TIMESTAMPTZ NOT NULL,
  expiry_date TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revoked_by_actor_ref TEXT,
  revocation_reason TEXT,
  superseded_by_version INTEGER,
  created_at TIMESTAMPTZ NOT NULL,
  created_by_actor_ref TEXT NOT NULL,
  PRIMARY KEY (consent_id, version)
);

-- Lookup by the subject of a decision (patient within an organization).
CREATE INDEX consent_record_patient_org_idx
  ON nelyo_consent.consent_record (patient_ref, organization_ref);

-- Version history reads for a record, newest first.
CREATE INDEX consent_version_consent_idx
  ON nelyo_consent.consent_version (consent_id, version DESC);
