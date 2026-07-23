import type { ClientBase } from "pg";

/**
 * Consent repository (roadmap M4.1 — Consent Persistence).
 *
 * Owns SQL for the consent tables in nelyo_consent. Client-parameterized so
 * callers control the transaction boundary: consent mutations run inside the
 * transactional-command path (state + outbox + audit in one transaction).
 *
 * Domain-agnostic by design: consent categories are carried as bare strings
 * here (the ConsentDomain union lives in the apps/api consent semantics layer,
 * which is the higher layer). The repository persists and loads; it does not
 * decide. Authorization status is DERIVED from the current version at read
 * time by the api layer — never cached here.
 */

export type ConsentVersionStatus = "granted" | "revoked" | "expired";

export interface PersistedConsentVersion {
  version: number;
  status: ConsentVersionStatus;
  grantedDomains: string[];
  effectiveDate: string;
  expiryDate?: string;
  revokedAt?: string;
  revokedByActorRef?: string;
  revocationReason?: string;
  supersededByVersion?: number;
  createdAt: string;
  createdByActorRef: string;
}

export interface PersistedConsentRecord {
  consentId: string;
  patientRef: string;
  organizationRef: string;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  /** Full version history, oldest first. */
  versions: PersistedConsentVersion[];
}

interface ConsentRecordRow {
  consent_id: string;
  patient_ref: string;
  organization_ref: string;
  current_version: number;
  created_at: string | Date;
  updated_at: string | Date;
}

interface ConsentVersionRow {
  consent_id: string;
  version: number;
  status: ConsentVersionStatus;
  granted_domains: string[];
  effective_date: string | Date;
  expiry_date: string | Date | null;
  revoked_at: string | Date | null;
  revoked_by_actor_ref: string | null;
  revocation_reason: string | null;
  superseded_by_version: number | null;
  created_at: string | Date;
  created_by_actor_ref: string;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toIsoOrUndefined(value: string | Date | null): string | undefined {
  return value === null ? undefined : toIso(value);
}

function mapVersion(row: ConsentVersionRow): PersistedConsentVersion {
  return {
    version: row.version,
    status: row.status,
    grantedDomains: [...row.granted_domains],
    effectiveDate: toIso(row.effective_date),
    expiryDate: toIsoOrUndefined(row.expiry_date),
    revokedAt: toIsoOrUndefined(row.revoked_at),
    revokedByActorRef: row.revoked_by_actor_ref ?? undefined,
    revocationReason: row.revocation_reason ?? undefined,
    supersededByVersion: row.superseded_by_version ?? undefined,
    createdAt: toIso(row.created_at),
    createdByActorRef: row.created_by_actor_ref
  };
}

// ---------- Mutations (run inside the transactional command) ----------

export async function insertConsentRecord(
  client: ClientBase,
  input: {
    consentId: string;
    patientRef: string;
    organizationRef: string;
    currentVersion: number;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_consent.consent_record
       (consent_id, patient_ref, organization_ref, current_version, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      input.consentId,
      input.patientRef,
      input.organizationRef,
      input.currentVersion,
      input.createdAt,
      input.updatedAt
    ]
  );
}

export async function insertConsentVersion(
  client: ClientBase,
  input: {
    consentId: string;
    version: number;
    status: ConsentVersionStatus;
    grantedDomains: string[];
    effectiveDate: string;
    expiryDate?: string;
    createdAt: string;
    createdByActorRef: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_consent.consent_version
       (consent_id, version, status, granted_domains, effective_date, expiry_date,
        created_at, created_by_actor_ref)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      input.consentId,
      input.version,
      input.status,
      input.grantedDomains,
      input.effectiveDate,
      input.expiryDate ?? null,
      input.createdAt,
      input.createdByActorRef
    ]
  );
}

export async function markConsentVersionSuperseded(
  client: ClientBase,
  input: { consentId: string; version: number; supersededByVersion: number }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_consent.consent_version
        SET superseded_by_version = $3
      WHERE consent_id = $1 AND version = $2`,
    [input.consentId, input.version, input.supersededByVersion]
  );
}

export async function setConsentRecordCurrentVersion(
  client: ClientBase,
  input: { consentId: string; currentVersion: number; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_consent.consent_record
        SET current_version = $2, updated_at = $3
      WHERE consent_id = $1`,
    [input.consentId, input.currentVersion, input.updatedAt]
  );
}

export async function markConsentVersionRevoked(
  client: ClientBase,
  input: {
    consentId: string;
    version: number;
    revokedAt: string;
    revokedByActorRef: string;
    revocationReason: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_consent.consent_version
        SET status = 'revoked',
            revoked_at = $3,
            revoked_by_actor_ref = $4,
            revocation_reason = $5
      WHERE consent_id = $1 AND version = $2`,
    [
      input.consentId,
      input.version,
      input.revokedAt,
      input.revokedByActorRef,
      input.revocationReason
    ]
  );
  await client.query(
    `UPDATE nelyo_consent.consent_record
        SET updated_at = $2
      WHERE consent_id = $1`,
    [input.consentId, input.updatedAt]
  );
}

// ---------- Reads ----------

async function loadVersions(
  client: ClientBase,
  consentId: string
): Promise<PersistedConsentVersion[]> {
  const versions = await client.query<ConsentVersionRow>(
    `SELECT consent_id, version, status, granted_domains, effective_date, expiry_date,
            revoked_at, revoked_by_actor_ref, revocation_reason, superseded_by_version,
            created_at, created_by_actor_ref
       FROM nelyo_consent.consent_version
      WHERE consent_id = $1
      ORDER BY version ASC`,
    [consentId]
  );
  return versions.rows.map(mapVersion);
}

function mapRecord(
  row: ConsentRecordRow,
  versions: PersistedConsentVersion[]
): PersistedConsentRecord {
  return {
    consentId: row.consent_id,
    patientRef: row.patient_ref,
    organizationRef: row.organization_ref,
    currentVersion: row.current_version,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    versions
  };
}

export async function loadConsentRecord(
  client: ClientBase,
  consentId: string
): Promise<PersistedConsentRecord | null> {
  const record = await client.query<ConsentRecordRow>(
    `SELECT consent_id, patient_ref, organization_ref, current_version, created_at, updated_at
       FROM nelyo_consent.consent_record
      WHERE consent_id = $1`,
    [consentId]
  );
  const row = record.rows[0];
  if (!row) return null;
  return mapRecord(row, await loadVersions(client, consentId));
}

export async function loadConsentRecordByPatientOrg(
  client: ClientBase,
  patientRef: string,
  organizationRef: string
): Promise<PersistedConsentRecord | null> {
  const record = await client.query<ConsentRecordRow>(
    `SELECT consent_id, patient_ref, organization_ref, current_version, created_at, updated_at
       FROM nelyo_consent.consent_record
      WHERE patient_ref = $1 AND organization_ref = $2`,
    [patientRef, organizationRef]
  );
  const row = record.rows[0];
  if (!row) return null;
  return mapRecord(row, await loadVersions(client, row.consent_id));
}
