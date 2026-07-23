import type { ClientBase } from "pg";

/**
 * Break-glass repository (roadmap M4.3 — Persisted Emergency Access).
 *
 * Owns SQL for the emergency-access store in nelyo_break_glass. Client-
 * parameterized so callers control the transaction boundary: break-glass
 * mutations run inside the transactional-command path (state + outbox + audit in
 * one transaction).
 *
 * The justification is immutable at the database (trigger) and access-controlled;
 * it is loaded here for the persisted record but never travels in events or audit
 * details. Authorization status (active/expired) is DERIVED from the current row
 * at read time — never cached.
 */

export type BreakGlassStatus = "requested" | "active" | "expired" | "review-completed";
export type BreakGlassReviewOutcome = "approved" | "rejected" | "follow-up-required";

export interface PersistedBreakGlassAccess {
  accessId: string;
  actorRef: string;
  patientRef: string;
  organizationRef: string;
  justification: string;
  status: BreakGlassStatus;
  ttlMinutes: number;
  requestedAt: string;
  expiresAt: string;
  activatedAt?: string;
  complianceNotifiedAt?: string;
  complianceNotificationRef?: string;
  reviewedAt?: string;
  reviewedByActorRef?: string;
  reviewOutcome?: BreakGlassReviewOutcome;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BreakGlassRow {
  access_id: string;
  actor_ref: string;
  patient_ref: string;
  organization_ref: string;
  justification: string;
  status: BreakGlassStatus;
  ttl_minutes: number;
  requested_at: string | Date;
  expires_at: string | Date;
  activated_at: string | Date | null;
  compliance_notified_at: string | Date | null;
  compliance_notification_ref: string | null;
  reviewed_at: string | Date | null;
  reviewed_by_actor_ref: string | null;
  review_outcome: BreakGlassReviewOutcome | null;
  review_notes: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toIsoOrUndefined(value: string | Date | null): string | undefined {
  return value === null ? undefined : toIso(value);
}

function mapAccess(row: BreakGlassRow): PersistedBreakGlassAccess {
  return {
    accessId: row.access_id,
    actorRef: row.actor_ref,
    patientRef: row.patient_ref,
    organizationRef: row.organization_ref,
    justification: row.justification,
    status: row.status,
    ttlMinutes: row.ttl_minutes,
    requestedAt: toIso(row.requested_at),
    expiresAt: toIso(row.expires_at),
    activatedAt: toIsoOrUndefined(row.activated_at),
    complianceNotifiedAt: toIsoOrUndefined(row.compliance_notified_at),
    complianceNotificationRef: row.compliance_notification_ref ?? undefined,
    reviewedAt: toIsoOrUndefined(row.reviewed_at),
    reviewedByActorRef: row.reviewed_by_actor_ref ?? undefined,
    reviewOutcome: row.review_outcome ?? undefined,
    reviewNotes: row.review_notes ?? undefined,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

const BREAK_GLASS_COLUMNS =
  "access_id, actor_ref, patient_ref, organization_ref, justification, status, ttl_minutes, " +
  "requested_at, expires_at, activated_at, compliance_notified_at, compliance_notification_ref, " +
  "reviewed_at, reviewed_by_actor_ref, review_outcome, review_notes, created_at, updated_at";

// ---------- Mutations (run inside the transactional command) ----------

export async function insertBreakGlassAccess(
  client: ClientBase,
  input: {
    accessId: string;
    actorRef: string;
    patientRef: string;
    organizationRef: string;
    justification: string;
    ttlMinutes: number;
    requestedAt: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_break_glass.break_glass_access
       (access_id, actor_ref, patient_ref, organization_ref, justification, status, ttl_minutes,
        requested_at, expires_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, 'requested', $6, $7, $8, $9, $10)`,
    [
      input.accessId,
      input.actorRef,
      input.patientRef,
      input.organizationRef,
      input.justification,
      input.ttlMinutes,
      input.requestedAt,
      input.expiresAt,
      input.createdAt,
      input.updatedAt
    ]
  );
}

export async function activateBreakGlassAccess(
  client: ClientBase,
  input: {
    accessId: string;
    activatedAt: string;
    complianceNotifiedAt: string;
    complianceNotificationRef: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_break_glass.break_glass_access
        SET status = 'active',
            activated_at = $2,
            compliance_notified_at = $3,
            compliance_notification_ref = $4,
            updated_at = $5
      WHERE access_id = $1`,
    [
      input.accessId,
      input.activatedAt,
      input.complianceNotifiedAt,
      input.complianceNotificationRef,
      input.updatedAt
    ]
  );
}

export async function markBreakGlassExpired(
  client: ClientBase,
  input: { accessId: string; updatedAt: string }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_break_glass.break_glass_access
        SET status = 'expired', updated_at = $2
      WHERE access_id = $1`,
    [input.accessId, input.updatedAt]
  );
}

export async function recordBreakGlassReview(
  client: ClientBase,
  input: {
    accessId: string;
    reviewedAt: string;
    reviewedByActorRef: string;
    reviewOutcome: BreakGlassReviewOutcome;
    reviewNotes?: string;
    updatedAt: string;
  }
): Promise<void> {
  await client.query(
    `UPDATE nelyo_break_glass.break_glass_access
        SET status = 'review-completed',
            reviewed_at = $2,
            reviewed_by_actor_ref = $3,
            review_outcome = $4,
            review_notes = $5,
            updated_at = $6
      WHERE access_id = $1`,
    [
      input.accessId,
      input.reviewedAt,
      input.reviewedByActorRef,
      input.reviewOutcome,
      input.reviewNotes ?? null,
      input.updatedAt
    ]
  );
}

// ---------- Reads ----------

export async function loadBreakGlassAccess(
  client: ClientBase,
  accessId: string
): Promise<PersistedBreakGlassAccess | null> {
  const result = await client.query<BreakGlassRow>(
    `SELECT ${BREAK_GLASS_COLUMNS}
       FROM nelyo_break_glass.break_glass_access
      WHERE access_id = $1`,
    [accessId]
  );
  const row = result.rows[0];
  return row ? mapAccess(row) : null;
}

/**
 * Load the most recent ACTIVE break-glass grant for an (actor, patient, org)
 * subject — the candidate emergency override. Expiry is derived by the caller
 * against the current clock, so a row whose window has closed still returns here
 * but yields no override.
 */
export async function loadActiveBreakGlassForSubject(
  client: ClientBase,
  input: { actorRef: string; patientRef: string; organizationRef: string }
): Promise<PersistedBreakGlassAccess | null> {
  const result = await client.query<BreakGlassRow>(
    `SELECT ${BREAK_GLASS_COLUMNS}
       FROM nelyo_break_glass.break_glass_access
      WHERE actor_ref = $1 AND patient_ref = $2 AND organization_ref = $3
        AND status = 'active'
      ORDER BY requested_at DESC
      LIMIT 1`,
    [input.actorRef, input.patientRef, input.organizationRef]
  );
  const row = result.rows[0];
  return row ? mapAccess(row) : null;
}

/**
 * Post-incident review / governance listing: every break-glass grant that
 * touched a patient within an organization, newest first.
 */
export async function listBreakGlassForPatient(
  client: ClientBase,
  input: { patientRef: string; organizationRef: string }
): Promise<PersistedBreakGlassAccess[]> {
  const result = await client.query<BreakGlassRow>(
    `SELECT ${BREAK_GLASS_COLUMNS}
       FROM nelyo_break_glass.break_glass_access
      WHERE patient_ref = $1 AND organization_ref = $2
      ORDER BY requested_at DESC`,
    [input.patientRef, input.organizationRef]
  );
  return result.rows.map(mapAccess);
}
