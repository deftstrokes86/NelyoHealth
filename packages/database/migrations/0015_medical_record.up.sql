-- Medical record persistence (roadmap M5.4 — Core Resource Platform: Medical Records).
--
-- The authoritative longitudinal clinical record: one medical_record per
-- (patient, organization), holding append-only medical_record_entry rows
-- (allergy, diagnosis, medication, problem, observation, immunization, note).
--
-- Append-only clinical history: entries are never edited in place. A correction
-- is a NEW entry that supersedes the prior one (supersedes_entry_ref), and the
-- prior entry's status moves to 'amended' or 'entered-in-error'. The clinical
-- content, author, type, and recorded time of an entry are IMMUTABLE at the
-- database (trigger) — only lifecycle status / supersession may change.
--
-- Context isolation: patient_ref, organization_ref, and author_ref are soft UUID
-- references — NO cross-context foreign keys. The only foreign key is
-- intra-schema (entry -> record).
--
-- PHI discipline: clinical_content, code, and code_system are PROTECTED clinical
-- data and live ONLY in this access-controlled store. Canonical medical-record
-- events carry the record / entry / author references and the entry TYPE
-- (category) only — never the clinical content or the diagnostic code.

CREATE SCHEMA IF NOT EXISTS nelyo_medical_record;

CREATE TABLE nelyo_medical_record.medical_record (
  record_id UUID PRIMARY KEY,
  patient_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One clinical record per patient within an organization.
  UNIQUE (patient_ref, organization_ref)
);

CREATE TABLE nelyo_medical_record.medical_record_entry (
  entry_id UUID PRIMARY KEY,
  record_id UUID NOT NULL
    REFERENCES nelyo_medical_record.medical_record (record_id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN (
    'allergy', 'diagnosis', 'medication', 'problem', 'observation', 'immunization', 'note'
  )),
  author_ref UUID NOT NULL,
  code_system TEXT,
  code TEXT,
  -- Immutable clinical narrative (see trigger). Access-controlled; never copied
  -- into events or audit detail.
  clinical_content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'amended', 'entered-in-error', 'resolved')),
  supersedes_entry_ref UUID,
  recorded_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX medical_record_patient_org_idx
  ON nelyo_medical_record.medical_record (patient_ref, organization_ref);

CREATE INDEX medical_record_entry_record_idx
  ON nelyo_medical_record.medical_record_entry (record_id, recorded_at DESC);

-- Append-only clinical content: the facts of an entry cannot be rewritten after
-- the fact. Corrections are new entries + status transitions. DELETE is left
-- available so test fixtures can clean up; production hardening (revoking
-- UPDATE/DELETE, WORM) is the tracked ops follow-up.
CREATE OR REPLACE FUNCTION nelyo_medical_record.reject_clinical_content_change()
  RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clinical_content IS DISTINCT FROM OLD.clinical_content
     OR NEW.author_ref IS DISTINCT FROM OLD.author_ref
     OR NEW.entry_type IS DISTINCT FROM OLD.entry_type
     OR NEW.recorded_at IS DISTINCT FROM OLD.recorded_at THEN
    RAISE EXCEPTION 'medical record entry clinical content is immutable (entry_id=%)', OLD.entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER medical_record_entry_immutable_content
  BEFORE UPDATE ON nelyo_medical_record.medical_record_entry
  FOR EACH ROW EXECUTE FUNCTION nelyo_medical_record.reject_clinical_content_change();
