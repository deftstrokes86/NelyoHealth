import { randomUUID } from "node:crypto";
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
