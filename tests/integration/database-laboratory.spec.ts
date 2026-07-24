import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  loadLabOrder
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  cancelLabOrder,
  createPgLaboratoryServiceDeps,
  orderLabTest,
  readLabOrder,
  recordLabResult,
  type LabOrderAccessContext
} from "../../apps/api/src/laboratory-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_TEST = "SENSITIVE Complete Blood Count with differential";
const SENTINEL_VALUE = "SENSITIVE-VALUE 2.1 critically low";

/**
 * M5.6 laboratory persistence + lifecycle + full-pipeline governance against live
 * Postgres. Proves atomic commands, no test/value/interpretation in events,
 * decide-before-write ordering (encounter-required) + decide-before-load reads
 * wired to real persisted consent, and consent-withdrawal propagation.
 */
describe.skipIf(!shouldRun)("laboratory persistence + lifecycle + access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const lab = createPgLaboratoryServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);

  const run = `lab-${Date.now()}`;
  const patientRefs: string[] = [];
  const correlationIds: string[] = [];

  const labActor = {
    accountRef: "lab-tech-1",
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
      operationTag: "laboratory.order.place"
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

  function clinicianActor(clinicianRef: string) {
    return {
      accountRef: clinicianRef,
      personaKind: "staff",
      actorRole: "clinician",
      tenantRef: null
    } as const;
  }

  function clinicianAccess(
    clinicianRef: string,
    patientRef: string,
    organizationRef: string,
    activeEncounter = true
  ): LabOrderAccessContext {
    return {
      decisionRequestId: `dr-${run}`,
      actorId: clinicianRef,
      actorRole: "clinician",
      actorType: "clinician",
      patientId: patientRef,
      organizationId: organizationRef,
      purpose: "care-delivery",
      requiresRelationship: false,
      relationshipType: "none",
      requestedConsentDomains: [],
      sessionStatus: "active",
      sameTenant: true,
      emergencyStatus: "none",
      activeEncounter,
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

  async function order(
    clinicianRef: string,
    patientRef: string,
    organizationRef: string,
    tag: string,
    activeEncounter = true
  ) {
    return orderLabTest(lab, {
      testName: SENTINEL_TEST,
      testCode: "58410-2",
      priority: "routine",
      clinicalReason: "anemia workup",
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, activeEncounter),
      actor: clinicianActor(clinicianRef),
      safeContext: safeContext(tag)
    });
  }

  function newSubjects() {
    const clinicianRef = randomUUID();
    const patientRef = randomUUID();
    const organizationRef = randomUUID();
    patientRefs.push(patientRef);
    return { clinicianRef, patientRef, organizationRef };
  }

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const patientRef of patientRefs) {
      await client.query(
        `DELETE FROM nelyo_laboratory.lab_result_observation WHERE order_ref IN
           (SELECT order_id FROM nelyo_laboratory.lab_order WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_laboratory.lab_order WHERE patient_ref = $1`, [
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

  it("orders a lab during an encounter (gated), keeping test details out of events", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "order-consent");

    const ctx = safeContext("order");
    const outcome = await orderLabTest(lab, {
      testName: SENTINEL_TEST,
      testCode: "58410-2",
      priority: "urgent",
      clinicalReason: "anemia workup",
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: clinicianActor(clinicianRef),
      safeContext: ctx
    });
    expect(outcome.status).toBe("ordered");
    const orderId = outcome.status === "ordered" ? outcome.orderId : "";

    const persisted = await loadLabOrder(client, orderId);
    expect(persisted).toMatchObject({ status: "ordered", priority: "urgent" });
    expect(persisted?.testName).toBe(SENTINEL_TEST);

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("LabOrderPlaced");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");
    const audit = await client.query(
      `SELECT safe_details::text AS details FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0].details).not.toContain("SENSITIVE");
  });

  it("denies ordering without consent and without an active encounter", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();

    const noConsent = await order(clinicianRef, patientRef, organizationRef, "deny-noconsent");
    expect(noConsent.status).toBe("denied");

    await grantBaselineConsent(patientRef, organizationRef, "deny-consent");
    const noEncounter = await order(
      clinicianRef,
      patientRef,
      organizationRef,
      "deny-noencounter",
      false
    );
    expect(noEncounter.status).toBe("denied");
    if (noEncounter.status === "denied") {
      expect(noEncounter.decision.reasonCode).toBe("abac-encounter-required");
    }
  });

  it("reports result observations without leaking values, moving the order to resulted", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "result-consent");
    const ordered = await order(clinicianRef, patientRef, organizationRef, "result-order");
    const orderId = ordered.status === "ordered" ? ordered.orderId : "";

    const ctx = safeContext("result");
    const reported = await recordLabResult(lab, {
      orderId,
      analyteName: "Hemoglobin",
      value: SENTINEL_VALUE,
      unit: "g/dL",
      referenceRange: "12.0-16.0",
      interpretation: "critical",
      resultedByRef: randomUUID(),
      actor: labActor,
      safeContext: ctx
    });
    expect(reported.status).toBe("reported");

    const persisted = await loadLabOrder(client, orderId);
    expect(persisted?.status).toBe("resulted");
    expect(persisted?.observations).toHaveLength(1);
    expect(persisted?.observations[0]).toMatchObject({
      analyteName: "Hemoglobin",
      value: SENTINEL_VALUE
    });

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("LabResultReported");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE-VALUE");

    // A panel can report more observations.
    await recordLabResult(lab, {
      orderId,
      analyteName: "Hematocrit",
      value: "28%",
      resultedByRef: randomUUID(),
      actor: labActor,
      safeContext: safeContext("result-2")
    });
    expect((await loadLabOrder(client, orderId))?.observations).toHaveLength(2);
  });

  it("cancels an order before results and refuses cancelling once resulted", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "cancel-consent");
    const ordered = await order(clinicianRef, patientRef, organizationRef, "cancel-order");
    const orderId = ordered.status === "ordered" ? ordered.orderId : "";

    const cancelled = await cancelLabOrder(lab, {
      orderId,
      cancellationReasonCode: "duplicate-order",
      actor: clinicianActor(clinicianRef),
      safeContext: safeContext("cancel")
    });
    expect(cancelled.status).toBe("cancelled");
    expect((await loadLabOrder(client, orderId))?.status).toBe("cancelled");

    // Cannot report results against a cancelled order.
    const result = await recordLabResult(lab, {
      orderId,
      analyteName: "Hemoglobin",
      value: "x",
      resultedByRef: randomUUID(),
      actor: labActor,
      safeContext: safeContext("cancel-result")
    });
    expect(result.status).toBe("not-resultable");
  });

  it("governs a lab-order read and propagates consent withdrawal", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "read-consent");
    const ordered = await order(clinicianRef, patientRef, organizationRef, "read-order");
    const orderId = ordered.status === "ordered" ? ordered.orderId : "";

    const allowed = await readLabOrder(lab, {
      orderId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef)
    });
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      expect(allowed.order.testName).toBe(SENTINEL_TEST);
    }

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-withdraw")
    });

    const denied = await readLabOrder(lab, {
      orderId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef)
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("order");
  });
});
