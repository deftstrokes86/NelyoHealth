import type { Pool, PoolClient } from "pg";
import {
  listCareCircleForPatient,
  listWardsForActor,
  type PersistedCareCircleMember
} from "@nelyohealth/database";
import {
  composeResourceAccessDecision,
  resolveAndDecideResourceAccess,
  type ResolvedAuthorizationInputs,
  type ResourceAccessRequest
} from "./resource-authorization.js";
import type { AuthorizationPolicyDecisionDraft } from "./authorization-policy.js";

/**
 * Care Circle read service (roadmap M6.1).
 *
 * Reads the derived Care Circle read model (a projection of the relationship
 * graph maintained by the dispatcher's care-circle consumer). Two views:
 *
 *  - readPatientCareCircle: "who is in patient P's circle" — reveals the patient's
 *    relationship graph (SENSITIVE-PERSONAL-DATA), so it flows through the SAME
 *    composed pipeline (consent + ReBAC + break-glass) as every resource, with the
 *    decide-BEFORE-load discipline. Membership effective-ness (status + expiry) is
 *    DERIVED at read time (derive-don't-persist), so a revocation projected by the
 *    consumer, or an expiry that has passed, drops a member from the current view.
 *
 *  - listMyWards: "which patients can I act for" — the actor's OWN memberships
 *    (relationship-existence data about themselves, not any patient's clinical
 *    data). Self-scoped: the caller supplies their authenticated actor id.
 *
 * No PHI: the read model carries relationship references + capability labels only.
 */

const CARE_CIRCLE_RESOURCE = "care-circle";

export type CareCircleAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface CareCircleServiceDeps {
  pool: Pool;
}

export function createPgCareCircleServiceDeps(pool: Pool): CareCircleServiceDeps {
  return { pool };
}

function isCurrentlyEffective(member: PersistedCareCircleMember, nowMs: number): boolean {
  if (member.membershipStatus !== "active") {
    return false;
  }
  if (member.expiryDate && !Number.isNaN(nowMs) && Date.parse(member.expiryDate) <= nowMs) {
    return false;
  }
  return true;
}

export type ReadPatientCareCircleOutcome =
  | {
      status: "allowed";
      members: PersistedCareCircleMember[];
      decision: AuthorizationPolicyDecisionDraft;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a patient's care circle through the full pipeline. The decision is made
 * BEFORE the read model is queried; only currently-effective members (active and
 * unexpired at the decision clock) are returned.
 */
export async function readPatientCareCircle(
  deps: CareCircleServiceDeps,
  input: { access: CareCircleAccessContext }
): Promise<ReadPatientCareCircleOutcome> {
  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: CARE_CIRCLE_RESOURCE,
    requestedAction: "read"
  });
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const members = await withClient(deps.pool, (client) =>
    listCareCircleForPatient(client, {
      patientRef: input.access.patientId,
      organizationRef: input.access.organizationId
    })
  );
  const nowMs = Date.parse(input.access.evaluatedAt);
  return {
    status: "allowed",
    members: members.filter((member) => isCurrentlyEffective(member, nowMs)),
    decision
  };
}

/**
 * List the patients an actor can currently act for (their wards). Self-scoped:
 * the caller must pass their own authenticated actor id (enforced upstream by the
 * session / PEP layer). Returns only currently-effective memberships.
 */
export async function listMyWards(
  deps: CareCircleServiceDeps,
  input: { actorRef: string; organizationRef: string; now?: () => Date }
): Promise<PersistedCareCircleMember[]> {
  const wards = await withClient(deps.pool, (client) =>
    listWardsForActor(client, {
      actorRef: input.actorRef,
      organizationRef: input.organizationRef
    })
  );
  const nowMs = (input.now?.() ?? new Date()).getTime();
  return wards.filter((ward) => isCurrentlyEffective(ward, nowMs));
}

/** Pure composition entry point for unit tests (no database). */
export function decideCareCircleAccessFrom(
  access: CareCircleAccessContext,
  requestedAction: string,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...access, requestedResource: CARE_CIRCLE_RESOURCE, requestedAction },
    resolved
  );
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
