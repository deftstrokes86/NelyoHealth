-- Prescription persistence (roadmap M5.5 — Core Resource Platform: Prescriptions).
--
-- The authoritative medication-prescription resource and its dispensing history.
-- A prescription is issued by a clinician (typically arising from a
-- consultation), has an authorized refill count, and is dispensed one fill at a
-- time until its refills are exhausted (status 'completed').
--
-- Conflict-free dispensing: a fill is claimed with a conditional decrement
-- guarded on status = 'active' AND refills_remaining > 0, so two concurrent
-- dispenses cannot over-dispense. The dispense row and the counter decrement
-- commit together in one transactional command.
--
-- Context isolation: patient_ref, prescriber_ref, organization_ref,
-- consultation_ref, and dispensed_by_ref are soft UUID references — NO
-- cross-context foreign keys. The only foreign key is intra-schema
-- (dispense -> prescription).
--
-- PHI discipline: medication_name, dosage_instructions, indication, the
-- medication code, and the controlled-substance schedule are PROTECTED clinical
-- data and live ONLY in this access-controlled store. Canonical prescription
-- events carry the prescription / dispense / actor references and non-clinical
-- metadata (refill counts, operational status) only.

CREATE SCHEMA IF NOT EXISTS nelyo_prescription;

CREATE TABLE nelyo_prescription.prescription (
  prescription_id UUID PRIMARY KEY,
  patient_ref UUID NOT NULL,
  prescriber_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  consultation_ref UUID,
  medication_name TEXT NOT NULL,
  medication_code TEXT,
  code_system TEXT,
  dosage_instructions TEXT NOT NULL,
  quantity TEXT,
  refills_authorized INTEGER NOT NULL CHECK (refills_authorized >= 1),
  refills_remaining INTEGER NOT NULL CHECK (refills_remaining >= 0),
  controlled_schedule TEXT CHECK (controlled_schedule IN ('II', 'III', 'IV', 'V')),
  indication TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
  prescribed_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  cancellation_reason_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nelyo_prescription.prescription_dispense (
  dispense_id UUID PRIMARY KEY,
  prescription_ref UUID NOT NULL
    REFERENCES nelyo_prescription.prescription (prescription_id) ON DELETE CASCADE,
  dispensed_by_ref UUID NOT NULL,
  quantity_dispensed TEXT,
  dispensed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A patient's prescriptions (the decision subject), newest first.
CREATE INDEX prescription_patient_org_idx
  ON nelyo_prescription.prescription (patient_ref, organization_ref, prescribed_at DESC);

-- A prescriber's prescriptions.
CREATE INDEX prescription_prescriber_idx
  ON nelyo_prescription.prescription (prescriber_ref, organization_ref);

-- Dispensing history for a prescription.
CREATE INDEX prescription_dispense_prescription_idx
  ON nelyo_prescription.prescription_dispense (prescription_ref, dispensed_at DESC);
