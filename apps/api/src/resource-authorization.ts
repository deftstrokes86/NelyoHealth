import type { Pool, PoolClient } from "pg";
import {
  loadActiveBreakGlassForSubject,
  loadConsentRecordByPatientOrg,
  loadRelationshipForSubject,
  type PersistedBreakGlassAccess,
  type PersistedConsentRecord,
  type PersistedRelationship
} from "@nelyohealth/database";
import type { ConsentDomain } from "./granular-consent.js";
import { derivePersistedConsentStatus, mapPersistedConsentToDraft } from "./consent-service.js";
import { mapPersistedRelationshipToDraft } from "./relationship-service.js";
import { deriveBreakGlassOverride } from "./break-glass-service.js";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import type {
  AuthorizationActorRole,
  AuthorizationPolicyDecisionDraft,
  AuthorizationPolicyDecisionDraftInput,
  EmergencyStatus,
  RelationshipType,
  SessionStatus
} from "./authorization-policy.js";

/**
 * Shared resource access governance (roadmap M5.x — Core Resource Platform).
 *
 * Every core resource (patient profiles M5.1, appointments M5.2, and the
 * clinical resources that follow) is governed by the SAME composed pipeline:
 * load the three persisted access-control dimensions — consent (M4.1), the
 * relationship graph (M4.2), and break-glass (M4.3) — and overlay them onto a
 * single Policy Decision Point evaluation for the requested resource + action.
 *
 * This module is that composition, factored out so each resource service uses
 * one implementation rather than a per-resource copy. Each dimension is read
 * live (derive-don't-persist), so a consent withdrawal, a relationship
 * revocation, or a break-glass expiry propagates to the very next decision. The
 * resource services keep the decide-BEFORE-load discipline: decide with this,
 * then load resource data only on an allow.
 */

export interface ResourceAccessRequest {
  decisionRequestId: string;
  actorId: string;
  actorRole: AuthorizationActorRole;
  actorType: AuthorizationPolicyDecisionDraftInput["actorType"];
  /** The patient whose data governs consent / relationship / break-glass. */
  patientId: string;
  organizationId: string;
  requestedResource: string;
  requestedAction: string;
  purpose: string;
  requiresRelationship: boolean;
  /** Which relationship type governs this access ("none" for self-access). */
  relationshipType: string;
  requestedConsentDomains: ConsentDomain[];
  sessionStatus: SessionStatus;
  sameTenant: boolean;
  emergencyStatus: EmergencyStatus;
  activeEncounter: boolean;
  evaluatedAt: string;
}

export interface ResolvedAuthorizationInputs {
  consent: PersistedConsentRecord | null;
  relationship: PersistedRelationship | null;
  breakGlass: PersistedBreakGlassAccess | null;
}

/**
 * Compose the three persisted dimensions into a single PDP evaluation. Pure:
 * takes the already-loaded records so the composition is unit-testable without a
 * database.
 */
export function composeResourceAccessDecision(
  request: ResourceAccessRequest,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  const consent = resolved.consent ? mapPersistedConsentToDraft(resolved.consent) : undefined;
  const consentStatus = resolved.consent
    ? derivePersistedConsentStatus(resolved.consent)
    : "revoked";
  const relationship = resolved.relationship
    ? mapPersistedRelationshipToDraft(resolved.relationship)
    : undefined;
  const relationshipType: RelationshipType = resolved.relationship
    ? (resolved.relationship.relationshipType as RelationshipType)
    : "none";
  const relationshipStatus = resolved.relationship ? resolved.relationship.status : "none";
  const override = deriveBreakGlassOverride(resolved.breakGlass, Date.parse(request.evaluatedAt));

  return evaluateAuthorizationPolicyDecision({
    decisionRequestId: request.decisionRequestId,
    actorId: request.actorId,
    actorRole: request.actorRole,
    actorType: request.actorType,
    organizationId: request.organizationId,
    patientId: request.patientId,
    relationshipType,
    relationship,
    relationshipStatus,
    requestedConsentDomains: request.requestedConsentDomains,
    consent,
    consentStatus,
    requestedResource: request.requestedResource,
    requestedAction: request.requestedAction,
    purpose: request.purpose,
    sessionStatus: request.sessionStatus,
    activeEncounter: request.activeEncounter,
    emergencyStatus: request.emergencyStatus,
    sameTenant: request.sameTenant,
    sponsorPaymentOnly: false,
    requiresRelationship: request.requiresRelationship,
    breakGlassRequested: override.breakGlassRequested,
    breakGlassReason: override.breakGlassReason,
    breakGlassWindowMinutes: override.breakGlassWindowMinutes,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt: request.evaluatedAt
  });
}

/** Load the three persisted dimensions for a decision subject. */
export async function resolveAuthorizationInputs(
  pool: Pool,
  request: ResourceAccessRequest
): Promise<ResolvedAuthorizationInputs> {
  const [consent, relationship, breakGlass] = await Promise.all([
    withClient(pool, (client) =>
      loadConsentRecordByPatientOrg(client, request.patientId, request.organizationId)
    ),
    request.requiresRelationship
      ? withClient(pool, (client) =>
          loadRelationshipForSubject(client, {
            actorRef: request.actorId,
            patientRef: request.patientId,
            organizationRef: request.organizationId,
            relationshipType: request.relationshipType
          })
        )
      : Promise.resolve(null),
    withClient(pool, (client) =>
      loadActiveBreakGlassForSubject(client, {
        actorRef: request.actorId,
        patientRef: request.patientId,
        organizationRef: request.organizationId
      })
    )
  ]);
  return { consent, relationship, breakGlass };
}

/** Load the three persisted dimensions and decide in one call. */
export async function resolveAndDecideResourceAccess(
  pool: Pool,
  request: ResourceAccessRequest
): Promise<AuthorizationPolicyDecisionDraft> {
  return composeResourceAccessDecision(request, await resolveAuthorizationInputs(pool, request));
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
