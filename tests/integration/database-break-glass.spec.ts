import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  insertBreakGlassAccess,
  listBreakGlassForPatient,
  loadBreakGlassAccess
} from "../../packages/database/src/index.js";
import {
  activateBreakGlassAccess,
  createPgBreakGlassServiceDeps,
  decideAuthorizationForSubjectWithBreakGlass,
  requestBreakGlassAccess,
  reviewBreakGlassAccess,
  type BreakGlassAuthorizationBaseInput
} from "../../apps/api/src/break-glass-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

const SENTINEL_JUSTIFICATION = "SENSITIVE unconscious patient in ED — need medication history";

/**
 * M4.3 break-glass persistence against live Postgres. Proves:
 *  - the repository round-trips a grant;
 *  - request / activate / review run as transactional commands (state, event,
 *    audit all commit together);
 *  - the justification NEVER appears in an event payload or audit detail;
 *  - the justification and actor attribution are immutable at the database;
 *  - an active grant supplies the emergency override, and it self-cancels the
 *    moment its window closes (derived against the decision clock);
 *  - governance can list a patient's break-glass history.
 */
describe.skipIf(!shouldRun)("break-glass persistence (repository + transactional commands)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const deps = createPgBreakGlassServiceDeps(pool);
  const run = `bg-${Date.now()}`;
  const actorRefs: string[] = [];
  const correlationIds: string[] = [];

  const actor = {
    accountRef: "clinician-1",
    personaKind: "staff",
    actorRole: "clinician",
    tenantRef: null
  } as const;

  function safeContext(tag: string) {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      requestId: `req-${run}-${tag}`,
      correlationId,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "break-glass.access.request"
    };
  }

  function newSubject(): { actorRef: string; patientRef: string; organizationRef: string } {
    const actorRef = randomUUID();
    actorRefs.push(actorRef);
    return { actorRef, patientRef: randomUUID(), organizationRef: randomUUID() };
  }

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const actorRef of actorRefs) {
      await client.query(`DELETE FROM nelyo_break_glass.break_glass_access WHERE actor_ref = $1`, [
        actorRef
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

  it("round-trips a break-glass grant through the repository", async () => {
    const { actorRef, patientRef, organizationRef } = newSubject();
    const accessId = randomUUID();
    const at = "2026-07-02T12:00:00.000Z";

    await insertBreakGlassAccess(client, {
      accessId,
      actorRef,
      patientRef,
      organizationRef,
      justification: SENTINEL_JUSTIFICATION,
      ttlMinutes: 10,
      requestedAt: at,
      expiresAt: "2026-07-02T12:10:00.000Z",
      createdAt: at,
      updatedAt: at
    });

    const loaded = await loadBreakGlassAccess(client, accessId);
    expect(loaded).toMatchObject({ accessId, status: "requested", ttlMinutes: 10 });
    expect(loaded?.justification).toBe(SENTINEL_JUSTIFICATION);
  });

  it("requests a grant as a transactional command, keeping the justification out of events and audit", async () => {
    const { actorRef, patientRef, organizationRef } = newSubject();
    const ctx = safeContext("request");

    const outcome = await requestBreakGlassAccess(deps, {
      actorRef,
      patientRef,
      organizationRef,
      justification: SENTINEL_JUSTIFICATION,
      ttlMinutes: 10,
      actor,
      safeContext: ctx
    });
    expect(outcome.status).toBe("requested");

    // Persisted justification present in the access-controlled record...
    const record =
      outcome.status === "requested" ? await loadBreakGlassAccess(client, outcome.accessId) : null;
    expect(record?.justification).toBe(SENTINEL_JUSTIFICATION);

    // ...but NEVER in the event payload or the audit detail.
    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("BreakGlassRequested");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");

    const audit = await client.query(
      `SELECT command_name, outcome, safe_details::text AS details FROM nelyo_foundation.audit_event
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0]).toMatchObject({
      command_name: "break-glass.access.request",
      outcome: "committed"
    });
    expect(audit.rows[0].details).not.toContain("SENSITIVE");
  });

  it("enforces immutable justification and actor attribution at the database", async () => {
    const { actorRef, patientRef, organizationRef } = newSubject();
    const accessId = randomUUID();
    const at = "2026-07-02T12:00:00.000Z";
    await insertBreakGlassAccess(client, {
      accessId,
      actorRef,
      patientRef,
      organizationRef,
      justification: SENTINEL_JUSTIFICATION,
      ttlMinutes: 5,
      requestedAt: at,
      expiresAt: "2026-07-02T12:05:00.000Z",
      createdAt: at,
      updatedAt: at
    });

    await expect(
      client.query(
        `UPDATE nelyo_break_glass.break_glass_access SET justification = 'rewritten' WHERE access_id = $1`,
        [accessId]
      )
    ).rejects.toThrow(/justification is immutable/);

    await expect(
      client.query(
        `UPDATE nelyo_break_glass.break_glass_access SET actor_ref = $2 WHERE access_id = $1`,
        [accessId, randomUUID()]
      )
    ).rejects.toThrow(/actor attribution is immutable/);
  });

  it("activates a grant and supplies the emergency override, then self-cancels at expiry", async () => {
    const { actorRef, patientRef, organizationRef } = newSubject();
    const requestedAt = new Date("2026-07-02T12:00:00.000Z");

    const requested = await requestBreakGlassAccess(deps, {
      actorRef,
      patientRef,
      organizationRef,
      justification: SENTINEL_JUSTIFICATION,
      ttlMinutes: 10, // expires 12:10
      actor,
      safeContext: safeContext("act-request"),
      now: () => requestedAt
    });
    expect(requested.status).toBe("requested");
    const accessId = requested.status === "requested" ? requested.accessId : "";

    const ctx = safeContext("activate");
    const activated = await activateBreakGlassAccess(deps, {
      accessId,
      actor,
      safeContext: ctx,
      now: () => new Date("2026-07-02T12:01:00.000Z")
    });
    expect(activated.status).toBe("active");

    const outbox = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0]).toMatchObject({ event_type: "BreakGlassActivated" });

    // Within the window: the persisted active grant supplies the override.
    const within = await decideAuthorizationForSubjectWithBreakGlass(
      deps,
      emergencyBase(actorRef, patientRef, organizationRef, "2026-07-02T12:05:00.000Z")
    );
    expect(within.status).toBe("allowed");
    expect(within.breakGlassActive).toBe(true);

    // After the window closes: the same grant contributes no override -> deny.
    const after = await decideAuthorizationForSubjectWithBreakGlass(
      deps,
      emergencyBase(actorRef, patientRef, organizationRef, "2026-07-02T12:11:00.000Z")
    );
    expect(after.status).toBe("denied");
    expect(after.reasonCode).toBe("consent-missing");
  });

  it("records an expiry when activation happens after the window has closed", async () => {
    const { actorRef, patientRef, organizationRef } = newSubject();
    const requested = await requestBreakGlassAccess(deps, {
      actorRef,
      patientRef,
      organizationRef,
      justification: SENTINEL_JUSTIFICATION,
      ttlMinutes: 1, // expires 12:01
      actor,
      safeContext: safeContext("exp-request"),
      now: () => new Date("2026-07-02T12:00:00.000Z")
    });
    const accessId = requested.status === "requested" ? requested.accessId : "";

    const ctx = safeContext("exp-activate");
    const outcome = await activateBreakGlassAccess(deps, {
      accessId,
      actor,
      safeContext: ctx,
      now: () => new Date("2026-07-02T12:03:00.000Z") // past expiry
    });
    expect(outcome.status).toBe("expired");

    const record = await loadBreakGlassAccess(client, accessId);
    expect(record?.status).toBe("expired");

    const outbox = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0]).toMatchObject({ event_type: "BreakGlassExpired" });
  });

  it("records a post-incident review with reviewer attribution and lists it for governance", async () => {
    const { actorRef, patientRef, organizationRef } = newSubject();
    const requested = await requestBreakGlassAccess(deps, {
      actorRef,
      patientRef,
      organizationRef,
      justification: SENTINEL_JUSTIFICATION,
      ttlMinutes: 10,
      actor,
      safeContext: safeContext("rev-request")
    });
    const accessId = requested.status === "requested" ? requested.accessId : "";

    const ctx = safeContext("review");
    const reviewed = await reviewBreakGlassAccess(deps, {
      accessId,
      outcome: "approved",
      reviewedByActorRef: "compliance-officer-1",
      reviewNotes: "justified emergency access",
      actor: {
        accountRef: "compliance-officer-1",
        personaKind: "staff",
        actorRole: "support",
        tenantRef: null
      },
      safeContext: ctx
    });
    expect(reviewed.status).toBe("reviewed");

    const record = await loadBreakGlassAccess(client, accessId);
    expect(record).toMatchObject({
      status: "review-completed",
      reviewOutcome: "approved",
      reviewedByActorRef: "compliance-officer-1"
    });

    const outbox = await client.query(
      `SELECT event_type, payload_json FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0]).toMatchObject({ event_type: "BreakGlassReviewed" });
    expect(outbox.rows[0].payload_json).toMatchObject({ reviewOutcome: "approved" });

    const history = await listBreakGlassForPatient(client, { patientRef, organizationRef });
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ accessId, reviewOutcome: "approved" });
  });
});

/** Clinician in a declared emergency-care context with NO consent, at a chosen clock. */
function emergencyBase(
  actorRef: string,
  patientRef: string,
  organizationRef: string,
  evaluatedAt: string
): BreakGlassAuthorizationBaseInput {
  return {
    decisionRequestId: "bg-db-authz-1",
    actorId: actorRef,
    actorRole: "clinician",
    actorType: "clinician",
    organizationId: organizationRef,
    patientId: patientRef,
    relationshipType: "none",
    relationshipStatus: "none",
    requestedConsentDomains: ["telemedicine"],
    consent: undefined,
    consentStatus: "revoked",
    requestedResource: "clinical-record-summary",
    requestedAction: "read",
    purpose: "emergency-care",
    sessionStatus: "active",
    activeEncounter: true,
    emergencyStatus: "declared",
    sameTenant: true,
    sponsorPaymentOnly: false,
    requiresRelationship: false,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt
  };
}
