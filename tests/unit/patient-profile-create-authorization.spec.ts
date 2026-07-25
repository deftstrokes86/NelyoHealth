import { describe, expect, it } from "vitest";
import type { AuditEventRecord } from "../../packages/database/src/index.js";
import {
  createPatientProfile,
  decidePatientProfileCreate,
  type PatientProfileServiceDeps,
  type PatientProfileCreateAccessContext
} from "../../apps/api/src/patient-profile-service.js";
import { evaluateAuthorizationPolicyDecision } from "../../apps/api/src/authorization-policy-handlers.js";

/**
 * M6.3 — patient-profile CREATE authorization (pure). CREATE is a DISTINCT decision
 * kind: capability + workspace, never consent. Proves default-deny, the workspace
 * gates, that break-glass cannot open a profile WRITE (no write rule permits the
 * emergency-care purpose), and the decide-BEFORE-dedup ordering (an unauthorized
 * create is denied and audited without any identity-resolution query running).
 */

function access(
  overrides: Partial<PatientProfileCreateAccessContext> = {}
): PatientProfileCreateAccessContext {
  return {
    decisionRequestId: "cr-1",
    actorId: "actor-1",
    actorRole: "organization-admin",
    actorType: "admin",
    organizationId: "org-1",
    purpose: "tenant-administration",
    sameTenant: true,
    sessionStatus: "active",
    evaluatedAt: "2026-07-25T12:00:00.000Z",
    ...overrides
  };
}

describe("patient-profile create decision (capability + workspace, no consent)", () => {
  it("allows an organization-admin registering under tenant-administration", () => {
    expect(decidePatientProfileCreate(access(), "person-1").status).toBe("allowed");
  });

  it("allows a patient self-registering under care-delivery", () => {
    const decision = decidePatientProfileCreate(
      access({ actorRole: "patient", actorType: "patient", purpose: "care-delivery" }),
      "person-1"
    );
    expect(decision.status).toBe("allowed");
  });

  it("allows a guardian registering a dependent under care-delivery", () => {
    const decision = decidePatientProfileCreate(
      access({ actorRole: "guardian", actorType: "guardian", purpose: "care-delivery" }),
      "person-1"
    );
    expect(decision.status).toBe("allowed");
  });

  it("default-denies a role with no create capability", () => {
    const decision = decidePatientProfileCreate(
      access({ actorRole: "caregiver", actorType: "caregiver", purpose: "care-delivery" }),
      "person-1"
    );
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("rbac-policy-unmapped-deny-default");
  });

  it("denies a capability under a purpose the rule does not permit", () => {
    const decision = decidePatientProfileCreate(access({ purpose: "care-delivery" }), "person-1");
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("abac-purpose-not-allowed");
  });

  it("denies a cross-tenant create (workspace mismatch)", () => {
    const decision = decidePatientProfileCreate(access({ sameTenant: false }), "person-1");
    expect(decision.reasonCode).toBe("tenant-mismatch");
  });

  it("denies a stale session", () => {
    const decision = decidePatientProfileCreate(access({ sessionStatus: "stale" }), "person-1");
    expect(decision.reasonCode).toBe("stale-session");
  });
});

describe("break-glass cannot open a patient-profile WRITE", () => {
  function writeAttempt(purpose: string) {
    return evaluateAuthorizationPolicyDecision({
      decisionRequestId: "w-1",
      actorId: "clin-1",
      actorRole: "clinician",
      actorType: "clinician",
      organizationId: "org-1",
      patientId: "pt-1",
      relationshipType: "none",
      requestedConsentDomains: [],
      requestedResource: "patient-profile",
      requestedAction: "update-profile",
      purpose,
      consentStatus: "revoked",
      relationshipStatus: "none",
      sessionStatus: "active",
      activeEncounter: true,
      emergencyStatus: "declared",
      sameTenant: true,
      sponsorPaymentOnly: false,
      requiresRelationship: false,
      breakGlassRequested: true,
      breakGlassReason: "unconscious patient",
      breakGlassWindowMinutes: 10,
      impersonationAttempt: false,
      auditEventEditAttempt: false,
      evaluatedAt: "2026-07-25T12:00:00.000Z"
    });
  }

  it("denies an emergency-care write attempt (no write rule permits that purpose)", () => {
    const decision = writeAttempt("emergency-care");
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("abac-purpose-not-allowed");
  });

  it("denies a care-delivery write with break-glass but no consent (bypass does not fire)", () => {
    const decision = writeAttempt("care-delivery");
    expect(decision.status).toBe("denied");
    // Bypass needs purpose=emergency-care; under care-delivery the consent gate
    // runs and denies (no consent record) — break-glass opened nothing.
    expect(decision.reasonCode).toBe("consent-missing");
  });
});

describe("create decides BEFORE any identity resolution", () => {
  it("denies an unauthorized create and audits it without running a dedup query", async () => {
    const executedSql: string[] = [];
    let connectCount = 0;
    const fakeClient = {
      query: async (sql: string) => {
        executedSql.push(String(sql));
        return { rows: [], rowCount: 0 };
      },
      release: () => {}
    };
    const fakePool = {
      connect: async () => {
        connectCount += 1;
        return fakeClient;
      }
    };

    const recordedAudits: AuditEventRecord[] = [];
    const fakeAuditSink = {
      record: async (_client: unknown, event: AuditEventRecord) => {
        recordedAudits.push(event);
      }
    };

    const deps = {
      pool: fakePool,
      transaction: {},
      outbox: {},
      auditSink: fakeAuditSink,
      externalCallPolicy: {}
    } as unknown as PatientProfileServiceDeps;

    const outcome = await createPatientProfile(deps, {
      personRef: "person-x",
      organizationRef: "org-1",
      registrationMode: "organization",
      identifiers: [{ system: "mrn", value: "SHOULD-NOT-BE-QUERIED" }],
      access: access({ actorRole: "caregiver", actorType: "caregiver", purpose: "care-delivery" }),
      actor: { accountRef: "acc", personaKind: "staff", actorRole: "caregiver", tenantRef: null },
      safeContext: {
        requestId: "r",
        correlationId: "c",
        idempotencyKey: "i",
        operationTag: "patient.profile.create"
      }
    });

    expect(outcome.status).toBe("denied");
    // The deny was audited...
    expect(recordedAudits).toHaveLength(1);
    expect(recordedAudits[0]?.outcome).toBe("denied");
    // ...and NO identity-resolution query ran (dedup is gated behind the allow).
    expect(executedSql.some((sql) => /patient_profile|patient_identifier/i.test(sql))).toBe(false);
    expect(connectCount).toBe(1); // only the audit write connected
  });
});
