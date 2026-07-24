import type { ClientBase } from "pg";

/**
 * Prescription repository (roadmap M5.5 — Prescriptions).
 *
 * Owns SQL for the prescription + dispensing aggregates in nelyo_prescription.
 * Client-parameterized so callers control the transaction boundary: mutations run
 * inside the transactional-command path (state + outbox + audit in one
 * transaction).
 *
 * medication_name / dosage_instructions / indication / code / controlled_schedule
 * are loaded here for the access-controlled record but the api layer keeps them
 * out of events and audit. Refill dispensing is conflict-free (conditional
 * decrement).
 */

export type PrescriptionStatus = "active" | "completed" | "cancelled" | "expired";
export type ControlledSchedule = "II" | "III" | "IV" | "V";

export interface PrescriptionDispenseRecord {
  dispenseId: string;
  dispensedByRef: string;
  quantityDispensed?: string;
  dispensedAt: string;
}

export interface PersistedPrescription {
  prescriptionId: string;
  patientRef: string;
  prescriberRef: string;
  organizationRef: string;
  consultationRef?: string;
  medicationName: string;
  medicationCode?: string;
  codeSystem?: string;
  dosageInstructions: string;
  quantity?: string;
  refillsAuthorized: number;
  refillsRemaining: number;
  controlledSchedule?: ControlledSchedule;
  indication?: string;
  status: PrescriptionStatus;
  prescribedAt: string;
  expiresAt?: string;
  cancellationReasonCode?: string;
  dispenses: PrescriptionDispenseRecord[];
  createdAt: string;
  updatedAt: string;
}

interface PrescriptionRow {
  prescription_id: string;
  patient_ref: string;
  prescriber_ref: string;
  organization_ref: string;
  consultation_ref: string | null;
  medication_name: string;
  medication_code: string | null;
  code_system: string | null;
  dosage_instructions: string;
  quantity: string | null;
  refills_authorized: number;
  refills_remaining: number;
  controlled_schedule: ControlledSchedule | null;
  indication: string | null;
  status: PrescriptionStatus;
  prescribed_at: string | Date;
  expires_at: string | Date | null;
  cancellation_reason_code: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

interface DispenseRow {
  dispense_id: string;
  dispensed_by_ref: string;
  quantity_dispensed: string | null;
  dispensed_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toIsoOrUndefined(value: string | Date | null): string | undefined {
  return value === null ? undefined : toIso(value);
}

const PRESCRIPTION_COLUMNS =
  "prescription_id, patient_ref, prescriber_ref, organization_ref, consultation_ref, " +
  "medication_name, medication_code, code_system, dosage_instructions, quantity, " +
  "refills_authorized, refills_remaining, controlled_schedule, indication, status, prescribed_at, " +
  "expires_at, cancellation_reason_code, created_at, updated_at";

function mapPrescription(
  row: PrescriptionRow,
  dispenses: PrescriptionDispenseRecord[]
): PersistedPrescription {
  return {
    prescriptionId: row.prescription_id,
    patientRef: row.patient_ref,
    prescriberRef: row.prescriber_ref,
    organizationRef: row.organization_ref,
    consultationRef: row.consultation_ref ?? undefined,
    medicationName: row.medication_name,
    medicationCode: row.medication_code ?? undefined,
    codeSystem: row.code_system ?? undefined,
    dosageInstructions: row.dosage_instructions,
    quantity: row.quantity ?? undefined,
    refillsAuthorized: row.refills_authorized,
    refillsRemaining: row.refills_remaining,
    controlledSchedule: row.controlled_schedule ?? undefined,
    indication: row.indication ?? undefined,
    status: row.status,
    prescribedAt: toIso(row.prescribed_at),
    expiresAt: toIsoOrUndefined(row.expires_at),
    cancellationReasonCode: row.cancellation_reason_code ?? undefined,
    dispenses,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

// ---------- Mutations (run inside the transactional command) ----------

export async function insertPrescription(
  client: ClientBase,
  input: {
    prescriptionId: string;
    patientRef: string;
    prescriberRef: string;
    organizationRef: string;
    consultationRef?: string;
    medicationName: string;
    medicationCode?: string;
    codeSystem?: string;
    dosageInstructions: string;
    quantity?: string;
    refillsAuthorized: number;
    controlledSchedule?: ControlledSchedule;
    indication?: string;
    prescribedAt: string;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_prescription.prescription
       (prescription_id, patient_ref, prescriber_ref, organization_ref, consultation_ref,
        medication_name, medication_code, code_system, dosage_instructions, quantity,
        refills_authorized, refills_remaining, controlled_schedule, indication, status,
        prescribed_at, expires_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, $12, $13, 'active', $14, $15, $16, $17)`,
    [
      input.prescriptionId,
      input.patientRef,
      input.prescriberRef,
      input.organizationRef,
      input.consultationRef ?? null,
      input.medicationName,
      input.medicationCode ?? null,
      input.codeSystem ?? null,
      input.dosageInstructions,
      input.quantity ?? null,
      input.refillsAuthorized,
      input.controlledSchedule ?? null,
      input.indication ?? null,
      input.prescribedAt,
      input.expiresAt ?? null,
      input.createdAt,
      input.updatedAt
    ]
  );
}

/**
 * Claim one fill: atomically decrement refills_remaining (and complete the
 * prescription when it reaches zero) only if it is 'active' with fills left.
 * Returns the post-decrement state, or null if nothing was dispensable.
 */
export async function claimPrescriptionFill(
  client: ClientBase,
  input: { prescriptionId: string; updatedAt: string }
): Promise<{ refillsRemaining: number; status: PrescriptionStatus } | null> {
  const result = await client.query<{ refills_remaining: number; status: PrescriptionStatus }>(
    `UPDATE nelyo_prescription.prescription
        SET refills_remaining = refills_remaining - 1,
            status = CASE WHEN refills_remaining - 1 <= 0 THEN 'completed' ELSE status END,
            updated_at = $2
      WHERE prescription_id = $1 AND status = 'active' AND refills_remaining > 0
      RETURNING refills_remaining, status`,
    [input.prescriptionId, input.updatedAt]
  );
  const row = result.rows[0];
  return row ? { refillsRemaining: row.refills_remaining, status: row.status } : null;
}

export async function insertPrescriptionDispense(
  client: ClientBase,
  input: {
    dispenseId: string;
    prescriptionRef: string;
    dispensedByRef: string;
    quantityDispensed?: string;
    dispensedAt: string;
    createdAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_prescription.prescription_dispense
       (dispense_id, prescription_ref, dispensed_by_ref, quantity_dispensed, dispensed_at, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      input.dispenseId,
      input.prescriptionRef,
      input.dispensedByRef,
      input.quantityDispensed ?? null,
      input.dispensedAt,
      input.createdAt
    ]
  );
}

export async function markPrescriptionCancelled(
  client: ClientBase,
  input: { prescriptionId: string; cancellationReasonCode: string; updatedAt: string }
): Promise<boolean> {
  const result = await client.query(
    `UPDATE nelyo_prescription.prescription
        SET status = 'cancelled', cancellation_reason_code = $2, updated_at = $3
      WHERE prescription_id = $1 AND status = 'active'`,
    [input.prescriptionId, input.cancellationReasonCode, input.updatedAt]
  );
  return (result.rowCount ?? 0) > 0;
}

// ---------- Reads ----------

async function loadDispenses(
  client: ClientBase,
  prescriptionId: string
): Promise<PrescriptionDispenseRecord[]> {
  const result = await client.query<DispenseRow>(
    `SELECT dispense_id, dispensed_by_ref, quantity_dispensed, dispensed_at
       FROM nelyo_prescription.prescription_dispense
      WHERE prescription_ref = $1
      ORDER BY dispensed_at ASC`,
    [prescriptionId]
  );
  return result.rows.map((row) => ({
    dispenseId: row.dispense_id,
    dispensedByRef: row.dispensed_by_ref,
    quantityDispensed: row.quantity_dispensed ?? undefined,
    dispensedAt: toIso(row.dispensed_at)
  }));
}

export async function loadPrescription(
  client: ClientBase,
  prescriptionId: string
): Promise<PersistedPrescription | null> {
  const result = await client.query<PrescriptionRow>(
    `SELECT ${PRESCRIPTION_COLUMNS} FROM nelyo_prescription.prescription WHERE prescription_id = $1`,
    [prescriptionId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapPrescription(row, await loadDispenses(client, prescriptionId));
}

export async function listPrescriptionsForPatient(
  client: ClientBase,
  input: { patientRef: string; organizationRef: string }
): Promise<PersistedPrescription[]> {
  const result = await client.query<PrescriptionRow>(
    `SELECT ${PRESCRIPTION_COLUMNS} FROM nelyo_prescription.prescription
      WHERE patient_ref = $1 AND organization_ref = $2
      ORDER BY prescribed_at DESC`,
    [input.patientRef, input.organizationRef]
  );
  const prescriptions: PersistedPrescription[] = [];
  for (const row of result.rows) {
    prescriptions.push(mapPrescription(row, await loadDispenses(client, row.prescription_id)));
  }
  return prescriptions;
}
