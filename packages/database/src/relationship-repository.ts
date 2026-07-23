import type { ClientBase } from "pg";

/**
 * Relationship repository (roadmap M4.2 — Relationship Persistence).
 *
 * Owns SQL for the relationship graph in nelyo_relationship. Client-parameterized
 * so callers control the transaction boundary: relationship mutations run inside
 * the transactional-command path (state + outbox + audit in one transaction).
 *
 * Domain-agnostic by design: relationship type, verification method, status, and
 * permitted actions are carried as bare strings here (the discriminated
 * AuthorizationRelationshipDraft union lives in the apps/api relationship
 * semantics layer, the higher layer). The repository persists and loads; the api
 * layer decides. Authorization status is DERIVED from the current row at read
 * time — never cached here.
 */

export type RelationshipStoredStatus = "active" | "revoked" | "expired";

export interface PersistedRelationship {
  relationshipId: string;
  actorRef: string;
  patientRef: string;
  organizationRef: string;
  relationshipType: string;
  status: RelationshipStoredStatus;
  verificationMethod: string;
  effectiveDate: string;
  expiryDate?: string;
  permittedActions: string[];
  revokedAt?: string;
  revokedByActorRef?: string;
  revocationReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface RelationshipRow {
  relationship_id: string;
  actor_ref: string;
  patient_ref: string;
  organization_ref: string;
  relationship_type: string;
  status: RelationshipStoredStatus;
  verification_method: string;
  effective_date: string | Date;
  expiry_date: string | Date | null;
  permitted_actions: string[];
  revoked_at: string | Date | null;
  revoked_by_actor_ref: string | null;
  revocation_reason: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toIsoOrUndefined(value: string | Date | null): string | undefined {
  return value === null ? undefined : toIso(value);
}

function mapRelationship(row: RelationshipRow): PersistedRelationship {
  return {
    relationshipId: row.relationship_id,
    actorRef: row.actor_ref,
    patientRef: row.patient_ref,
    organizationRef: row.organization_ref,
    relationshipType: row.relationship_type,
    status: row.status,
    verificationMethod: row.verification_method,
    effectiveDate: toIso(row.effective_date),
    expiryDate: toIsoOrUndefined(row.expiry_date),
    permittedActions: [...row.permitted_actions],
    revokedAt: toIsoOrUndefined(row.revoked_at),
    revokedByActorRef: row.revoked_by_actor_ref ?? undefined,
    revocationReason: row.revocation_reason ?? undefined,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

const RELATIONSHIP_COLUMNS =
  "relationship_id, actor_ref, patient_ref, organization_ref, relationship_type, status, " +
  "verification_method, effective_date, expiry_date, permitted_actions, revoked_at, " +
  "revoked_by_actor_ref, revocation_reason, created_at, updated_at";

// ---------- Mutations (run inside the transactional command) ----------

export async function insertRelationship(
  client: ClientBase,
  input: {
    relationshipId: string;
    actorRef: string;
    patientRef: string;
    organizationRef: string;
    relationshipType: string;
    status: RelationshipStoredStatus;
    verificationMethod: string;
    effectiveDate: string;
    expiryDate?: string;
    permittedActions: string[];
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_relationship.relationship
       (relationship_id, actor_ref, patient_ref, organization_ref, relationship_type, status,
        verification_method, effective_date, expiry_date, permitted_actions, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      input.relationshipId,
      input.actorRef,
      input.patientRef,
      input.organizationRef,
      input.relationshipType,
      input.status,
      input.verificationMethod,
      input.effectiveDate,
      input.expiryDate ?? null,
      input.permittedActions,
      input.createdAt,
      input.updatedAt
    ]
  );
}

/**
 * Re-activate an existing relationship: reset the lifecycle window/permissions
 * to a fresh grant and clear any prior revocation. Used when a relationship of
 * the same (actor, patient, organization, type) is established again.
 */
export async function reactivateRelationship(
  client: ClientBase,
  input: {
    relationshipId: string;
    verificationMethod: string;
    effectiveDate: string;
    expiryDate?: string;
    permittedActions: string[];
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_relationship.relationship
        SET status = 'active',
            verification_method = $2,
            effective_date = $3,
            expiry_date = $4,
            permitted_actions = $5,
            revoked_at = NULL,
            revoked_by_actor_ref = NULL,
            revocation_reason = NULL,
            updated_at = $6
      WHERE relationship_id = $1`,
    [
      input.relationshipId,
      input.verificationMethod,
      input.effectiveDate,
      input.expiryDate ?? null,
      input.permittedActions,
      input.updatedAt
    ]
  );
}

export async function setRelationshipVerificationMethod(
  client: ClientBase,
  input: { relationshipId: string; verificationMethod: string; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_relationship.relationship
        SET verification_method = $2, updated_at = $3
      WHERE relationship_id = $1`,
    [input.relationshipId, input.verificationMethod, input.updatedAt]
  );
}

export async function markRelationshipRevoked(
  client: ClientBase,
  input: {
    relationshipId: string;
    revokedAt: string;
    revokedByActorRef: string;
    revocationReason: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_relationship.relationship
        SET status = 'revoked',
            revoked_at = $2,
            revoked_by_actor_ref = $3,
            revocation_reason = $4,
            updated_at = $5
      WHERE relationship_id = $1`,
    [
      input.relationshipId,
      input.revokedAt,
      input.revokedByActorRef,
      input.revocationReason,
      input.updatedAt
    ]
  );
}

// ---------- Reads ----------

export async function loadRelationship(
  client: ClientBase,
  relationshipId: string
): Promise<PersistedRelationship | null> {
  const result = await client.query<RelationshipRow>(
    `SELECT ${RELATIONSHIP_COLUMNS}
       FROM nelyo_relationship.relationship
      WHERE relationship_id = $1`,
    [relationshipId]
  );
  const row = result.rows[0];
  return row ? mapRelationship(row) : null;
}

/**
 * Load a specific relationship type between an actor and a patient within an
 * organization — the authorization decision subject's governing relationship.
 */
export async function loadRelationshipForSubject(
  client: ClientBase,
  input: {
    actorRef: string;
    patientRef: string;
    organizationRef: string;
    relationshipType: string;
  }
): Promise<PersistedRelationship | null> {
  const result = await client.query<RelationshipRow>(
    `SELECT ${RELATIONSHIP_COLUMNS}
       FROM nelyo_relationship.relationship
      WHERE actor_ref = $1 AND patient_ref = $2 AND organization_ref = $3
        AND relationship_type = $4`,
    [input.actorRef, input.patientRef, input.organizationRef, input.relationshipType]
  );
  const row = result.rows[0];
  return row ? mapRelationship(row) : null;
}

/** List every relationship an actor holds over a patient within an organization. */
export async function listRelationshipsForActorPatient(
  client: ClientBase,
  input: { actorRef: string; patientRef: string; organizationRef: string }
): Promise<PersistedRelationship[]> {
  const result = await client.query<RelationshipRow>(
    `SELECT ${RELATIONSHIP_COLUMNS}
       FROM nelyo_relationship.relationship
      WHERE actor_ref = $1 AND patient_ref = $2 AND organization_ref = $3
      ORDER BY relationship_type ASC`,
    [input.actorRef, input.patientRef, input.organizationRef]
  );
  return result.rows.map(mapRelationship);
}
