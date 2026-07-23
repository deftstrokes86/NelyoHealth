-- Break-glass persistence (roadmap M4.3 — Persisted Emergency Access).
--
-- Break-glass is the tightly-constrained emergency override: a clinician may
-- reach a patient's record without the normal consent/relationship gates, but
-- only for a stated justification, for a short time-bounded window, and only
-- with a full, immutable audit trail. This is the authoritative store for those
-- grants. Authorization DERIVES the override from the CURRENT grant at read time
-- (derive-don't-persist): an active grant supplies the override, and expiry is
-- evaluated against expires_at at decision time, so the override lapses
-- automatically the moment the window closes — no batch flip required.
--
-- Its own schema (strongest isolation): break-glass is a distinct, highly
-- sensitive emergency-access concern that a deployment will want to harden and
-- audit independently (WORM storage, restricted grants). actor/patient/
-- organization are soft references into other bounded contexts — NO cross-context
-- foreign keys.
--
-- PHI discipline: the justification may carry clinical narrative, so it lives
-- ONLY in this access-controlled record. Events and audit details carry the
-- access_id reference and non-clinical metadata (actor/patient/org refs, ttl,
-- status, review outcome) — never the justification text. Governance reporting
-- joins the audit trail (aggregate = access_id) back to this record.
--
-- Immutable justification + actor attribution: enforced at the database by a
-- trigger that rejects any change to justification or actor_ref. DELETE is left
-- available so test fixtures can clean up run-scoped rows; production hardening
-- (revoking UPDATE/DELETE, WORM) is the tracked ops follow-up.

CREATE SCHEMA IF NOT EXISTS nelyo_break_glass;

CREATE TABLE nelyo_break_glass.break_glass_access (
  access_id UUID PRIMARY KEY,
  actor_ref UUID NOT NULL,
  patient_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  -- Immutable justification (see trigger below). Access-controlled; never
  -- copied into events or audit detail.
  justification TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('requested', 'active', 'expired', 'review-completed')),
  ttl_minutes INTEGER NOT NULL CHECK (ttl_minutes > 0 AND ttl_minutes <= 15),
  requested_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  activated_at TIMESTAMPTZ,
  compliance_notified_at TIMESTAMPTZ,
  compliance_notification_ref TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by_actor_ref TEXT,
  review_outcome TEXT CHECK (review_outcome IN ('approved', 'rejected', 'follow-up-required')),
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Authorization hot path: the governing grant for an (actor, patient, org) subject.
CREATE INDEX break_glass_access_actor_patient_org_idx
  ON nelyo_break_glass.break_glass_access (actor_ref, patient_ref, organization_ref);

-- Post-incident review / governance reporting: every grant touching a patient.
CREATE INDEX break_glass_access_patient_org_idx
  ON nelyo_break_glass.break_glass_access (patient_ref, organization_ref, requested_at DESC);

-- Immutable justification and actor attribution: the two facts an emergency
-- audit must be able to trust cannot be rewritten after the fact.
CREATE OR REPLACE FUNCTION nelyo_break_glass.reject_immutable_column_change()
  RETURNS TRIGGER AS $$
BEGIN
  IF NEW.justification IS DISTINCT FROM OLD.justification THEN
    RAISE EXCEPTION 'break-glass justification is immutable (access_id=%)', OLD.access_id;
  END IF;
  IF NEW.actor_ref IS DISTINCT FROM OLD.actor_ref THEN
    RAISE EXCEPTION 'break-glass actor attribution is immutable (access_id=%)', OLD.access_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER break_glass_access_immutable_columns
  BEFORE UPDATE ON nelyo_break_glass.break_glass_access
  FOR EACH ROW EXECUTE FUNCTION nelyo_break_glass.reject_immutable_column_change();
