import type { ClientBase, Pool } from "pg";
import { loadRelationship } from "./relationship-repository.js";
import type { DomainEventConsumer, OutboxEventRecord } from "./transaction-outbox.js";

/**
 * Care Circle read model + projection consumer (roadmap M6.1).
 *
 * A DERIVED projection of the relationship graph: one care_circle_member row per
 * source relationship, denormalized for bidirectional lookup (circle of a
 * patient; wards of an actor). It is maintained by `createCareCircleProjectionConsumer`,
 * a dispatcher subscriber that, on each Relationship* domain event, loads the
 * authoritative relationship and upserts the membership to reflect its CURRENT
 * state (or deletes it if the relationship is gone).
 *
 * This "load-current-state on event" strategy makes the consumer idempotent and
 * order-insensitive under at-least-once redelivery (re-applying re-reads the same
 * authoritative state), satisfying the dispatcher's all-consumers-accept-or-retry
 * contract. Membership effective-ness (expiry) is derived at read time by the api
 * layer — never cached as an authorization decision.
 */

export type CareCircleMembershipStatus = "active" | "revoked" | "expired";

export interface PersistedCareCircleMember {
  relationshipRef: string;
  patientRef: string;
  actorRef: string;
  organizationRef: string;
  relationshipType: string;
  membershipStatus: CareCircleMembershipStatus;
  verificationMethod?: string;
  effectiveDate?: string;
  expiryDate?: string;
  permittedActions: string[];
  projectedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface MemberRow {
  relationship_ref: string;
  patient_ref: string;
  actor_ref: string;
  organization_ref: string;
  relationship_type: string;
  membership_status: CareCircleMembershipStatus;
  verification_method: string | null;
  effective_date: string | Date | null;
  expiry_date: string | Date | null;
  permitted_actions: string[];
  projected_at: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toIsoOrUndefined(value: string | Date | null): string | undefined {
  return value === null ? undefined : toIso(value);
}

const MEMBER_COLUMNS =
  "relationship_ref, patient_ref, actor_ref, organization_ref, relationship_type, " +
  "membership_status, verification_method, effective_date, expiry_date, permitted_actions, " +
  "projected_at, created_at, updated_at";

function mapMember(row: MemberRow): PersistedCareCircleMember {
  return {
    relationshipRef: row.relationship_ref,
    patientRef: row.patient_ref,
    actorRef: row.actor_ref,
    organizationRef: row.organization_ref,
    relationshipType: row.relationship_type,
    membershipStatus: row.membership_status,
    verificationMethod: row.verification_method ?? undefined,
    effectiveDate: toIsoOrUndefined(row.effective_date),
    expiryDate: toIsoOrUndefined(row.expiry_date),
    permittedActions: [...row.permitted_actions],
    projectedAt: toIso(row.projected_at),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

// ---------- Projection mutations (run by the consumer, outside any command TX) ----------

export async function upsertCareCircleMember(
  client: ClientBase | Pool,
  input: {
    relationshipRef: string;
    patientRef: string;
    actorRef: string;
    organizationRef: string;
    relationshipType: string;
    membershipStatus: CareCircleMembershipStatus;
    verificationMethod?: string;
    effectiveDate?: string;
    expiryDate?: string;
    permittedActions: string[];
    lastEventId?: string;
    projectedAt: string;
  }
): Promise<void> {
  await client.query(
    `INSERT INTO nelyo_care_circle.care_circle_member
       (relationship_ref, patient_ref, actor_ref, organization_ref, relationship_type,
        membership_status, verification_method, effective_date, expiry_date, permitted_actions,
        last_event_id, projected_at, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12, $12)
     ON CONFLICT (relationship_ref) DO UPDATE SET
        patient_ref = EXCLUDED.patient_ref,
        actor_ref = EXCLUDED.actor_ref,
        organization_ref = EXCLUDED.organization_ref,
        relationship_type = EXCLUDED.relationship_type,
        membership_status = EXCLUDED.membership_status,
        verification_method = EXCLUDED.verification_method,
        effective_date = EXCLUDED.effective_date,
        expiry_date = EXCLUDED.expiry_date,
        permitted_actions = EXCLUDED.permitted_actions,
        last_event_id = EXCLUDED.last_event_id,
        projected_at = EXCLUDED.projected_at,
        updated_at = EXCLUDED.projected_at`,
    [
      input.relationshipRef,
      input.patientRef,
      input.actorRef,
      input.organizationRef,
      input.relationshipType,
      input.membershipStatus,
      input.verificationMethod ?? null,
      input.effectiveDate ?? null,
      input.expiryDate ?? null,
      input.permittedActions,
      input.lastEventId ?? null,
      input.projectedAt
    ]
  );
}

export async function deleteCareCircleMember(
  client: ClientBase | Pool,
  relationshipRef: string
): Promise<void> {
  await client.query(
    `DELETE FROM nelyo_care_circle.care_circle_member WHERE relationship_ref = $1`,
    [relationshipRef]
  );
}

// ---------- Reads ----------

export async function listCareCircleForPatient(
  client: ClientBase | Pool,
  input: { patientRef: string; organizationRef: string }
): Promise<PersistedCareCircleMember[]> {
  const result = await client.query<MemberRow>(
    `SELECT ${MEMBER_COLUMNS} FROM nelyo_care_circle.care_circle_member
      WHERE patient_ref = $1 AND organization_ref = $2
      ORDER BY relationship_type ASC`,
    [input.patientRef, input.organizationRef]
  );
  return result.rows.map(mapMember);
}

export async function listWardsForActor(
  client: ClientBase | Pool,
  input: { actorRef: string; organizationRef: string }
): Promise<PersistedCareCircleMember[]> {
  const result = await client.query<MemberRow>(
    `SELECT ${MEMBER_COLUMNS} FROM nelyo_care_circle.care_circle_member
      WHERE actor_ref = $1 AND organization_ref = $2
      ORDER BY patient_ref ASC`,
    [input.actorRef, input.organizationRef]
  );
  return result.rows.map(mapMember);
}

// ---------- Projection consumer (dispatcher subscriber) ----------

const RELATIONSHIP_EVENT_TYPES = new Set([
  "RelationshipEstablished",
  "RelationshipVerified",
  "RelationshipRevoked"
]);

/**
 * The dispatcher's Care Circle subscriber (M6.1). On each Relationship* event it
 * loads the authoritative relationship (by aggregateId = relationshipId) and
 * upserts the membership to reflect current state, or deletes it if the
 * relationship is gone. Idempotent by construction (projects current state);
 * no-ops on every other event type.
 */
export function createCareCircleProjectionConsumer(
  pool: Pool
): DomainEventConsumer<Record<string, unknown>> {
  return {
    name: "care-circle-projection",
    consume: async (event: OutboxEventRecord<Record<string, unknown>>) => {
      if (!RELATIONSHIP_EVENT_TYPES.has(event.eventType)) {
        return;
      }
      const client = await pool.connect();
      try {
        const relationship = await loadRelationship(client, event.aggregateId);
        if (!relationship) {
          await deleteCareCircleMember(client, event.aggregateId);
          return;
        }
        await upsertCareCircleMember(client, {
          relationshipRef: relationship.relationshipId,
          patientRef: relationship.patientRef,
          actorRef: relationship.actorRef,
          organizationRef: relationship.organizationRef,
          relationshipType: relationship.relationshipType,
          membershipStatus: relationship.status,
          verificationMethod: relationship.verificationMethod,
          effectiveDate: relationship.effectiveDate,
          expiryDate: relationship.expiryDate,
          permittedActions: relationship.permittedActions,
          lastEventId: event.eventId,
          projectedAt: new Date().toISOString()
        });
      } finally {
        client.release();
      }
    }
  };
}
