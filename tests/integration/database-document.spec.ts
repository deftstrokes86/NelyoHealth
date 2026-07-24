import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  loadDocument
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  archiveDocument,
  createPgDocumentServiceDeps,
  readDocument,
  registerDocument,
  type DocumentAccessContext
} from "../../apps/api/src/document-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_TITLE = "SENSITIVE oncology discharge summary";
const SENTINEL_KEY = "SENSITIVE-KEY s3://phi-bucket/patients/abc/discharge.pdf";

/**
 * M5.8 document persistence + lifecycle + full-pipeline governance against live
 * Postgres. Proves atomic commands, no title/storage-key in events, decide-before-
 * write registration (non-encounter) + a decide-before-load read that gates the
 * storage pointer, wired to real persisted consent, and consent-withdrawal
 * propagation.
 */
describe.skipIf(!shouldRun)("document persistence + lifecycle + access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const docs = createPgDocumentServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);

  const run = `doc-${Date.now()}`;
  const patientRefs: string[] = [];
  const correlationIds: string[] = [];

  function safeContext(tag: string) {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      requestId: `req-${run}-${tag}`,
      correlationId,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "document.document.register"
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

  function patientAccess(patientRef: string, organizationRef: string): DocumentAccessContext {
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

  async function register(patientRef: string, organizationRef: string, tag: string) {
    return registerDocument(docs, {
      documentType: "insurance-card",
      title: SENTINEL_TITLE,
      storageKey: SENTINEL_KEY,
      contentType: "application/pdf",
      sizeBytes: 204800,
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
      await client.query(`DELETE FROM nelyo_document.document WHERE patient_ref = $1`, [
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

  it("registers a document (gated non-encounter upload), keeping title and storage key out of events", async () => {
    const { patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "reg-consent");

    const ctx = safeContext("register");
    const outcome = await registerDocument(docs, {
      documentType: "lab-report",
      title: SENTINEL_TITLE,
      storageKey: SENTINEL_KEY,
      contentType: "application/pdf",
      sizeBytes: 512000,
      access: patientAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: ctx
    });
    expect(outcome.status).toBe("registered");
    const documentId = outcome.status === "registered" ? outcome.documentId : "";

    const doc = await loadDocument(client, documentId);
    expect(doc).toMatchObject({ status: "active", documentType: "lab-report", sizeBytes: 512000 });
    expect(doc?.title).toBe(SENTINEL_TITLE);
    expect(doc?.storageKey).toBe(SENTINEL_KEY);

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("DocumentRegistered");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");
    const audit = await client.query(
      `SELECT safe_details::text AS details FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0].details).not.toContain("SENSITIVE");
  });

  it("denies registering a document without consent", async () => {
    const { patientRef, organizationRef } = newSubjects();
    const outcome = await register(patientRef, organizationRef, "deny-reg");
    expect(outcome.status).toBe("denied");
  });

  it("archives a document (idempotent)", async () => {
    const { patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "arch-consent");
    const registered = await register(patientRef, organizationRef, "arch-reg");
    const documentId = registered.status === "registered" ? registered.documentId : "";

    const archived = await archiveDocument(docs, {
      documentId,
      actor: patientActor(patientRef),
      safeContext: safeContext("arch")
    });
    expect(archived.status).toBe("archived");
    expect((await loadDocument(client, documentId))?.status).toBe("archived");

    const again = await archiveDocument(docs, {
      documentId,
      actor: patientActor(patientRef),
      safeContext: safeContext("arch-2")
    });
    expect(again.status).toBe("already-archived");
  });

  it("governs a document read (gating the storage pointer) and propagates consent withdrawal", async () => {
    const { patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "read-consent");
    const registered = await register(patientRef, organizationRef, "read-reg");
    const documentId = registered.status === "registered" ? registered.documentId : "";

    const allowed = await readDocument(docs, {
      documentId,
      access: patientAccess(patientRef, organizationRef)
    });
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      // The storage pointer is only surfaced on an authorized read.
      expect(allowed.document.storageKey).toBe(SENTINEL_KEY);
    }

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-withdraw")
    });

    const denied = await readDocument(docs, {
      documentId,
      access: patientAccess(patientRef, organizationRef)
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("document");
  });
});
