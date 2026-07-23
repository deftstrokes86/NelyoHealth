-- Consultation persistence (roadmap M5.3 — Core Resource Platform: Consultations).
--
-- The authoritative clinical-encounter resource: the session in which a
-- clinician sees a patient (in person, by phone, or via telemedicine), with a
-- status lifecycle and, for telemedicine, a set of participants. A consultation
-- may arise from an appointment (appointment_ref) or ad hoc.
--
-- Context isolation: appointment_ref, patient_ref, clinician_ref, and
-- organization_ref are soft UUID references into other bounded contexts — NO
-- cross-context foreign keys. The only foreign key is intra-schema
-- (participant -> consultation).
--
-- PHI discipline: chief_complaint and clinical_notes are clinical narrative and
-- live ONLY in this access-controlled store. Canonical consultation events carry
-- the consultation / appointment / actor references and non-clinical metadata
-- (modality, timestamps, operational status, participant role) — never the chief
-- complaint or the clinical notes.

CREATE SCHEMA IF NOT EXISTS nelyo_consultation;

CREATE TABLE nelyo_consultation.consultation (
  consultation_id UUID PRIMARY KEY,
  appointment_ref UUID,
  patient_ref UUID NOT NULL,
  clinician_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  modality TEXT NOT NULL CHECK (modality IN ('in-person', 'telemedicine', 'phone')),
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  scheduled_start TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  -- Clinical; access-controlled; never copied into events or audit detail.
  chief_complaint TEXT,
  clinical_notes TEXT,
  cancellation_reason_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nelyo_consultation.consultation_participant (
  consultation_id UUID NOT NULL
    REFERENCES nelyo_consultation.consultation (consultation_id) ON DELETE CASCADE,
  participant_ref UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'patient', 'clinician', 'guardian', 'caregiver', 'interpreter', 'observer'
  )),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (consultation_id, participant_ref)
);

-- A patient's consultations (the decision subject), newest first.
CREATE INDEX consultation_patient_org_idx
  ON nelyo_consultation.consultation (patient_ref, organization_ref, scheduled_start DESC);

-- A clinician's consultations.
CREATE INDEX consultation_clinician_idx
  ON nelyo_consultation.consultation (clinician_ref, organization_ref);

-- Resolve a consultation from its originating appointment.
CREATE INDEX consultation_appointment_idx
  ON nelyo_consultation.consultation (appointment_ref);
