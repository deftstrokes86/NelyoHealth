import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  findPatientIdByIdentifier,
  insertPatientIdentifier,
  insertPatientProfile,
  loadActiveBreakGlassForSubject,
  loadConsentRecordByPatientOrg,
  loadPatientProfile,
  loadPatientProfileByPersonOrg,
  loadRelationshipForSubject,
  runTransactionalCommand,
  updatePatientProfileDemographics,
  type AuditSink,
  type CommandActor,
  type PatientBiologicalSex,
  type PatientContactPoint,
  type PatientEmergencyContact,
  type PatientIdentifier,
  type PatientProfileStatus,
  type PersistedBreakGlassAccess,
  type PersistedConsentRecord,
  type PersistedPatientProfile,
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
 * Patient-profile service (roadmap M5.1 — Core Resource Platform: Patient Profiles).
 *
 * The authoritative Patient resource. Two responsibilities:
 *
 *  1. Profile lifecycle commands. Create and update run as transactional
 *     commands: the profile state change, the canonical PatientProfileCreated /
 *     PatientProfileUpdated event, and the audit intent all commit together or
 *     not at all (M3 pattern). The identity master (name + DOB) is referenced by
 *     person_ref, never duplicated; demographics, contact values, and identifier
 *     values never leave the server in an event or audit detail.
 *
 *  2. Full-pipeline access governance. Every profile read composes ALL THREE
 *     M4 access-control dimensions — persisted consent (M4.1), the persisted
 *     relationship graph (M4.2), and persisted break-glass (M4.3) — into a single
 *     Policy Decision Point evaluation. Each dimension is read live, so a consent
 *     withdrawal, a relationship revocation, or a break-glass expiry propagates to
 *     the very next profile read. A denied decision never loads profile data.
 */

const DEFAULT_STATUS: PatientProfileStatus = "active";

export interface PatientProfileSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

export interface PatientProfileServiceDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  auditSink: AuditSink<PoolClient>;
  externalCallPolicy: ExternalCallPolicy;
}

export function createPgPatientProfileServiceDeps(pool: Pool): PatientProfileServiceDeps {
  return {
    pool,
    transaction: new PgTransactionAdapter(pool),
    outbox: new PgOutboxStore<Record<string, unknown>>(pool),
    auditSink: new PgAuditSink(),
    externalCallPolicy: new ExternalCallPolicy()
  };
}

// ---------- Create ----------

export interface CreatePatientProfileInput {
  personRef: string;
  organizationRef: string;
  status?: PatientProfileStatus;
  preferredName?: string;
  biologicalSex?: PatientBiologicalSex;
  genderIdentity?: string;
  preferredLanguage?: string;
  contactPoints?: PatientContactPoint[];
  emergencyContacts?: PatientEmergencyContact[];
  identifiers?: PatientIdentifier[];
  actor: CommandActor;
  safeContext: PatientProfileSafeContext;
  now?: () => Date;
}

export type CreatePatientProfileOutcome =
  | { status: "created"; patientId: string }
  | { status: "rejected"; reasonCode: "profile-exists" | "duplicate-identifier" };

/**
 * Create the authoritative patient profile for a person within an organization.
 * A duplicate (person, org) profile or a medical identifier already owned by
 * another patient is rejected. Emits PatientProfileCreated (references only) iff
 * the create commits.
 */
export async function createPatientProfile(
  deps: PatientProfileServiceDeps,
  input: CreatePatientProfileInput
): Promise<CreatePatientProfileOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const identifiers = input.identifiers ?? [];

  const existing = await withClient(deps.pool, (client) =>
    loadPatientProfileByPersonOrg(client, input.personRef, input.organizationRef)
  );
  if (existing) {
    return { status: "rejected", reasonCode: "profile-exists" };
  }
  for (const identifier of identifiers) {
    const owner = await withClient(deps.pool, (client) =>
      findPatientIdByIdentifier(client, {
        organizationRef: input.organizationRef,
        system: identifier.system,
        value: identifier.value
      })
    );
    if (owner !== null) {
      return { status: "rejected", reasonCode: "duplicate-identifier" };
    }
  }

  const patientId = randomUUID();
  const status = input.status ?? DEFAULT_STATUS;
  const contactPoints = input.contactPoints ?? [];
  const emergencyContacts = input.emergencyContacts ?? [];

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "patient.profile.create",
      aggregateId: patientId,
      action: "create",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      await insertPatientProfile(ctx.client, {
        patientId,
        personRef: input.personRef,
        organizationRef: input.organizationRef,
        status,
        preferredName: input.preferredName,
        biologicalSex: input.biologicalSex,
        genderIdentity: input.genderIdentity,
        preferredLanguage: input.preferredLanguage,
        contactPoints,
        emergencyContacts,
        createdAt: nowIso,
        updatedAt: nowIso
      });
      for (const identifier of identifiers) {
        await insertPatientIdentifier(ctx.client, {
          patientId,
          organizationRef: input.organizationRef,
          system: identifier.system,
          value: identifier.value,
          assigningAuthority: identifier.assigningAuthority,
          createdAt: nowIso
        });
      }
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "PatientProfileCreated",
          aggregateId: patientId,
          safeContext: input.safeContext,
          payload: {
            patientProfileRef: patientId,
            personRef: input.personRef,
            organizationRef: input.organizationRef,
            status,
            identifierCount: identifiers.length
          }
        })
      );
      return {
        result: { status: "created" as const, patientId },
        audit: {
          outcome: "committed",
          safeDetails: {
            patientProfileRef: patientId,
            personRef: input.personRef,
            organizationRef: input.organizationRef,
            identifierCount: identifiers.length
          }
        }
      };
    }
  });

  return result;
}

// ---------- Update ----------

export interface UpdatePatientProfileInput {
  patientId: string;
  status?: PatientProfileStatus;
  preferredName?: string;
  biologicalSex?: PatientBiologicalSex;
  genderIdentity?: string;
  preferredLanguage?: string;
  contactPoints?: PatientContactPoint[];
  emergencyContacts?: PatientEmergencyContact[];
  actor: CommandActor;
  safeContext: PatientProfileSafeContext;
  now?: () => Date;
}

export type UpdatePatientProfileOutcome =
  | { status: "updated"; patientId: string }
  | { status: "not-found" };

/**
 * Update a patient profile's care-context demographics, contact points, and
 * emergency contacts. Emits PatientProfileUpdated (references only) iff it
 * commits.
 */
export async function updatePatientProfile(
  deps: PatientProfileServiceDeps,
  input: UpdatePatientProfileInput
): Promise<UpdatePatientProfileOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const existing = await withClient(deps.pool, (client) =>
    loadPatientProfile(client, input.patientId)
  );
  if (!existing) {
    return { status: "not-found" };
  }

  const { result } = await runTransactionalCommand({
    transaction: deps.transaction,
    outbox: deps.outbox,
    auditSink: deps.auditSink,
    externalCallPolicy: deps.externalCallPolicy,
    command: {
      name: "patient.profile.update",
      aggregateId: input.patientId,
      action: "update",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      const status = input.status ?? existing.status;
      await updatePatientProfileDemographics(ctx.client, {
        patientId: input.patientId,
        status,
        preferredName: input.preferredName ?? existing.preferredName,
        biologicalSex: input.biologicalSex ?? existing.biologicalSex,
        genderIdentity: input.genderIdentity ?? existing.genderIdentity,
        preferredLanguage: input.preferredLanguage ?? existing.preferredLanguage,
        contactPoints: input.contactPoints ?? existing.contactPoints,
        emergencyContacts: input.emergencyContacts ?? existing.emergencyContacts,
        updatedAt: nowIso
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "PatientProfileUpdated",
          aggregateId: input.patientId,
          safeContext: input.safeContext,
          payload: {
            patientProfileRef: input.patientId,
            personRef: existing.personRef,
            organizationRef: existing.organizationRef,
            status
          }
        })
      );
      return {
        result: { status: "updated" as const, patientId: input.patientId },
        audit: {
          outcome: "committed",
          safeDetails: {
            patientProfileRef: input.patientId,
            personRef: existing.personRef,
            organizationRef: existing.organizationRef
          }
        }
      };
    }
  });

  return result;
}

// ---------- Full-pipeline access governance ----------

export interface PatientProfileAccessRequest {
  decisionRequestId: string;
  actorId: string;
  actorRole: AuthorizationActorRole;
  actorType: AuthorizationPolicyDecisionDraftInput["actorType"];
  patientId: string;
  organizationId: string;
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
 * Compose the three persisted access-control dimensions into a single Policy
 * Decision Point evaluation for a patient-profile access. Pure: takes the
 * already-loaded records so the composition is unit-testable without a database.
 */
export function decidePatientProfileAccessFrom(
  request: PatientProfileAccessRequest,
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
    requestedResource: "patient-profile",
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

/** Load the three persisted dimensions for a decision subject and decide. */
export async function decidePatientProfileAccess(
  deps: Pick<PatientProfileServiceDeps, "pool">,
  request: PatientProfileAccessRequest
): Promise<AuthorizationPolicyDecisionDraft> {
  const [consent, relationship, breakGlass] = await Promise.all([
    withClient(deps.pool, (client) =>
      loadConsentRecordByPatientOrg(client, request.patientId, request.organizationId)
    ),
    request.requiresRelationship
      ? withClient(deps.pool, (client) =>
          loadRelationshipForSubject(client, {
            actorRef: request.actorId,
            patientRef: request.patientId,
            organizationRef: request.organizationId,
            relationshipType: request.relationshipType
          })
        )
      : Promise.resolve(null),
    withClient(deps.pool, (client) =>
      loadActiveBreakGlassForSubject(client, {
        actorRef: request.actorId,
        patientRef: request.patientId,
        organizationRef: request.organizationId
      })
    )
  ]);
  return decidePatientProfileAccessFrom(request, { consent, relationship, breakGlass });
}

export type ReadPatientProfileOutcome =
  | {
      status: "allowed";
      profile: PersistedPatientProfile;
      decision: AuthorizationPolicyDecisionDraft;
    }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found"; decision: AuthorizationPolicyDecisionDraft };

/**
 * Read a patient profile through the full authorization pipeline. The decision
 * is made BEFORE any profile data is loaded, so a denied decision never leaks
 * demographics, contacts, or identifiers.
 */
export async function readPatientProfile(
  deps: Pick<PatientProfileServiceDeps, "pool">,
  request: PatientProfileAccessRequest
): Promise<ReadPatientProfileOutcome> {
  const decision = await decidePatientProfileAccess(deps, request);
  if (decision.status !== "allowed") {
    return { status: "denied", decision };
  }
  const profile = await withClient(deps.pool, (client) =>
    loadPatientProfile(client, request.patientId)
  );
  if (!profile) {
    return { status: "not-found", decision };
  }
  return { status: "allowed", profile, decision };
}

/** Resolve a patient by a medical identifier within an organization. */
export async function findPatientByIdentifier(
  deps: Pick<PatientProfileServiceDeps, "pool">,
  input: { organizationRef: string; system: string; value: string }
): Promise<string | null> {
  return withClient(deps.pool, (client) => findPatientIdByIdentifier(client, input));
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
