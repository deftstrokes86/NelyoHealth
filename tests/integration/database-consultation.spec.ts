import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  loadConsultation
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  addConsultationParticipant,
  cancelConsultation,
  completeConsultation,
  createPgConsultationServiceDeps,
  readConsultation,
  scheduleConsultation,
  startConsultation,
  type ConsultationAccessContext
} from "../../apps/api/src/consultation-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_COMPLAINT = "SENSITIVE crushing chest pain radiating to the left arm";
const SENTINEL_NOTES = "SENSITIVE-NOTES suspected myocardial infarction; ECG ordered";

/**
 * M5.3 consultation persistence + lifecycle + full-pipeline governance against
 * live Postgres. Proves atomic commands, no chief-complaint / clinical-notes in
 * events, decide-before-write start + decide-before-load read wired to real
 * persisted consent, and consent-withdrawal propagation.
 */
describe.skipIf(!shouldRun)("consultation persistence + lifecycle + access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const cons = createPgConsultationServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);

  const run = `cons-${Date.now()}`;
  const patientRefs: string[] = [];
  const correlationIds: string[] = [];

  const staffActor = {
    accountRef: "org-admin-1",
    personaKind: "staff",
    actorRole: "organization-admin",
    tenantRef: null
  } as const;

  function safeContext(tag: string) {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      requestId: `req-${run}-${tag}`,
      correlationId,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "consultation.encounter.schedule"
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

  function clinicianAccess(
    clinicianRef: string,
    patientRef: string,
    organizationRef: string
  ): ConsultationAccessContext {
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
      activeEncounter: true,
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

  async function schedule(
    clinicianRef: string,
    patientRef: string,
    organizationRef: string,
    tag: string,
    chiefComplaint?: string
  ) {
    const scheduled = await scheduleConsultation(cons, {
      patientRef,
      clinicianRef,
      organizationRef,
      modality: "telemedicine",
      scheduledStart: "2026-08-10T09:00:00.000Z",
      chiefComplaint,
      actor: staffActor,
      safeContext: safeContext(tag)
    });
    return scheduled.consultationId;
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
        `DELETE FROM nelyo_consultation.consultation_participant WHERE consultation_id IN
           (SELECT consultation_id FROM nelyo_consultation.consultation WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_consultation.consultation WHERE patient_ref = $1`, [
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

  it("schedules a consultation, keeping the chief complaint out of events and audit", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    const ctx = safeContext("sched");
    const scheduled = await scheduleConsultation(cons, {
      patientRef,
      clinicianRef,
      organizationRef,
      modality: "telemedicine",
      chiefComplaint: SENTINEL_COMPLAINT,
      actor: staffActor,
      safeContext: ctx
    });
    expect(scheduled.status).toBe("scheduled");

    const consultation = await loadConsultation(client, scheduled.consultationId);
    expect(consultation?.chiefComplaint).toBe(SENTINEL_COMPLAINT);
    expect(consultation?.status).toBe("scheduled");

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("ConsultationScheduled");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");
    const audit = await client.query(
      `SELECT safe_details::text AS details FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0].details).not.toContain("SENSITIVE");
  });

  it("gates start with decide-before-write: denies without consent, allows with consent", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    const consultationId = await schedule(clinicianRef, patientRef, organizationRef, "start-sched");

    // No consent yet -> denied, and the consultation stays scheduled.
    const denied = await startConsultation(cons, {
      consultationId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef),
      actor: staffActor,
      safeContext: safeContext("start-deny")
    });
    expect(denied.status).toBe("denied");
    expect((await loadConsultation(client, consultationId))?.status).toBe("scheduled");

    await grantBaselineConsent(patientRef, organizationRef, "start-consent");
    const started = await startConsultation(cons, {
      consultationId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef),
      actor: staffActor,
      safeContext: safeContext("start-ok")
    });
    expect(started.status).toBe("started");
    expect((await loadConsultation(client, consultationId))?.status).toBe("in-progress");
  });

  it("adds a participant and completes recording notes without leaking them", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "flow-consent");
    const consultationId = await schedule(clinicianRef, patientRef, organizationRef, "flow-sched");
    await startConsultation(cons, {
      consultationId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef),
      actor: staffActor,
      safeContext: safeContext("flow-start")
    });

    const interpreterRef = randomUUID();
    const added = await addConsultationParticipant(cons, {
      consultationId,
      participantRef: interpreterRef,
      role: "interpreter",
      actor: staffActor,
      safeContext: safeContext("flow-participant")
    });
    expect(added.status).toBe("added");

    const ctx = safeContext("flow-complete");
    const completed = await completeConsultation(cons, {
      consultationId,
      clinicalNotes: SENTINEL_NOTES,
      actor: staffActor,
      safeContext: ctx
    });
    expect(completed.status).toBe("completed");

    const consultation = await loadConsultation(client, consultationId);
    expect(consultation?.status).toBe("completed");
    expect(consultation?.clinicalNotes).toBe(SENTINEL_NOTES);
    expect(consultation?.participants).toEqual([
      { participantRef: interpreterRef, role: "interpreter", joinedAt: undefined }
    ]);

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("ConsultationCompleted");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE-NOTES");
  });

  it("governs a consultation read and propagates consent withdrawal", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "read-consent");
    const consultationId = await schedule(
      clinicianRef,
      patientRef,
      organizationRef,
      "read-sched",
      SENTINEL_COMPLAINT
    );

    const allowed = await readConsultation(cons, {
      consultationId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef)
    });
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      expect(allowed.consultation.chiefComplaint).toBe(SENTINEL_COMPLAINT);
    }

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-withdraw")
    });

    const denied = await readConsultation(cons, {
      consultationId,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef)
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("consultation");
  });

  it("cancels a consultation and rejects invalid transitions", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    const consultationId = await schedule(
      clinicianRef,
      patientRef,
      organizationRef,
      "cancel-sched"
    );

    const cancelled = await cancelConsultation(cons, {
      consultationId,
      cancellationReasonCode: "patient-request",
      actor: staffActor,
      safeContext: safeContext("cancel")
    });
    expect(cancelled.status).toBe("cancelled");
    expect((await loadConsultation(client, consultationId))?.status).toBe("cancelled");

    // Cancelled is terminal: completing is an invalid transition.
    const invalid = await completeConsultation(cons, {
      consultationId,
      actor: staffActor,
      safeContext: safeContext("cancel-invalid")
    });
    expect(invalid.status).toBe("invalid-transition");
  });
});
