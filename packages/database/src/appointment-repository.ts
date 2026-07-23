import type { ClientBase } from "pg";

/**
 * Appointment repository (roadmap M5.2 — Appointments).
 *
 * Owns SQL for the availability + appointment aggregates in nelyo_appointment.
 * Client-parameterized so callers control the transaction boundary: mutations run
 * inside the transactional-command path (state + outbox + audit in one
 * transaction).
 *
 * reason_for_visit is loaded here for the access-controlled record but the api
 * layer keeps it out of events and audit details. Appointment status is the
 * authoritative lifecycle; no derived state is cached.
 */

export type SlotStatus = "open" | "booked" | "closed";
export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled"
  | "no-show";

export interface PersistedAvailabilitySlot {
  slotId: string;
  clinicianRef: string;
  organizationRef: string;
  startAt: string;
  endAt: string;
  status: SlotStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PersistedAppointment {
  appointmentId: string;
  patientRef: string;
  clinicianRef: string;
  organizationRef: string;
  slotRef?: string;
  scheduledStart: string;
  scheduledEnd: string;
  appointmentType: string;
  reasonForVisit?: string;
  status: AppointmentStatus;
  cancellationReasonCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface SlotRow {
  slot_id: string;
  clinician_ref: string;
  organization_ref: string;
  start_at: string | Date;
  end_at: string | Date;
  status: SlotStatus;
  created_at: string | Date;
  updated_at: string | Date;
}

interface AppointmentRow {
  appointment_id: string;
  patient_ref: string;
  clinician_ref: string;
  organization_ref: string;
  slot_ref: string | null;
  scheduled_start: string | Date;
  scheduled_end: string | Date;
  appointment_type: string;
  reason_for_visit: string | null;
  status: AppointmentStatus;
  cancellation_reason_code: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapSlot(row: SlotRow): PersistedAvailabilitySlot {
  return {
    slotId: row.slot_id,
    clinicianRef: row.clinician_ref,
    organizationRef: row.organization_ref,
    startAt: toIso(row.start_at),
    endAt: toIso(row.end_at),
    status: row.status,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

function mapAppointment(row: AppointmentRow): PersistedAppointment {
  return {
    appointmentId: row.appointment_id,
    patientRef: row.patient_ref,
    clinicianRef: row.clinician_ref,
    organizationRef: row.organization_ref,
    slotRef: row.slot_ref ?? undefined,
    scheduledStart: toIso(row.scheduled_start),
    scheduledEnd: toIso(row.scheduled_end),
    appointmentType: row.appointment_type,
    reasonForVisit: row.reason_for_visit ?? undefined,
    status: row.status,
    cancellationReasonCode: row.cancellation_reason_code ?? undefined,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

const SLOT_COLUMNS =
  "slot_id, clinician_ref, organization_ref, start_at, end_at, status, created_at, updated_at";
const APPOINTMENT_COLUMNS =
  "appointment_id, patient_ref, clinician_ref, organization_ref, slot_ref, scheduled_start, " +
  "scheduled_end, appointment_type, reason_for_visit, status, cancellation_reason_code, " +
  "created_at, updated_at";

// ---------- Availability ----------

export async function insertAvailabilitySlot(
  client: ClientBase,
  input: {
    slotId: string;
    clinicianRef: string;
    organizationRef: string;
    startAt: string;
    endAt: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_appointment.availability_slot
       (slot_id, clinician_ref, organization_ref, start_at, end_at, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, 'open', $6, $7)`,
    [
      input.slotId,
      input.clinicianRef,
      input.organizationRef,
      input.startAt,
      input.endAt,
      input.createdAt,
      input.updatedAt
    ]
  );
}

/**
 * Transition a slot to a new status only if it currently holds an expected
 * status. Returns true iff the row was updated — the conflict-free booking guard
 * (book only if 'open'; free only if 'booked').
 */
export async function transitionSlotStatusIf(
  client: ClientBase,
  input: { slotId: string; expected: SlotStatus; next: SlotStatus; updatedAt: string }
): Promise<boolean> {
  const result = await client.query(
    `UPDATE nelyo_appointment.availability_slot
        SET status = $3, updated_at = $4
      WHERE slot_id = $1 AND status = $2`,
    [input.slotId, input.expected, input.next, input.updatedAt]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function loadAvailabilitySlot(
  client: ClientBase,
  slotId: string
): Promise<PersistedAvailabilitySlot | null> {
  const result = await client.query<SlotRow>(
    `SELECT ${SLOT_COLUMNS} FROM nelyo_appointment.availability_slot WHERE slot_id = $1`,
    [slotId]
  );
  const row = result.rows[0];
  return row ? mapSlot(row) : null;
}

// ---------- Appointment ----------

export async function insertAppointment(
  client: ClientBase,
  input: {
    appointmentId: string;
    patientRef: string;
    clinicianRef: string;
    organizationRef: string;
    slotRef?: string;
    scheduledStart: string;
    scheduledEnd: string;
    appointmentType: string;
    reasonForVisit?: string;
    status: AppointmentStatus;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_appointment.appointment
       (appointment_id, patient_ref, clinician_ref, organization_ref, slot_ref, scheduled_start,
        scheduled_end, appointment_type, reason_for_visit, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      input.appointmentId,
      input.patientRef,
      input.clinicianRef,
      input.organizationRef,
      input.slotRef ?? null,
      input.scheduledStart,
      input.scheduledEnd,
      input.appointmentType,
      input.reasonForVisit ?? null,
      input.status,
      input.createdAt,
      input.updatedAt
    ]
  );
}

export async function setAppointmentStatus(
  client: ClientBase,
  input: {
    appointmentId: string;
    status: AppointmentStatus;
    cancellationReasonCode?: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_appointment.appointment
        SET status = $2, cancellation_reason_code = $3, updated_at = $4
      WHERE appointment_id = $1`,
    [input.appointmentId, input.status, input.cancellationReasonCode ?? null, input.updatedAt]
  );
}

export async function setAppointmentSchedule(
  client: ClientBase,
  input: {
    appointmentId: string;
    slotRef?: string;
    scheduledStart: string;
    scheduledEnd: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_appointment.appointment
        SET slot_ref = $2, scheduled_start = $3, scheduled_end = $4, updated_at = $5
      WHERE appointment_id = $1`,
    [
      input.appointmentId,
      input.slotRef ?? null,
      input.scheduledStart,
      input.scheduledEnd,
      input.updatedAt
    ]
  );
}

export async function loadAppointment(
  client: ClientBase,
  appointmentId: string
): Promise<PersistedAppointment | null> {
  const result = await client.query<AppointmentRow>(
    `SELECT ${APPOINTMENT_COLUMNS} FROM nelyo_appointment.appointment WHERE appointment_id = $1`,
    [appointmentId]
  );
  const row = result.rows[0];
  return row ? mapAppointment(row) : null;
}

export async function listAppointmentsForPatient(
  client: ClientBase,
  input: { patientRef: string; organizationRef: string }
): Promise<PersistedAppointment[]> {
  const result = await client.query<AppointmentRow>(
    `SELECT ${APPOINTMENT_COLUMNS} FROM nelyo_appointment.appointment
      WHERE patient_ref = $1 AND organization_ref = $2
      ORDER BY scheduled_start DESC`,
    [input.patientRef, input.organizationRef]
  );
  return result.rows.map(mapAppointment);
}
