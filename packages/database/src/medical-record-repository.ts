import type { ClientBase } from "pg";

/**
 * Medical-record repository (roadmap M5.4 — Medical Records).
 *
 * Owns SQL for the longitudinal clinical record in nelyo_medical_record. Client-
 * parameterized so callers control the transaction boundary: mutations run inside
 * the transactional-command path (state + outbox + audit in one transaction).
 *
 * Entries are append-only: `insertEntry` adds; `setEntryStatus` moves lifecycle
 * status for corrections. The clinical content itself is immutable at the
 * database (trigger). clinical_content / code are loaded here for the
 * access-controlled record but the api layer keeps them out of events and audit.
 */

export type MedicalRecordStatus = "active" | "closed";
export type MedicalRecordEntryType =
  | "allergy"
  | "diagnosis"
  | "medication"
  | "problem"
  | "observation"
  | "immunization"
  | "note";
export type MedicalRecordEntryStatus = "active" | "amended" | "entered-in-error" | "resolved";

export interface PersistedMedicalRecordEntry {
  entryId: string;
  recordId: string;
  entryType: MedicalRecordEntryType;
  authorRef: string;
  codeSystem?: string;
  code?: string;
  clinicalContent: string;
  status: MedicalRecordEntryStatus;
  supersedesEntryRef?: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersistedMedicalRecord {
  recordId: string;
  patientRef: string;
  organizationRef: string;
  status: MedicalRecordStatus;
  entries: PersistedMedicalRecordEntry[];
  createdAt: string;
  updatedAt: string;
}

interface RecordRow {
  record_id: string;
  patient_ref: string;
  organization_ref: string;
  status: MedicalRecordStatus;
  created_at: string | Date;
  updated_at: string | Date;
}

interface EntryRow {
  entry_id: string;
  record_id: string;
  entry_type: MedicalRecordEntryType;
  author_ref: string;
  code_system: string | null;
  code: string | null;
  clinical_content: string;
  status: MedicalRecordEntryStatus;
  supersedes_entry_ref: string | null;
  recorded_at: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapEntry(row: EntryRow): PersistedMedicalRecordEntry {
  return {
    entryId: row.entry_id,
    recordId: row.record_id,
    entryType: row.entry_type,
    authorRef: row.author_ref,
    codeSystem: row.code_system ?? undefined,
    code: row.code ?? undefined,
    clinicalContent: row.clinical_content,
    status: row.status,
    supersedesEntryRef: row.supersedes_entry_ref ?? undefined,
    recordedAt: toIso(row.recorded_at),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

const ENTRY_COLUMNS =
  "entry_id, record_id, entry_type, author_ref, code_system, code, clinical_content, status, " +
  "supersedes_entry_ref, recorded_at, created_at, updated_at";

// ---------- Mutations (run inside the transactional command) ----------

export async function insertMedicalRecord(
  client: ClientBase,
  input: {
    recordId: string;
    patientRef: string;
    organizationRef: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_medical_record.medical_record
       (record_id, patient_ref, organization_ref, status, created_at, updated_at)
     VALUES ($1, $2, $3, 'active', $4, $5)`,
    [input.recordId, input.patientRef, input.organizationRef, input.createdAt, input.updatedAt]
  );
}

export async function insertMedicalRecordEntry(
  client: ClientBase,
  input: {
    entryId: string;
    recordId: string;
    entryType: MedicalRecordEntryType;
    authorRef: string;
    codeSystem?: string;
    code?: string;
    clinicalContent: string;
    supersedesEntryRef?: string;
    recordedAt: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_medical_record.medical_record_entry
       (entry_id, record_id, entry_type, author_ref, code_system, code, clinical_content, status,
        supersedes_entry_ref, recorded_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8, $9, $10, $11)`,
    [
      input.entryId,
      input.recordId,
      input.entryType,
      input.authorRef,
      input.codeSystem ?? null,
      input.code ?? null,
      input.clinicalContent,
      input.supersedesEntryRef ?? null,
      input.recordedAt,
      input.createdAt,
      input.updatedAt
    ]
  );
}

/** Move an entry's lifecycle status (correction path — clinical content is immutable). */
export async function setMedicalRecordEntryStatus(
  client: ClientBase,
  input: { entryId: string; status: MedicalRecordEntryStatus; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_medical_record.medical_record_entry
        SET status = $2, updated_at = $3
      WHERE entry_id = $1`,
    [input.entryId, input.status, input.updatedAt]
  );
}

// ---------- Reads ----------

async function loadEntries(
  client: ClientBase,
  recordId: string
): Promise<PersistedMedicalRecordEntry[]> {
  const result = await client.query<EntryRow>(
    `SELECT ${ENTRY_COLUMNS} FROM nelyo_medical_record.medical_record_entry
      WHERE record_id = $1
      ORDER BY recorded_at ASC`,
    [recordId]
  );
  return result.rows.map(mapEntry);
}

function mapRecord(row: RecordRow, entries: PersistedMedicalRecordEntry[]): PersistedMedicalRecord {
  return {
    recordId: row.record_id,
    patientRef: row.patient_ref,
    organizationRef: row.organization_ref,
    status: row.status,
    entries,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

export async function loadMedicalRecord(
  client: ClientBase,
  recordId: string
): Promise<PersistedMedicalRecord | null> {
  const result = await client.query<RecordRow>(
    `SELECT record_id, patient_ref, organization_ref, status, created_at, updated_at
       FROM nelyo_medical_record.medical_record WHERE record_id = $1`,
    [recordId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapRecord(row, await loadEntries(client, recordId));
}

export async function loadMedicalRecordByPatientOrg(
  client: ClientBase,
  patientRef: string,
  organizationRef: string
): Promise<PersistedMedicalRecord | null> {
  const result = await client.query<RecordRow>(
    `SELECT record_id, patient_ref, organization_ref, status, created_at, updated_at
       FROM nelyo_medical_record.medical_record
      WHERE patient_ref = $1 AND organization_ref = $2`,
    [patientRef, organizationRef]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapRecord(row, await loadEntries(client, row.record_id));
}

export async function loadMedicalRecordEntry(
  client: ClientBase,
  entryId: string
): Promise<PersistedMedicalRecordEntry | null> {
  const result = await client.query<EntryRow>(
    `SELECT ${ENTRY_COLUMNS} FROM nelyo_medical_record.medical_record_entry WHERE entry_id = $1`,
    [entryId]
  );
  const row = result.rows[0];
  return row ? mapEntry(row) : null;
}
