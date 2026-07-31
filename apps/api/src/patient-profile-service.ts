import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  assertSafeAuditEvent,
  createDomainEventEnvelope,
  findPatientIdByIdentifier,
  insertConsentRecord,
  insertConsentVersion,
  insertPatientIdentifier,
  insertPatientProfile,
  insertRelationship,
  loadPatientProfile,
  loadPatientProfileByPersonOrg,
  runTransactionalCommand,
  updatePatientProfileDemographics,
  type AuditEventRecord,
  type AuditSink,
  type CommandActor,
  type PatientBiologicalSex,
  type PatientContactPoint,
  type PatientEmergencyContact,
  type PatientIdentifier,
  type PatientProfileStatus,
  type PersistedPatientProfile
} from "@nelyohealth/database";
import type { ConsentDomain } from "./granular-consent.js";
import {
  composeResourceAccessDecision,
  resolveAndDecideResourceAccess,
  type ResolvedAuthorizationInputs
} from "./resource-authorization.js";
import { resolveDecideAndAuditAccess } from "./access-audit.js";
import {
  evaluatePatientProfileCreateAuthorization,
  type PatientProfileCreateDecisionInput
} from "./authorization-policy-handlers.js";
import type {
  AuthorizationActorRole,
  AuthorizationPolicyDecisionDraft,
  AuthorizationPolicyDecisionDraftInput,
  EmergencyStatus,
  SessionStatus
} from "./authorization-policy.js";

export type { ResolvedAuthorizationInputs } from "./resource-authorization.js";

/**
 * Patient-profile service (roadmap M5.1; write authorization hardened in M6.3).
 *
 * The authoritative Patient resource. Three responsibilities:
 *
 *  1. CREATE (decide-before-write, distinct decision kind). Registering a profile
 *     is authorized by CAPABILITY + WORKSPACE — NOT consent, because the subject
 *     does not exist yet (evaluatePatientProfileCreateAuthorization). Order is
 *     DECIDE -> DEDUP -> BOOTSTRAP: authorize first (no identity read on a denied
 *     caller), then resolve identity (dedup, Principle 1) with a NON-enumerating
 *     response, then create the profile AND atomically bootstrap the governing
 *     consent (self / org) or relationship + consent (guardian) rows — so no
 *     profile ever exists without governing consent/relationship. Everything after
 *     the creating transaction flows through the normal pipeline unchanged.
 *
 *  2. UPDATE (decide-before-write, full pipeline). The patient exists, so update
 *     composes ALL THREE M4 dimensions (consent + ReBAC + break-glass) exactly as
 *     reads do — a denied decision mutates nothing. Break-glass cannot open a write
 *     because no profile-write rule carries the emergency-care purpose.
 *
 *  3. READ (decide-before-load, full pipeline). Unchanged from M5.1.
 *
 * No demographics / contact / identifier value ever leaves the server in an event
 * or audit detail; consent domains + provenance labels are non-clinical.
 */

const DEFAULT_STATUS: PatientProfileStatus = "active";

// Bootstrap consent scopes per registration mode. Named + minimal: the grant
// covers the baseline a post-create read needs, no more; wider access requires an
// explicit later consent capture.
const SELF_REGISTRATION_CONSENT_DOMAINS: ConsentDomain[] = [
  "telemedicine",
  "provider-data-sharing"
];
const ORG_REGISTRATION_CONSENT_DOMAINS: ConsentDomain[] = ["provider-data-sharing"];
const GUARDIAN_CONSENT_DOMAINS: ConsentDomain[] = ["provider-data-sharing", "family-participation"];

const REGISTRATION_PROVENANCE: Record<RegistrationMode, string> = {
  self: "self-registration",
  organization: "captured-at-registration",
  guardian: "guardian-granted"
};

export type RegistrationMode = "self" | "organization" | "guardian";

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

// ---------- Create (decide -> dedup -> bootstrap) ----------

/** Capability + workspace context for a CREATE decision (no consent/relationship). */
export type PatientProfileCreateAccessContext = Omit<
  PatientProfileCreateDecisionInput,
  "subjectRef"
>;

export interface CreatePatientProfileInput {
  personRef: string;
  organizationRef: string;
  registrationMode: RegistrationMode;
  status?: PatientProfileStatus;
  preferredName?: string;
  biologicalSex?: PatientBiologicalSex;
  genderIdentity?: string;
  preferredLanguage?: string;
  contactPoints?: PatientContactPoint[];
  emergencyContacts?: PatientEmergencyContact[];
  identifiers?: PatientIdentifier[];
  access: PatientProfileCreateAccessContext;
  actor: CommandActor;
  safeContext: PatientProfileSafeContext;
  now?: () => Date;
}

export type CreatePatientProfileOutcome =
  | { status: "created"; patientId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  // Non-enumerating dedup hit: NO matched identity ref/attributes in the response;
  // the match detail is in the audit event only. Route the caller to claim/link.
  | { status: "possible-existing-identity"; nextStep: "identity-claim-or-link" };

/** Pure CREATE decision (capability + workspace); entry point for unit tests. */
export function decidePatientProfileCreate(
  access: PatientProfileCreateAccessContext,
  subjectRef: string
): AuthorizationPolicyDecisionDraft {
  return evaluatePatientProfileCreateAuthorization({ ...access, subjectRef });
}

/**
 * Register the authoritative patient profile for a person within an organization.
 * DECIDE (capability + workspace) -> DEDUP (identity resolution, non-enumerating)
 * -> BOOTSTRAP (profile + governing consent/relationship, one transaction).
 */
export async function createPatientProfile(
  deps: PatientProfileServiceDeps,
  input: CreatePatientProfileInput
): Promise<CreatePatientProfileOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();
  const identifiers = input.identifiers ?? [];

  // 1. DECIDE FIRST. Capability + workspace only; costs nothing and reads no
  //    identity data, so an unauthorized caller is denied before any identity
  //    lookup runs. Denials are audited like any other decision.
  const decision = decidePatientProfileCreate(input.access, input.personRef);
  if (decision.status !== "allowed") {
    await recordCreateDecisionAudit(deps, {
      actor: input.actor,
      safeContext: input.safeContext,
      aggregateId: input.personRef,
      outcome: "denied",
      safeDetails: { reasonCode: decision.reasonCode }
    });
    return { status: "denied", decision };
  }

  // 2. IDENTITY RESOLUTION (dedup), only for an authorized creator. On a probable
  //    match, respond generically (no matched ref); the match detail is audited.
  const existing = await withClient(deps.pool, (client) =>
    loadPatientProfileByPersonOrg(client, input.personRef, input.organizationRef)
  );
  if (existing) {
    await recordCreateDecisionAudit(deps, {
      actor: input.actor,
      safeContext: input.safeContext,
      aggregateId: input.personRef,
      outcome: "possible-existing-identity",
      safeDetails: {
        reasonCode: "possible-existing-identity",
        matchedPatientRef: existing.patientId
      }
    });
    return { status: "possible-existing-identity", nextStep: "identity-claim-or-link" };
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
      await recordCreateDecisionAudit(deps, {
        actor: input.actor,
        safeContext: input.safeContext,
        aggregateId: input.personRef,
        outcome: "possible-existing-identity",
        safeDetails: { reasonCode: "possible-existing-identity", matchedPatientRef: owner }
      });
      return { status: "possible-existing-identity", nextStep: "identity-claim-or-link" };
    }
  }

  // 3. ATOMIC BOOTSTRAP: profile + governing consent/relationship + event + audit.
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
      action: "create-profile",
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
      const bootstrap = await bootstrapGoverningAccess(ctx.client, {
        mode: input.registrationMode,
        patientId,
        organizationRef: input.organizationRef,
        actorRef: input.access.actorId,
        nowIso
      });
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
            identifierCount: identifiers.length,
            registrationMode: input.registrationMode,
            governingConsentRef: bootstrap.consentId,
            ...(bootstrap.relationshipId
              ? { guardianRelationshipRef: bootstrap.relationshipId }
              : {})
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
            identifierCount: identifiers.length,
            registrationMode: input.registrationMode,
            governingConsentRef: bootstrap.consentId
          }
        }
      };
    }
  });

  return result;
}

/**
 * Bootstrap the governing access rows a new profile requires, in the create
 * transaction. Every mode grants a governing consent (with provenance); the
 * guardian mode additionally establishes the guardian relationship (ReBAC).
 */
async function bootstrapGoverningAccess(
  client: PoolClient,
  input: {
    mode: RegistrationMode;
    patientId: string;
    organizationRef: string;
    actorRef: string;
    nowIso: string;
  }
): Promise<{ consentId: string; relationshipId?: string }> {
  const domains =
    input.mode === "self"
      ? SELF_REGISTRATION_CONSENT_DOMAINS
      : input.mode === "organization"
        ? ORG_REGISTRATION_CONSENT_DOMAINS
        : GUARDIAN_CONSENT_DOMAINS;

  const consentId = randomUUID();
  await insertConsentRecord(client, {
    consentId,
    patientRef: input.patientId,
    organizationRef: input.organizationRef,
    currentVersion: 1,
    createdAt: input.nowIso,
    updatedAt: input.nowIso
  });
  await insertConsentVersion(client, {
    consentId,
    version: 1,
    status: "granted",
    grantedDomains: domains,
    effectiveDate: input.nowIso,
    createdAt: input.nowIso,
    createdByActorRef: input.actorRef,
    provenance: REGISTRATION_PROVENANCE[input.mode]
  });

  let relationshipId: string | undefined;
  if (input.mode === "guardian") {
    relationshipId = randomUUID();
    await insertRelationship(client, {
      relationshipId,
      actorRef: input.actorRef,
      patientRef: input.patientId,
      organizationRef: input.organizationRef,
      relationshipType: "guardian",
      status: "active",
      verificationMethod: "organization-attestation",
      effectiveDate: input.nowIso,
      permittedActions: ["read", "update-profile", "book"],
      createdAt: input.nowIso,
      updatedAt: input.nowIso
    });
  }

  return { consentId, relationshipId };
}

// ---------- Update (decide-before-write, full pipeline) ----------

/** Full decision context for an UPDATE (the read context minus the action). */
export type PatientProfileWriteAccessContext = Omit<PatientProfileAccessRequest, "requestedAction">;

export interface UpdatePatientProfileInput {
  patientId: string;
  status?: PatientProfileStatus;
  preferredName?: string;
  biologicalSex?: PatientBiologicalSex;
  genderIdentity?: string;
  preferredLanguage?: string;
  contactPoints?: PatientContactPoint[];
  emergencyContacts?: PatientEmergencyContact[];
  access: PatientProfileWriteAccessContext;
  actor: CommandActor;
  safeContext: PatientProfileSafeContext;
  now?: () => Date;
}

export type UpdatePatientProfileOutcome =
  | { status: "updated"; patientId: string }
  | { status: "denied"; decision: AuthorizationPolicyDecisionDraft }
  | { status: "not-found" };

/**
 * Update a patient profile through the full pipeline, deciding BEFORE any write.
 * A denied decision mutates nothing (and is audited). Break-glass cannot open this
 * write: no patient-profile update rule carries the emergency-care purpose, so the
 * evaluator's emergency bypass never fires for a profile write.
 */
export async function updatePatientProfile(
  deps: PatientProfileServiceDeps,
  input: UpdatePatientProfileInput
): Promise<UpdatePatientProfileOutcome> {
  const nowIso = (input.now?.() ?? new Date()).toISOString();

  const decision = await resolveAndDecideResourceAccess(deps.pool, {
    ...input.access,
    requestedResource: "patient-profile",
    requestedAction: "update-profile"
  });
  if (decision.status !== "allowed") {
    await recordWriteDecisionAudit(deps, {
      actor: input.actor,
      safeContext: input.safeContext,
      aggregateId: input.patientId,
      action: "update-profile",
      outcome: "denied",
      safeDetails: { reasonCode: decision.reasonCode }
    });
    return { status: "denied", decision };
  }

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
      action: "update-profile",
      actor: input.actor,
      safeContext: input.safeContext
    },
    work: async (ctx) => {
      const status = input.status ?? existing.status;
      await updatePatientProfileDemographics(ctx.client, {
        patientId: input.patientId,
        organizationRef: existing.organizationRef,
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

// ---------- Deny / dedup audit (decide-before-write leaves a trail) ----------

async function recordCreateDecisionAudit(
  deps: PatientProfileServiceDeps,
  input: {
    actor: CommandActor;
    safeContext: PatientProfileSafeContext;
    aggregateId: string;
    outcome: string;
    safeDetails: Record<string, unknown>;
  }
): Promise<void> {
  await recordDecisionAudit(deps, {
    ...input,
    commandName: "patient.profile.create",
    action: "create-profile"
  });
}

async function recordWriteDecisionAudit(
  deps: PatientProfileServiceDeps,
  input: {
    actor: CommandActor;
    safeContext: PatientProfileSafeContext;
    aggregateId: string;
    action: string;
    outcome: string;
    safeDetails: Record<string, unknown>;
  }
): Promise<void> {
  await recordDecisionAudit(deps, { ...input, commandName: "patient.profile.update" });
}

async function recordDecisionAudit(
  deps: PatientProfileServiceDeps,
  input: {
    actor: CommandActor;
    safeContext: PatientProfileSafeContext;
    aggregateId: string;
    commandName: string;
    action: string;
    outcome: string;
    safeDetails: Record<string, unknown>;
  }
): Promise<void> {
  const event: AuditEventRecord = {
    auditId: randomUUID(),
    commandName: input.commandName,
    aggregateId: input.aggregateId,
    action: input.action,
    outcome: input.outcome,
    actorAccountRef: input.actor.accountRef,
    actorPersonaKind: input.actor.personaKind,
    actorRole: input.actor.actorRole,
    tenantRef: input.actor.tenantRef ?? null,
    correlationId: input.safeContext.correlationId,
    requestId: input.safeContext.requestId,
    idempotencyKey: input.safeContext.idempotencyKey,
    safeDetails: input.safeDetails,
    occurredAt: new Date().toISOString()
  };
  assertSafeAuditEvent(event);
  await withClient(deps.pool, (client) => deps.auditSink.record(client, event));
}

// ---------- Full-pipeline access governance (read) ----------

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

/**
 * Compose the three persisted access-control dimensions into a single Policy
 * Decision Point evaluation for a patient-profile access. Pure: delegates to the
 * shared resource-authorization composition with the patient-profile resource.
 */
export function decidePatientProfileAccessFrom(
  request: PatientProfileAccessRequest,
  resolved: ResolvedAuthorizationInputs
): AuthorizationPolicyDecisionDraft {
  return composeResourceAccessDecision(
    { ...request, requestedResource: "patient-profile" },
    resolved
  );
}

/** Load the three persisted dimensions for a decision subject and decide. */
export async function decidePatientProfileAccess(
  deps: Pick<PatientProfileServiceDeps, "pool">,
  request: PatientProfileAccessRequest
): Promise<AuthorizationPolicyDecisionDraft> {
  // Read decides through the audited wrapper — a denied read is recorded (M6.3b).
  return resolveDecideAndAuditAccess(deps.pool, {
    ...request,
    requestedResource: "patient-profile"
  });
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
