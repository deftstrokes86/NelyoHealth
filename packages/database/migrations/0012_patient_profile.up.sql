-- Patient profile persistence (roadmap M5.1 — Core Resource Platform: Patient Profiles).
--
-- The authoritative Patient resource in the Patients and Relationships context.
-- Patients OWNS Patient (source-of-truth-matrix REQ-LOCK-001): no other context
-- duplicates it, and it does NOT duplicate the identity master. The legal name
-- and date of birth live on the identity Person (nelyo_identity.person); the
-- profile references that Person by soft id and owns the CARE-context data:
-- care-context demographics, contact points, emergency contacts, and medical
-- identifiers.
--
-- Context isolation: person_ref (identity) and organization_ref (tenancy) are
-- soft UUID references — NO cross-context foreign keys. The only foreign key is
-- intra-schema (identifier -> profile).
--
-- PHI discipline: demographics, contact values, and identifiers are PROTECTED /
-- SENSITIVE data. They live ONLY in this access-controlled store. Canonical
-- patient-profile events carry the patient_id / person_ref references and
-- non-clinical metadata — never names, demographics, contact values, or
-- identifier values.

CREATE SCHEMA IF NOT EXISTS nelyo_patient;

CREATE TABLE nelyo_patient.patient_profile (
  patient_id UUID PRIMARY KEY,
  -- Soft reference to the identity master (name + DOB live there, not here).
  person_ref UUID NOT NULL,
  -- Soft reference to the owning care organization.
  organization_ref UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'deceased', 'merged')),
  -- Care-context demographics (the identity Person owns legal name + DOB).
  preferred_name TEXT,
  biological_sex TEXT CHECK (biological_sex IN ('female', 'male', 'intersex', 'unknown')),
  gender_identity TEXT,
  preferred_language TEXT,
  -- Aggregate-internal structures loaded with the profile.
  contact_points JSONB NOT NULL DEFAULT '[]',
  emergency_contacts JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One patient profile per person within an organization: no duplicate Patient
  -- per person per care org.
  UNIQUE (person_ref, organization_ref)
);

CREATE TABLE nelyo_patient.patient_identifier (
  patient_id UUID NOT NULL
    REFERENCES nelyo_patient.patient_profile (patient_id) ON DELETE CASCADE,
  -- Denormalized from the profile so identifier uniqueness can be scoped per org.
  organization_ref UUID NOT NULL,
  system TEXT NOT NULL,
  value TEXT NOT NULL,
  assigning_authority TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (patient_id, system),
  -- No two patients share a medical identifier within an organization
  -- (prevents duplicate patient records via a shared MRN / national id).
  UNIQUE (organization_ref, system, value)
);

CREATE INDEX patient_profile_person_org_idx
  ON nelyo_patient.patient_profile (person_ref, organization_ref);

-- Find a patient by a medical identifier (registration / de-duplication).
CREATE INDEX patient_identifier_lookup_idx
  ON nelyo_patient.patient_identifier (organization_ref, system, value);
