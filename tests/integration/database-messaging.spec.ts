import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  loadMessageThread
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  closeMessageThread,
  createPgMessagingServiceDeps,
  markMessageAsRead,
  postMessage,
  readMessageThread,
  startMessageThread,
  type MessageAccessContext
} from "../../apps/api/src/messaging-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_SUBJECT = "SENSITIVE question about my medication";
const SENTINEL_BODY = "SENSITIVE-BODY I have been experiencing side effects since Tuesday";

/**
 * M5.7 messaging persistence + lifecycle + full-pipeline governance against live
 * Postgres. Proves atomic commands, no subject/body in events, decide-before-write
 * sending (non-encounter) + decide-before-load reads wired to real persisted
 * consent, and consent-withdrawal propagation.
 */
describe.skipIf(!shouldRun)("messaging persistence + lifecycle + access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const msg = createPgMessagingServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);

  const run = `msg-${Date.now()}`;
  const patientRefs: string[] = [];
  const correlationIds: string[] = [];

  function safeContext(tag: string) {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      requestId: `req-${run}-${tag}`,
      correlationId,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "messaging.thread.start"
    };
  }

  function patientActor(patientRef: string) {
    return {
      accountRef: patientRef,
      personaKind: "personal",
      actorRole: "patient",
      tenantRef: null
    } as const;
  }

  function patientAccess(patientRef: string, organizationRef: string): MessageAccessContext {
    return {
      decisionRequestId: `dr-${run}`,
      actorId: patientRef,
      actorRole: "patient",
      actorType: "patient",
      patientId: patientRef,
      organizationId: organizationRef,
      purpose: "care-coordination",
      requiresRelationship: false,
      relationshipType: "none",
      requestedConsentDomains: [],
      sessionStatus: "active",
      sameTenant: true,
      emergencyStatus: "none",
      activeEncounter: false,
      evaluatedAt: new Date().toISOString()
    };
  }

  async function grantBaselineConsent(patientRef: string, organizationRef: string, tag: string) {
    await grantConsent(consentDeps, {
      patientRef,
      organizationRef,
      grantedDomains: [],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor: patientActor(patientRef),
      safeContext: safeContext(tag)
    });
  }

  async function startThread(patientRef: string, organizationRef: string, tag: string) {
    return startMessageThread(msg, {
      subject: SENTINEL_SUBJECT,
      body: SENTINEL_BODY,
      access: patientAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: safeContext(tag)
    });
  }

  function newSubjects() {
    const patientRef = randomUUID();
    const organizationRef = randomUUID();
    patientRefs.push(patientRef);
    return { patientRef, organizationRef };
  }

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const patientRef of patientRefs) {
      await client.query(
        `DELETE FROM nelyo_messaging.message WHERE thread_ref IN
           (SELECT thread_id FROM nelyo_messaging.message_thread WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_messaging.message_thread WHERE patient_ref = $1`, [
        patientRef
      ]);
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

  it("starts a thread (gated non-encounter send), keeping subject and body out of events", async () => {
    const { patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "start-consent");

    const ctx = safeContext("start");
    const outcome = await startMessageThread(msg, {
      subject: SENTINEL_SUBJECT,
      body: SENTINEL_BODY,
      access: patientAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: ctx
    });
    expect(outcome.status).toBe("started");
    const threadId = outcome.status === "started" ? outcome.threadId : "";

    const thread = await loadMessageThread(client, threadId);
    expect(thread).toMatchObject({ status: "open", subject: SENTINEL_SUBJECT });
    expect(thread?.messages).toHaveLength(1);
    expect(thread?.messages[0]?.body).toBe(SENTINEL_BODY);

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("MessageThreadStarted");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");
    const audit = await client.query(
      `SELECT safe_details::text AS details FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0].details).not.toContain("SENSITIVE");
  });

  it("denies starting a thread without consent", async () => {
    const { patientRef, organizationRef } = newSubjects();
    const outcome = await startThread(patientRef, organizationRef, "deny-start");
    expect(outcome.status).toBe("denied");
  });

  it("posts a reply, marks it read, and closes the thread", async () => {
    const { patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "flow-consent");
    const started = await startThread(patientRef, organizationRef, "flow-start");
    const threadId = started.status === "started" ? started.threadId : "";

    const ctx = safeContext("flow-post");
    const posted = await postMessage(msg, {
      threadId,
      body: SENTINEL_BODY,
      access: patientAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: ctx
    });
    expect(posted.status).toBe("posted");
    const messageId = posted.status === "posted" ? posted.messageId : "";
    expect((await loadMessageThread(client, threadId))?.messages).toHaveLength(2);

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("MessagePosted");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");

    const read = await markMessageAsRead(msg, {
      messageId,
      readByRef: randomUUID(),
      actor: patientActor(patientRef),
      safeContext: safeContext("flow-read")
    });
    expect(read.status).toBe("read");
    // Idempotent: a second mark-read is a no-op.
    const readAgain = await markMessageAsRead(msg, {
      messageId,
      readByRef: randomUUID(),
      actor: patientActor(patientRef),
      safeContext: safeContext("flow-read-2")
    });
    expect(readAgain.status).toBe("already-read");

    const closed = await closeMessageThread(msg, {
      threadId,
      actor: patientActor(patientRef),
      safeContext: safeContext("flow-close")
    });
    expect(closed.status).toBe("closed");

    // Posting to a closed thread is refused.
    const afterClose = await postMessage(msg, {
      threadId,
      body: "late reply",
      access: patientAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: safeContext("flow-post-closed")
    });
    expect(afterClose.status).toBe("thread-closed");
  });

  it("governs a thread read and propagates consent withdrawal", async () => {
    const { patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "read-consent");
    const started = await startThread(patientRef, organizationRef, "read-start");
    const threadId = started.status === "started" ? started.threadId : "";

    const allowed = await readMessageThread(msg, {
      threadId,
      access: patientAccess(patientRef, organizationRef)
    });
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      expect(allowed.thread.messages[0]?.body).toBe(SENTINEL_BODY);
    }

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-withdraw")
    });

    const denied = await readMessageThread(msg, {
      threadId,
      access: patientAccess(patientRef, organizationRef)
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("thread");
  });
});
