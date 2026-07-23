-- Relationship persistence (roadmap M4.2 — Relationship Persistence).
--
-- The Patients and Relationships bounded context owns the authoritative
-- relationship graph: who may act for a patient, in what capacity (guardian,
-- household, sponsor, caregiver delegation, emergency contact, clinical proxy),
-- within which organization, and under what lifecycle (verification, permitted
-- actions, effective/expiry window, revocation). Authorization DERIVES the
-- relationship dimension from the CURRENT row at read time (derive-don't-persist):
-- a revocation or an expiry propagates to the very next decision, and expiry is
-- evaluated against expiry_date at decision time rather than requiring a batch
-- flip.
--
-- Graph, not tree: actor_ref / patient_ref / organization_ref are independent
-- soft references, so a diaspora guardian in one place can hold authority over a
-- dependent elsewhere, and an actor may hold several relationship types across
-- organizations. There are NO cross-context foreign keys — actor, patient, and
-- organization live in other bounded contexts and are referenced by bare id.
--
-- Versioned auditability comes from the unified audit trail: every establish /
-- verify / revoke command writes an append-only audit event keyed to
-- relationship_id (aggregate), reconstructing the full lifecycle history.
--
-- No PHI: relationship_type / verification_method / permitted_actions are
-- capability labels; revocation_reason is a short operational label.

CREATE SCHEMA IF NOT EXISTS nelyo_relationship;

CREATE TABLE nelyo_relationship.relationship (
  relationship_id UUID PRIMARY KEY,
  actor_ref UUID NOT NULL,
  patient_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'guardian', 'household', 'sponsor', 'caregiver-delegation',
    'emergency-contact', 'clinical-proxy'
  )),
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked', 'expired')),
  verification_method TEXT NOT NULL CHECK (verification_method IN (
    'government-id', 'clinical-attestation', 'organization-attestation',
    'legal-document', 'self-attested'
  )),
  effective_date TIMESTAMPTZ NOT NULL,
  expiry_date TIMESTAMPTZ,
  permitted_actions TEXT[] NOT NULL DEFAULT '{}',
  revoked_at TIMESTAMPTZ,
  revoked_by_actor_ref TEXT,
  revocation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- At most one relationship of a given type between an actor and a patient
  -- within an organization; re-establishing updates that row in place.
  UNIQUE (actor_ref, patient_ref, organization_ref, relationship_type)
);

-- The authorization hot path: find the governing relationship for an
-- (actor, patient, organization) decision subject.
CREATE INDEX relationship_actor_patient_org_idx
  ON nelyo_relationship.relationship (actor_ref, patient_ref, organization_ref);

-- Organization-scoped administration / review listing.
CREATE INDEX relationship_org_idx
  ON nelyo_relationship.relationship (organization_ref);
