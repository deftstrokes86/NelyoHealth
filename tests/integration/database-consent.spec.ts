import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  insertConsentRecord,
  insertConsentVersion,
  loadConsentRecord,
  loadConsentRecordByPatientOrg
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  decideAuthorizationForPatientOrg,
  grantConsent,
  withdrawConsent,
  type ConsentAuthorizationBaseInput
} from "../../apps/api/src/consent-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

/**
 * M4.1 consent persistence against live Postgres. Proves:
 *  - the repository round-trips a versioned consent record;
 *  - grant / withdraw run as transactional commands (consent state, the
 *    ConsentGranted / ConsentWithdrawn outbox event, and the audit intent all
 *    commit together);
 *  - a re-grant supersedes the prior version and bumps current_version;
 *  - a withdrawal recorded through the command flips the current version to
 *    'revoked' AND propagates to the very next authorization decision loaded
 *    from the database (no cached consent).
 */
describe.skipIf(!shouldRun)("consent persistence (repository + transactional commands)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const deps = createPgConsentServiceDeps(pool);
  const run = `consent-${Date.now()}`;
  const patientRefs: string[] = [];
  const correlationIds: string[] = [];

  const actor = {
    accountRef: "patient-1",
    personaKind: "personal",
    actorRole: "patient",
    tenantRef: null
  } as const;

  function safeContext(tag: string) {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      requestId: `req-${run}-${tag}`,
      correlationId,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "consent.grants.grant"
    };
  }

  function newSubject(): { patientRef: string; organizationRef: string } {
    const patientRef = randomUUID();
    patientRefs.push(patientRef);
    return { patientRef, organizationRef: randomUUID() };
  }

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const patientRef of patientRefs) {
      await client.query(
        `DELETE FROM nelyo_consent.consent_version WHERE consent_id IN
           (SELECT consent_id FROM nelyo_consent.consent_record WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_consent.consent_record WHERE patient_ref = $1`, [
        patientRef
      ]);
    }
    for (const correlationId of correlationIds) {
      await client.query(`DELETE FROM nelyo_foundation.audit_event WHERE correlation_id = $1`, [
        correlationId
      ]);
      await client.query(
        `DELETE FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
        [correlationId]
      );
    }
    await client.end();
    await pool.end();
  });

  it("round-trips a versioned consent record through the repository", async () => {
    const { patientRef, organizationRef } = newSubject();
    const consentId = randomUUID();
    const at = "2026-01-01T00:00:00.000Z";

    await insertConsentRecord(client, {
      consentId,
      patientRef,
      organizationRef,
      currentVersion: 1,
      createdAt: at,
      updatedAt: at
    });
    await insertConsentVersion(client, {
      consentId,
      version: 1,
      status: "granted",
      grantedDomains: ["telemedicine", "provider-data-sharing"],
      effectiveDate: at,
      createdAt: at,
      createdByActorRef: "patient-1"
    });

    const byId = await loadConsentRecord(client, consentId);
    expect(byId).toMatchObject({ consentId, patientRef, organizationRef, currentVersion: 1 });
    expect(byId?.versions).toHaveLength(1);
    expect(byId?.versions[0]).toMatchObject({ version: 1, status: "granted" });
    expect(byId?.versions[0]?.grantedDomains).toEqual(["telemedicine", "provider-data-sharing"]);

    const byPatientOrg = await loadConsentRecordByPatientOrg(client, patientRef, organizationRef);
    expect(byPatientOrg?.consentId).toBe(consentId);
  });

  it("grants consent as a transactional command (state + outbox event + audit)", async () => {
    const { patientRef, organizationRef } = newSubject();
    const ctx = safeContext("grant");

    const outcome = await grantConsent(deps, {
      patientRef,
      organizationRef,
      grantedDomains: ["telemedicine", "provider-data-sharing"],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor,
      safeContext: ctx
    });
    expect(outcome).toMatchObject({ status: "granted", version: 1 });

    // Consent state committed.
    const record = await loadConsentRecord(client, outcome.consentId);
    expect(record?.currentVersion).toBe(1);
    expect(record?.versions[0]?.status).toBe("granted");

    // Outbox event committed (pending), reference-only payload.
    const outbox = await client.query(
      `SELECT event_type, dispatch_status, payload_json FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows).toHaveLength(1);
    expect(outbox.rows[0]).toMatchObject({
      event_type: "ConsentGranted",
      dispatch_status: "pending"
    });
    expect(outbox.rows[0].payload_json).toMatchObject({
      consentRef: outcome.consentId,
      version: 1
    });

    // Audit intent committed on the same command.
    const audit = await client.query(
      `SELECT command_name, action, outcome FROM nelyo_foundation.audit_event
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows).toHaveLength(1);
    expect(audit.rows[0]).toMatchObject({
      command_name: "consent.grants.grant",
      action: "grant",
      outcome: "committed"
    });
  });

  it("supersedes the current version on re-grant", async () => {
    const { patientRef, organizationRef } = newSubject();

    const first = await grantConsent(deps, {
      patientRef,
      organizationRef,
      grantedDomains: ["telemedicine", "provider-data-sharing"],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor,
      safeContext: safeContext("regrant-1")
    });
    const second = await grantConsent(deps, {
      patientRef,
      organizationRef,
      grantedDomains: ["telemedicine"],
      effectiveDate: "2026-02-01T00:00:00.000Z",
      actor,
      safeContext: safeContext("regrant-2")
    });

    expect(second.consentId).toBe(first.consentId);
    expect(second.version).toBe(2);

    const record = await loadConsentRecord(client, second.consentId);
    expect(record?.currentVersion).toBe(2);
    const v1 = record?.versions.find((version) => version.version === 1);
    const v2 = record?.versions.find((version) => version.version === 2);
    expect(v1?.supersededByVersion).toBe(2);
    expect(v2?.grantedDomains).toEqual(["telemedicine"]);
  });

  it("withdraws consent and propagates to the very next authorization decision", async () => {
    const { patientRef, organizationRef } = newSubject();

    await grantConsent(deps, {
      patientRef,
      organizationRef,
      grantedDomains: ["telemedicine", "provider-data-sharing"],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor,
      safeContext: safeContext("wd-grant")
    });

    const base = authorizationBase(patientRef, organizationRef);

    const before = await decideAuthorizationForPatientOrg(deps, base);
    expect(before.status).toBe("allowed");

    const ctx = safeContext("withdraw");
    const withdrawn = await withdrawConsent(deps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor,
      safeContext: ctx
    });
    expect(withdrawn.status).toBe("withdrawn");

    // Withdrawal event + audit committed.
    const outbox = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0]).toMatchObject({ event_type: "ConsentWithdrawn" });

    // The next decision, loaded fresh from the database, is now denied.
    const after = await decideAuthorizationForPatientOrg(deps, base);
    expect(after.status).toBe("denied");
    expect(after.reasonCode).toBe("consent-revoked");
  });

  it("is a no-op when withdrawing with no persisted consent", async () => {
    const { patientRef, organizationRef } = newSubject();
    const outcome = await withdrawConsent(deps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor,
      safeContext: safeContext("wd-none")
    });
    expect(outcome).toEqual({ status: "no-consent" });

    const record = await loadConsentRecordByPatientOrg(client, patientRef, organizationRef);
    expect(record).toBeNull();
  });
});

/** Permissive decision context so consent is the sole deciding dimension. */
function authorizationBase(
  patientRef: string,
  organizationRef: string
): ConsentAuthorizationBaseInput {
  return {
    decisionRequestId: "consent-db-authz-1",
    actorId: "actor-1",
    actorRole: "guardian",
    actorType: "guardian",
    organizationId: organizationRef,
    patientId: patientRef,
    relationshipType: "guardian",
    relationship: {
      relationshipId: "rel-1",
      relationshipType: "guardian",
      actorId: "actor-1",
      patientId: patientRef,
      organizationId: organizationRef,
      lifecycle: {
        status: "active",
        verificationMethod: "legal-document",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        expiryDate: "2027-01-01T00:00:00.000Z",
        permittedActions: ["read", "update-consent"],
        supportingDocuments: [],
        reviewHistory: []
      }
    },
    requestedConsentDomains: ["telemedicine", "provider-data-sharing"],
    requestedResource: "clinical-record-summary",
    requestedAction: "read",
    purpose: "care-delivery",
    relationshipStatus: "active",
    sessionStatus: "active",
    activeEncounter: true,
    emergencyStatus: "none",
    sameTenant: true,
    sponsorPaymentOnly: false,
    requiresRelationship: true,
    breakGlassRequested: false,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt: "2026-07-02T12:00:00.000Z"
  };
}
