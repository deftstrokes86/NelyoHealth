import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDatabaseClient, createDatabasePool, loadPrescription } from "../../packages/database/src/index.js";
import { createPgConsentServiceDeps, grantConsent, withdrawConsent } from "../../apps/api/src/consent-service.js";
import {
  cancelPrescription,
  createPgPrescriptionServiceDeps,
  dispensePrescription,
  prescribeMedication,
  readPrescription,
  type PrescriptionAccessContext
} from "../../apps/api/src/prescription-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_MED = "SENSITIVE oxycodone 5mg tablet";
const SENTINEL_INDICATION = "SENSITIVE-INDICATION post-operative pain management";

/**
 * M5.5 prescription persistence + lifecycle + full-pipeline governance against
 * live Postgres. Proves atomic commands, no medication/indication in events,
 * conflict-free dispensing with refill exhaustion, decide-before-write prescribing
 * (encounter-required) + decide-before-load reads wired to real persisted consent,
 * and consent-withdrawal propagation.
 */
describe.skipIf(!shouldRun)("prescription persistence + lifecycle + access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const rx = createPgPrescriptionServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);

  const run = `rx-${Date.now()}`;
  const patientRefs: string[] = [];
  const correlationIds: string[] = [];

  const pharmacyActor = {
    accountRef: "pharmacy-1",
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
      operationTag: "prescription.rx.prescribe"
    };
  }

  function patientActor(patientRef: string) {
    return { accountRef: patientRef, personaKind: "personal", actorRole: "patient", tenantRef: null } as const;
  }

  function clinicianActor(clinicianRef: string) {
    return { accountRef: clinicianRef, personaKind: "staff", actorRole: "clinician", tenantRef: null } as const;
  }

  function clinicianAccess(
    clinicianRef: string,
    patientRef: string,
    organizationRef: string,
    activeEncounter = true
  ): PrescriptionAccessContext {
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

  async function prescribe(
    clinicianRef: string,
    patientRef: string,
    organizationRef: string,
    tag: string,
    refillsAuthorized = 1
  ) {
    const outcome = await prescribeMedication(rx, {
      medicationName: SENTINEL_MED,
      dosageInstructions: "take one tablet every 6 hours as needed",
      indication: SENTINEL_INDICATION,
      refillsAuthorized,
      controlledSchedule: "II",
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: clinicianActor(clinicianRef),
      safeContext: safeContext(tag)
    });
    return outcome;
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
        `DELETE FROM nelyo_prescription.prescription_dispense WHERE prescription_ref IN
           (SELECT prescription_id FROM nelyo_prescription.prescription WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_prescription.prescription WHERE patient_ref = $1`, [
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

  it("prescribes during an encounter (gated), keeping medication and indication out of events", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "rx-consent");

    const ctx = safeContext("prescribe");
    const outcome = await prescribeMedication(rx, {
      medicationName: SENTINEL_MED,
      dosageInstructions: "take one tablet every 6 hours",
      indication: SENTINEL_INDICATION,
      refillsAuthorized: 1,
      controlledSchedule: "II",
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: clinicianActor(clinicianRef),
      safeContext: ctx
    });
    expect(outcome.status).toBe("issued");
    const prescriptionId = outcome.status === "issued" ? outcome.prescriptionId : "";

    const prescription = await loadPrescription(client, prescriptionId);
    expect(prescription).toMatchObject({ status: "active", refillsRemaining: 1 });
    expect(prescription?.medicationName).toBe(SENTINEL_MED);
    expect(prescription?.indication).toBe(SENTINEL_INDICATION);

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("PrescriptionIssued");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");
    const audit = await client.query(
      `SELECT safe_details::text AS details FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0].details).not.toContain("SENSITIVE");
  });

  it("denies prescribing without consent and without an active encounter", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();

    const noConsent = await prescribe(clinicianRef, patientRef, organizationRef, "deny-noconsent");
    expect(noConsent.status).toBe("denied");

    await grantBaselineConsent(patientRef, organizationRef, "deny-consent");
    const noEncounter = await prescribeMedication(rx, {
      medicationName: SENTINEL_MED,
      dosageInstructions: "x",
      refillsAuthorized: 1,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, false),
      actor: clinicianActor(clinicianRef),
      safeContext: safeContext("deny-noencounter")
    });
    expect(noEncounter.status).toBe("denied");
    if (noEncounter.status === "denied") {
      expect(noEncounter.decision.reasonCode).toBe("abac-encounter-required");
    }
  });

  it("dispenses fills conflict-free until refills are exhausted", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "disp-consent");
    const issued = await prescribe(clinicianRef, patientRef, organizationRef, "disp-rx", 2);
    const prescriptionId = issued.status === "issued" ? issued.prescriptionId : "";

    const first = await dispensePrescription(rx, {
      prescriptionId,
      dispensedByRef: randomUUID(),
      actor: pharmacyActor,
      safeContext: safeContext("disp-1")
    });
    expect(first).toMatchObject({ status: "dispensed", refillsRemaining: 1, prescriptionStatus: "active" });

    const second = await dispensePrescription(rx, {
      prescriptionId,
      dispensedByRef: randomUUID(),
      actor: pharmacyActor,
      safeContext: safeContext("disp-2")
    });
    expect(second).toMatchObject({ status: "dispensed", refillsRemaining: 0, prescriptionStatus: "completed" });

    // Exhausted -> refused.
    const third = await dispensePrescription(rx, {
      prescriptionId,
      dispensedByRef: randomUUID(),
      actor: pharmacyActor,
      safeContext: safeContext("disp-3")
    });
    expect(third.status).toBe("not-dispensable");

    const prescription = await loadPrescription(client, prescriptionId);
    expect(prescription?.status).toBe("completed");
    expect(prescription?.dispenses).toHaveLength(2);
  });

  it("cancels a prescription and refuses dispensing a cancelled one", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "cancel-consent");
    const issued = await prescribe(clinicianRef, patientRef, organizationRef, "cancel-rx", 3);
    const prescriptionId = issued.status === "issued" ? issued.prescriptionId : "";

    const cancelled = await cancelPrescription(rx, {
      prescriptionId,
      cancellationReasonCode: "prescriber-error",
      actor: clinicianActor(clinicianRef),
      safeContext: safeContext("cancel")
    });
    expect(cancelled.status).toBe("cancelled");
    expect((await loadPrescription(client, prescriptionId))?.status).toBe("cancelled");

    const dispense = await dispensePrescription(rx, {
      prescriptionId,
      dispensedByRef: randomUUID(),
      actor: pharmacyActor,
      safeContext: safeContext("cancel-disp")
    });
    expect(dispense.status).toBe("not-dispensable");
  });

  it("governs a prescription read and propagates consent withdrawal", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "read-consent");
    const issued = await prescribe(clinicianRef, patientRef, organizationRef, "read-rx");
    const prescriptionId = issued.status === "issued" ? issued.prescriptionId : "";

    const allowed = await readPrescription(rx, {
      prescriptionId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef)
    });
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      expect(allowed.prescription.medicationName).toBe(SENTINEL_MED);
    }

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-withdraw")
    });

    const denied = await readPrescription(rx, {
      prescriptionId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef)
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("prescription");
  });
});
