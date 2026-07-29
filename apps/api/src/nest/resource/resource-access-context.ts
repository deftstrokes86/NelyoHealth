import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import {
  listActiveRelationshipsForActorPatient,
  type PersistedRelationship
} from "@nelyohealth/database";
import type { ActingContext } from "../../acting-context-resolver.js";
import type { ConsentDomain } from "../../granular-consent.js";
import type { ResourceAccessRequest } from "../../resource-authorization.js";
import type { AuthorizationActorRole } from "../../authorization-policy.js";

/**
 * The trust seam (roadmap M7, ADR-0014).
 *
 * Maps the guard-resolved ActingContext -> a resource access context for the domain
 * services. The discipline: identity / persona / workspace / session facts are
 * SERVER-DERIVED here and NEVER accepted from the client; only the request INTENT
 * (which subject patient, which purpose) comes from the request, and each intent is
 * itself gated downstream. In particular "self" — is the actor the data subject — is
 * computed here from the server-resolved identity link (personId === subject), never
 * by trusting a client-supplied patient ref.
 */

type AccessActorType = ResourceAccessRequest["actorType"];

/** The subject/action-independent access context the domain services consume. */
export type ResourceAccessContext = Omit<
  ResourceAccessRequest,
  "requestedResource" | "requestedAction"
>;

export interface ResourceAccessResolution {
  access: ResourceAccessContext;
  /** The actor's server-resolved data-subject identity (person ref). */
  subjectPersonRef: string;
  /** Server-derived: the actor IS the subject patient. Never a client claim. */
  subjectIsSelf: boolean;
  /**
   * For a DELEGATED (cross-patient) access: the relationship that granted the
   * derived capacity + the actorRole it mapped to. Recorded in the access decision's
   * audit so a caregiver's access can later be traced to the capacity it ran under
   * (ADR-0014, M7.2). Null for self / org / no-capacity.
   */
  selectedRelationshipRef?: string | null;
  derivedActorRole?: string | null;
}

export interface ResourceAccessIntent {
  /** The subject patient (a path param, or the caller's own person for /me routes). */
  subjectPatientRef: string;
  purpose: string;
  requestedConsentDomains?: ConsentDomain[];
  requiresRelationship?: boolean;
  relationshipType?: string;
  now?: () => Date;
}

/** Personal workspace is always the patient persona; org maps its validated role. */
function mapActorRole(actingContext: ActingContext): AuthorizationActorRole {
  if (actingContext.workspace === "personal") {
    return "patient";
  }
  const known: AuthorizationActorRole[] = [
    "patient",
    "guardian",
    "sponsor",
    "caregiver",
    "clinician",
    "support",
    "organization-admin",
    "platform-admin",
    "payer",
    "employer",
    "hmo"
  ];
  const role = actingContext.persona.actorRole;
  // Unknown org roles get the least-privileged mapping (no resource read rules ->
  // default-deny) rather than an accidental grant.
  return known.includes(role as AuthorizationActorRole)
    ? (role as AuthorizationActorRole)
    : "support";
}

function mapActorType(actingContext: ActingContext): AccessActorType {
  if (actingContext.workspace === "personal") {
    return "patient";
  }
  const role = actingContext.persona.actorRole;
  if (role === "clinician") return "clinician";
  if (role === "caregiver") return "caregiver";
  if (role === "guardian") return "guardian";
  if (role === "sponsor") return "sponsor";
  if (role.includes("admin")) return "admin";
  return "support";
}

export function buildResourceAccessContext(
  actingContext: ActingContext,
  intent: ResourceAccessIntent
): ResourceAccessResolution {
  const evaluatedAt = (intent.now?.() ?? new Date()).toISOString();
  const subjectPersonRef = actingContext.identity.personId;
  // Server-derived self: the equality is against the resolved identity link, never a
  // client-supplied ref compared to itself.
  const subjectIsSelf = intent.subjectPatientRef === subjectPersonRef;

  const access: ResourceAccessContext = {
    decisionRequestId: randomUUID(),
    actorId: actingContext.identity.accountId,
    actorRole: mapActorRole(actingContext),
    actorType: mapActorType(actingContext),
    patientId: intent.subjectPatientRef,
    // Personal workspace has no tenant; self-access does not consult org anyway. For a
    // third-party org actor the active tenant scopes the consent/relationship lookup.
    organizationId: actingContext.activeTenantId ?? subjectPersonRef,
    purpose: intent.purpose,
    requiresRelationship: intent.requiresRelationship ?? false,
    relationshipType: intent.relationshipType ?? "none",
    requestedConsentDomains: intent.requestedConsentDomains ?? [],
    sessionStatus: actingContext.sessionStatus,
    sameTenant: true,
    // Break-glass is a separate, audited flow — never asserted from a request header.
    emergencyStatus: "none",
    activeEncounter: false,
    evaluatedAt
  };

  return { access, subjectPersonRef, subjectIsSelf };
}

// ---------- Cross-patient capacity resolution (roadmap M7.2, ADR-0014) ----------

/**
 * Which relationship types confer a routine, cross-patient capability, and the
 * actor capacity each maps to. DELIBERATELY SMALL (default-deny for the rest):
 *  - guardian, caregiver-delegation are mapped (they have per-domain read rules);
 *  - sponsor is DEFERRED to the billing/payment slice — its scope is financial-only
 *    (billing-ledger / payment-status) and belongs designed with those surfaces, not
 *    inherited here (it has no timeline/care-circle capability anyway);
 *  - household / emergency-contact / clinical-proxy are excluded until modelled
 *    (emergency-contact is break-glass territory, not routine access).
 * `priority` orders capacity when an actor holds several active relationships to the
 * same patient — guardian outranks caregiver.
 */
const RELATIONSHIP_CAPACITY: Record<
  string,
  { actorRole: AuthorizationActorRole; actorType: AccessActorType; priority: number }
> = {
  guardian: { actorRole: "guardian", actorType: "guardian", priority: 0 },
  "caregiver-delegation": { actorRole: "caregiver", actorType: "caregiver", priority: 1 }
};

export interface DerivedCapacity {
  relationshipRef: string;
  actorRole: AuthorizationActorRole;
  actorType: AccessActorType;
  relationshipType: string;
  organizationRef: string;
}

function isEffective(relationship: PersistedRelationship, nowMs: number): boolean {
  const effectiveOk =
    !relationship.effectiveDate || Date.parse(relationship.effectiveDate) <= nowMs;
  const notExpired = !relationship.expiryDate || Date.parse(relationship.expiryDate) > nowMs;
  return effectiveOk && notExpired;
}

/**
 * Pure capacity selection (unit-testable, no DB). From an actor's active relationships
 * to a patient, pick ONE deterministically: highest-priority tier first
 * (guardian > caregiver); within a tier, **most-recently-effective wins** (the
 * multi-org tie-break — two caregiver delegations at different facilities resolve to
 * exactly one, and thus one consent scope); `relationshipId` is the final stable
 * tie-break. Relationships whose type is unmapped are skipped (default-deny).
 */
export function selectCapacityFromRelationships(
  relationships: PersistedRelationship[],
  nowMs: number
): DerivedCapacity | null {
  const candidates = relationships
    .filter((relationship) => relationship.status === "active" && isEffective(relationship, nowMs))
    .map((relationship) => ({
      relationship,
      capacity: RELATIONSHIP_CAPACITY[relationship.relationshipType]
    }))
    .filter((entry) => entry.capacity !== undefined);

  if (candidates.length === 0) {
    return null;
  }
  candidates.sort((a, b) => {
    if (a.capacity.priority !== b.capacity.priority) {
      return a.capacity.priority - b.capacity.priority; // higher tier (lower number) first
    }
    const aEffective = Date.parse(a.relationship.effectiveDate ?? "") || 0;
    const bEffective = Date.parse(b.relationship.effectiveDate ?? "") || 0;
    if (aEffective !== bEffective) {
      return bEffective - aEffective; // most-recently-effective first
    }
    return a.relationship.relationshipId.localeCompare(b.relationship.relationshipId);
  });
  const best = candidates[0];
  return {
    relationshipRef: best.relationship.relationshipId,
    actorRole: best.capacity.actorRole,
    actorType: best.capacity.actorType,
    relationshipType: best.relationship.relationshipType,
    organizationRef: best.relationship.organizationRef
  };
}

export interface CapacityResolverPorts {
  listActiveRelationshipsForActorPatient(input: {
    actorRef: string;
    patientRef: string;
  }): Promise<PersistedRelationship[]>;
}

/** Production ports: the authoritative relationship graph, over a pooled client. */
export function createCapacityResolverPorts(pool: Pool): CapacityResolverPorts {
  return {
    listActiveRelationshipsForActorPatient: async (input) => {
      const client = await pool.connect();
      try {
        return await listActiveRelationshipsForActorPatient(client, input);
      } finally {
        client.release();
      }
    }
  };
}

/**
 * Resolve the access context including CROSS-PATIENT capacity (M7.2). Self and org
 * paths are unchanged (sync mapping). For a personal-workspace, non-self subject the
 * capacity is derived from the AUTHORITATIVE relationship graph (never the
 * care-circle projection, which is forbidden as an authz input): the derived
 * actorRole + relationshipType + the relationship's org are fed to the UNCHANGED
 * pipeline, which then re-loads the relationship live for the decision. No capacity
 * ⇒ a non-privileged context the pipeline denies ⇒ a uniform 404, indistinguishable
 * from a non-existent subject (a stranger learns nothing).
 */
export async function resolveResourceAccessContext(
  ports: CapacityResolverPorts,
  actingContext: ActingContext,
  intent: ResourceAccessIntent
): Promise<ResourceAccessResolution> {
  const base = buildResourceAccessContext(actingContext, intent);
  if (base.subjectIsSelf || actingContext.workspace === "organization") {
    return base;
  }

  const nowMs = (intent.now?.() ?? new Date()).getTime();
  const relationships = await ports.listActiveRelationshipsForActorPatient({
    actorRef: actingContext.identity.accountId,
    patientRef: intent.subjectPatientRef
  });
  const capacity = selectCapacityFromRelationships(relationships, nowMs);

  if (!capacity) {
    // No routine capacity toward this subject — present a non-privileged context so
    // the pipeline denies (the patient self-rule fails for a non-self subject).
    return {
      access: { ...base.access, requiresRelationship: true, relationshipType: "none" },
      subjectPersonRef: base.subjectPersonRef,
      subjectIsSelf: false,
      selectedRelationshipRef: null,
      derivedActorRole: null
    };
  }
  return {
    access: {
      ...base.access,
      actorRole: capacity.actorRole,
      actorType: capacity.actorType,
      organizationId: capacity.organizationRef,
      requiresRelationship: true,
      relationshipType: capacity.relationshipType
    },
    subjectPersonRef: base.subjectPersonRef,
    subjectIsSelf: false,
    selectedRelationshipRef: capacity.relationshipRef,
    derivedActorRole: capacity.actorRole
  };
}
