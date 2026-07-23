import type { ClientBase } from "pg";

/**
 * Consultation repository (roadmap M5.3 — Consultations).
 *
 * Owns SQL for the clinical-encounter aggregate in nelyo_consultation. Client-
 * parameterized so callers control the transaction boundary: mutations run inside
 * the transactional-command path (state + outbox + audit in one transaction).
 *
 * chief_complaint and clinical_notes are loaded here for the access-controlled
 * record but the api layer keeps them out of events and audit details.
 */

export type ConsultationModality = "in-person" | "telemedicine" | "phone";
export type ConsultationStatus = "scheduled" | "in-progress" | "completed" | "cancelled";
export type ConsultationParticipantRole =
  | "patient"
  | "clinician"
  | "guardian"
  | "caregiver"
  | "interpreter"
  | "observer";

export interface ConsultationParticipant {
  participantRef: string;
  role: ConsultationParticipantRole;
  joinedAt?: string;
}

export interface PersistedConsultation {
  consultationId: string;
  appointmentRef?: string;
  patientRef: string;
  clinicianRef: string;
  organizationRef: string;
  modality: ConsultationModality;
  status: ConsultationStatus;
  scheduledStart?: string;
  startedAt?: string;
  endedAt?: string;
  chiefComplaint?: string;
  clinicalNotes?: string;
  cancellationReasonCode?: string;
  participants: ConsultationParticipant[];
  createdAt: string;
  updatedAt: string;
}

interface ConsultationRow {
  consultation_id: string;
  appointment_ref: string | null;
  patient_ref: string;
  clinician_ref: string;
  organization_ref: string;
  modality: ConsultationModality;
  status: ConsultationStatus;
  scheduled_start: string | Date | null;
  started_at: string | Date | null;
  ended_at: string | Date | null;
  chief_complaint: string | null;
  clinical_notes: string | null;
  cancellation_reason_code: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

interface ParticipantRow {
  participant_ref: string;
  role: ConsultationParticipantRole;
  joined_at: string | Date | null;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toIsoOrUndefined(value: string | Date | null): string | undefined {
  return value === null ? undefined : toIso(value);
}

const CONSULTATION_COLUMNS =
  "consultation_id, appointment_ref, patient_ref, clinician_ref, organization_ref, modality, " +
  "status, scheduled_start, started_at, ended_at, chief_complaint, clinical_notes, " +
  "cancellation_reason_code, created_at, updated_at";

function mapConsultation(
  row: ConsultationRow,
  participants: ConsultationParticipant[]
): PersistedConsultation {
  return {
    consultationId: row.consultation_id,
    appointmentRef: row.appointment_ref ?? undefined,
    patientRef: row.patient_ref,
    clinicianRef: row.clinician_ref,
    organizationRef: row.organization_ref,
    modality: row.modality,
    status: row.status,
    scheduledStart: toIsoOrUndefined(row.scheduled_start),
    startedAt: toIsoOrUndefined(row.started_at),
    endedAt: toIsoOrUndefined(row.ended_at),
    chiefComplaint: row.chief_complaint ?? undefined,
    clinicalNotes: row.clinical_notes ?? undefined,
    cancellationReasonCode: row.cancellation_reason_code ?? undefined,
    participants,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

// ---------- Mutations (run inside the transactional command) ----------

export async function insertConsultation(
  client: ClientBase,
  input: {
    consultationId: string;
    appointmentRef?: string;
    patientRef: string;
    clinicianRef: string;
    organizationRef: string;
    modality: ConsultationModality;
    scheduledStart?: string;
    chiefComplaint?: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_consultation.consultation
       (consultation_id, appointment_ref, patient_ref, clinician_ref, organization_ref, modality,
        status, scheduled_start, chief_complaint, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'scheduled', $7, $8, $9, $10)`,
    [
      input.consultationId,
      input.appointmentRef ?? null,
      input.patientRef,
      input.clinicianRef,
      input.organizationRef,
      input.modality,
      input.scheduledStart ?? null,
      input.chiefComplaint ?? null,
      input.createdAt,
      input.updatedAt
    ]
  );
}

export async function markConsultationStarted(
  client: ClientBase,
  input: { consultationId: string; startedAt: string; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_consultation.consultation
        SET status = 'in-progress', started_at = $2, updated_at = $3
      WHERE consultation_id = $1`,
    [input.consultationId, input.startedAt, input.updatedAt]
  );
}

export async function markConsultationCompleted(
  client: ClientBase,
  input: { consultationId: string; endedAt: string; clinicalNotes?: string; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_consultation.consultation
        SET status = 'completed', ended_at = $2, clinical_notes = $3, updated_at = $4
      WHERE consultation_id = $1`,
    [input.consultationId, input.endedAt, input.clinicalNotes ?? null, input.updatedAt]
  );
}

export async function markConsultationCancelled(
  client: ClientBase,
  input: { consultationId: string; cancellationReasonCode: string; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_consultation.consultation
        SET status = 'cancelled', cancellation_reason_code = $2, updated_at = $3
      WHERE consultation_id = $1`,
    [input.consultationId, input.cancellationReasonCode, input.updatedAt]
  );
}

export async function insertConsultationParticipant(
  client: ClientBase,
  input: {
    consultationId: string;
    participantRef: string;
    role: ConsultationParticipantRole;
    joinedAt?: string;
    createdAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_consultation.consultation_participant
       (consultation_id, participant_ref, role, joined_at, created_at)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (consultation_id, participant_ref) DO NOTHING`,
    [
      input.consultationId,
      input.participantRef,
      input.role,
      input.joinedAt ?? null,
      input.createdAt
    ]
  );
}

// ---------- Reads ----------

async function loadParticipants(
  client: ClientBase,
  consultationId: string
): Promise<ConsultationParticipant[]> {
  const result = await client.query<ParticipantRow>(
    `SELECT participant_ref, role, joined_at
       FROM nelyo_consultation.consultation_participant
      WHERE consultation_id = $1
      ORDER BY role ASC`,
    [consultationId]
  );
  return result.rows.map((row) => ({
    participantRef: row.participant_ref,
    role: row.role,
    joinedAt: toIsoOrUndefined(row.joined_at)
  }));
}

export async function loadConsultation(
  client: ClientBase,
  consultationId: string
): Promise<PersistedConsultation | null> {
  const result = await client.query<ConsultationRow>(
    `SELECT ${CONSULTATION_COLUMNS} FROM nelyo_consultation.consultation WHERE consultation_id = $1`,
    [consultationId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapConsultation(row, await loadParticipants(client, consultationId));
}

export async function listConsultationsForPatient(
  client: ClientBase,
  input: { patientRef: string; organizationRef: string }
): Promise<PersistedConsultation[]> {
  const result = await client.query<ConsultationRow>(
    `SELECT ${CONSULTATION_COLUMNS} FROM nelyo_consultation.consultation
      WHERE patient_ref = $1 AND organization_ref = $2
      ORDER BY scheduled_start DESC NULLS LAST`,
    [input.patientRef, input.organizationRef]
  );
  const consultations: PersistedConsultation[] = [];
  for (const row of result.rows) {
    consultations.push(mapConsultation(row, await loadParticipants(client, row.consultation_id)));
  }
  return consultations;
}
