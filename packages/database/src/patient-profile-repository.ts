import type { ClientBase } from "pg";

/**
 * Patient-profile repository (roadmap M5.1 — Patient Profiles).
 *
 * Owns SQL for the authoritative Patient resource in nelyo_patient. Client-
 * parameterized so callers control the transaction boundary: profile mutations
 * run inside the transactional-command path (state + outbox + audit in one
 * transaction).
 *
 * The identity master (legal name + DOB) is referenced via person_ref, never
 * duplicated here. Demographics, contact values, and identifier values are
 * PROTECTED / SENSITIVE and live only in this access-controlled store — the api
 * layer keeps them out of events and audit details.
 */

export type PatientProfileStatus = "active" | "inactive" | "deceased" | "merged";
export type PatientBiologicalSex = "female" | "male" | "intersex" | "unknown";

export interface PatientContactPoint {
  kind: string;
  value: string;
  rank?: number;
  isPrimary?: boolean;
}

export interface PatientEmergencyContact {
  name: string;
  relationshipLabel: string;
  phone: string;
  priority?: number;
}

export interface PatientIdentifier {
  system: string;
  value: string;
  assigningAuthority?: string;
}

export interface PersistedPatientProfile {
  patientId: string;
  personRef: string;
  organizationRef: string;
  status: PatientProfileStatus;
  preferredName?: string;
  biologicalSex?: PatientBiologicalSex;
  genderIdentity?: string;
  preferredLanguage?: string;
  contactPoints: PatientContactPoint[];
  emergencyContacts: PatientEmergencyContact[];
  identifiers: PatientIdentifier[];
  createdAt: string;
  updatedAt: string;
}

interface PatientProfileRow {
  patient_id: string;
  person_ref: string;
  organization_ref: string;
  status: PatientProfileStatus;
  preferred_name: string | null;
  biological_sex: PatientBiologicalSex | null;
  gender_identity: string | null;
  preferred_language: string | null;
  contact_points: PatientContactPoint[];
  emergency_contacts: PatientEmergencyContact[];
  created_at: string | Date;
  updated_at: string | Date;
}

interface PatientIdentifierRow {
  system: string;
  value: string;
  assigning_authority: string | null;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

const PROFILE_COLUMNS =
  "patient_id, person_ref, organization_ref, status, preferred_name, biological_sex, " +
  "gender_identity, preferred_language, contact_points, emergency_contacts, created_at, updated_at";

// ---------- Mutations (run inside the transactional command) ----------

export async function insertPatientProfile(
  client: ClientBase,
  input: {
    patientId: string;
    personRef: string;
    organizationRef: string;
    status: PatientProfileStatus;
    preferredName?: string;
    biologicalSex?: PatientBiologicalSex;
    genderIdentity?: string;
    preferredLanguage?: string;
    contactPoints: PatientContactPoint[];
    emergencyContacts: PatientEmergencyContact[];
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_patient.patient_profile
       (patient_id, person_ref, organization_ref, status, preferred_name, biological_sex,
        gender_identity, preferred_language, contact_points, emergency_contacts, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11, $12)`,
    [
      input.patientId,
      input.personRef,
      input.organizationRef,
      input.status,
      input.preferredName ?? null,
      input.biologicalSex ?? null,
      input.genderIdentity ?? null,
      input.preferredLanguage ?? null,
      JSON.stringify(input.contactPoints),
      JSON.stringify(input.emergencyContacts),
      input.createdAt,
      input.updatedAt
    ]
  );
}

export async function updatePatientProfileDemographics(
  client: ClientBase,
  input: {
    patientId: string;
    status: PatientProfileStatus;
    preferredName?: string;
    biologicalSex?: PatientBiologicalSex;
    genderIdentity?: string;
    preferredLanguage?: string;
    contactPoints: PatientContactPoint[];
    emergencyContacts: PatientEmergencyContact[];
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_patient.patient_profile
        SET status = $2,
            preferred_name = $3,
            biological_sex = $4,
            gender_identity = $5,
            preferred_language = $6,
            contact_points = $7::jsonb,
            emergency_contacts = $8::jsonb,
            updated_at = $9
      WHERE patient_id = $1`,
    [
      input.patientId,
      input.status,
      input.preferredName ?? null,
      input.biologicalSex ?? null,
      input.genderIdentity ?? null,
      input.preferredLanguage ?? null,
      JSON.stringify(input.contactPoints),
      JSON.stringify(input.emergencyContacts),
      input.updatedAt
    ]
  );
}

export async function insertPatientIdentifier(
  client: ClientBase,
  input: {
    patientId: string;
    organizationRef: string;
    system: string;
    value: string;
    assigningAuthority?: string;
    createdAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_patient.patient_identifier
       (patient_id, organization_ref, system, value, assigning_authority, created_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      input.patientId,
      input.organizationRef,
      input.system,
      input.value,
      input.assigningAuthority ?? null,
      input.createdAt
    ]
  );
}

// ---------- Reads ----------

async function loadIdentifiers(
  client: ClientBase,
  patientId: string
): Promise<PatientIdentifier[]> {
  const result = await client.query<PatientIdentifierRow>(
    `SELECT system, value, assigning_authority
       FROM nelyo_patient.patient_identifier
      WHERE patient_id = $1
      ORDER BY system ASC`,
    [patientId]
  );
  return result.rows.map((row) => ({
    system: row.system,
    value: row.value,
    assigningAuthority: row.assigning_authority ?? undefined
  }));
}

function mapProfile(
  row: PatientProfileRow,
  identifiers: PatientIdentifier[]
): PersistedPatientProfile {
  return {
    patientId: row.patient_id,
    personRef: row.person_ref,
    organizationRef: row.organization_ref,
    status: row.status,
    preferredName: row.preferred_name ?? undefined,
    biologicalSex: row.biological_sex ?? undefined,
    genderIdentity: row.gender_identity ?? undefined,
    preferredLanguage: row.preferred_language ?? undefined,
    contactPoints: [...row.contact_points],
    emergencyContacts: [...row.emergency_contacts],
    identifiers,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

export async function loadPatientProfile(
  client: ClientBase,
  patientId: string
): Promise<PersistedPatientProfile | null> {
  const result = await client.query<PatientProfileRow>(
    `SELECT ${PROFILE_COLUMNS} FROM nelyo_patient.patient_profile WHERE patient_id = $1`,
    [patientId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapProfile(row, await loadIdentifiers(client, patientId));
}

export async function loadPatientProfileByPersonOrg(
  client: ClientBase,
  personRef: string,
  organizationRef: string
): Promise<PersistedPatientProfile | null> {
  const result = await client.query<PatientProfileRow>(
    `SELECT ${PROFILE_COLUMNS} FROM nelyo_patient.patient_profile
      WHERE person_ref = $1 AND organization_ref = $2`,
    [personRef, organizationRef]
  );
  const row = result.rows[0];
  if (!row) return null;
  return mapProfile(row, await loadIdentifiers(client, row.patient_id));
}

/** Resolve a patient by a medical identifier within an organization. */
export async function findPatientIdByIdentifier(
  client: ClientBase,
  input: { organizationRef: string; system: string; value: string }
): Promise<string | null> {
  const result = await client.query<{ patient_id: string }>(
    `SELECT patient_id FROM nelyo_patient.patient_identifier
      WHERE organization_ref = $1 AND system = $2 AND value = $3`,
    [input.organizationRef, input.system, input.value]
  );
  return result.rows[0]?.patient_id ?? null;
}
