-- Care Circle read model (roadmap M6.1 — Derived Read Models & Event-Driven Layer).
--
-- A DERIVED, bidirectionally-queryable projection of the relationship graph
-- (nelyo_relationship, M4.2): who may act for a patient, and whose circle an
-- actor belongs to. It is NOT a source of truth — it is rebuilt from
-- Relationship* domain events by the care-circle projection consumer, which
-- loads the authoritative relationship on each event and upserts the membership
-- row. One row per source relationship (relationship_ref PK), denormalized so
-- both "circle of patient P" and "wards of actor A" are single indexed lookups
-- (the relationship table only indexes (actor, patient, org)).
--
-- Context isolation: patient_ref, actor_ref, organization_ref, and the
-- relationship_ref it mirrors are all soft UUID references — there are NO foreign
-- keys at all, so isolation holds trivially and the projection can be rebuilt
-- independently.
--
-- No PHI: membership carries relationship references + capability labels
-- (relationship_type, permitted_actions, verification_method) only — never
-- clinical data. Membership effective-ness (expiry) is DERIVED at read time from
-- membership_status + expiry_date (derive-don't-persist), not flipped by a timer.

CREATE SCHEMA IF NOT EXISTS nelyo_care_circle;

CREATE TABLE nelyo_care_circle.care_circle_member (
  relationship_ref UUID PRIMARY KEY,
  patient_ref UUID NOT NULL,
  actor_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  relationship_type TEXT NOT NULL,
  membership_status TEXT NOT NULL CHECK (membership_status IN ('active', 'revoked', 'expired')),
  verification_method TEXT,
  effective_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  permitted_actions TEXT[] NOT NULL DEFAULT '{}',
  -- The eventId of the last projected event, for traceability.
  last_event_id UUID,
  projected_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- "Members of patient P's care circle."
CREATE INDEX care_circle_member_patient_org_idx
  ON nelyo_care_circle.care_circle_member (patient_ref, organization_ref);

-- "Patients actor A can act for" (their wards / dependents).
CREATE INDEX care_circle_member_actor_org_idx
  ON nelyo_care_circle.care_circle_member (actor_ref, organization_ref);
