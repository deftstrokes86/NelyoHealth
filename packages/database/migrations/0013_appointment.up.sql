-- Appointment persistence (roadmap M5.2 — Core Resource Platform: Appointments).
--
-- The authoritative Appointment resource plus the clinician availability it is
-- booked against. Two aggregates in one schema:
--   * availability_slot — a bookable clinician window (open / booked / closed);
--   * appointment       — a booked visit with a status lifecycle.
--
-- Conflict-free booking: a slot is booked with a conditional update guarded on
-- status = 'open', so two concurrent bookings cannot both win. The appointment
-- and the slot transition commit together in one transactional command.
--
-- Context isolation: patient_ref (patient profile), clinician_ref (identity),
-- and organization_ref (tenancy) are soft UUID references — NO cross-context
-- foreign keys. The only foreign key is intra-schema (appointment -> slot).
--
-- PHI discipline: reason_for_visit may carry clinical narrative and lives ONLY
-- in this access-controlled store. Canonical appointment events carry the
-- appointment / slot / actor references and non-clinical scheduling metadata
-- (times, appointment type, operational status) — never the reason for visit.

CREATE SCHEMA IF NOT EXISTS nelyo_appointment;

CREATE TABLE nelyo_appointment.availability_slot (
  slot_id UUID PRIMARY KEY,
  clinician_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'booked', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_at > start_at)
);

CREATE INDEX availability_slot_clinician_idx
  ON nelyo_appointment.availability_slot (clinician_ref, organization_ref, start_at);

CREATE TABLE nelyo_appointment.appointment (
  appointment_id UUID PRIMARY KEY,
  patient_ref UUID NOT NULL,
  clinician_ref UUID NOT NULL,
  organization_ref UUID NOT NULL,
  slot_ref UUID REFERENCES nelyo_appointment.availability_slot (slot_id) ON DELETE SET NULL,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  appointment_type TEXT NOT NULL,
  -- Clinical; access-controlled; never copied into events or audit detail.
  reason_for_visit TEXT,
  status TEXT NOT NULL CHECK (status IN (
    'requested', 'confirmed', 'checked-in', 'completed', 'cancelled', 'no-show'
  )),
  cancellation_reason_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (scheduled_end > scheduled_start)
);

-- A patient's appointments (the decision subject), newest first.
CREATE INDEX appointment_patient_org_idx
  ON nelyo_appointment.appointment (patient_ref, organization_ref, scheduled_start DESC);

-- A clinician's schedule.
CREATE INDEX appointment_clinician_idx
  ON nelyo_appointment.appointment (clinician_ref, organization_ref, scheduled_start DESC);
