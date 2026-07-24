import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  loadMedicalRecordEntry
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  addMedicalRecordEntry,
  amendMedicalRecordEntry,
  createPgMedicalRecordServiceDeps,
  openMedicalRecord,
  readMedicalRecord,
  voidMedicalRecordEntry,
  type MedicalRecordAccessContext
} from "../../apps/api/src/medical-record-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_CONTENT = "SENSITIVE penicillin anaphylaxis reaction";
const SENTINEL_CODE = "SENSITIVE-CODE Z88.0";

/**
 * M5.4 medical-record persistence + full-pipeline governance against live
 * Postgres. Proves atomic append-only entries, no clinical content/code in
 * events, database-enforced content immutability, decide-before-write clinical
 * writes (encounter-required) + decide-before-load reads wired to real persisted
 * consent, and consent-withdrawal propagation.
 */
describe.skipIf(!shouldRun)("medical-record persistence + append-only entries + access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const mr = createPgMedicalRecordServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);

  const run = `mr-${Date.now()}`;
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
      operationTag: "medical-record.entry.add"
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
    organizationRef: string,
    activeEncounter = true
  ): MedicalRecordAccessContext {
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

  async function openRecord(patientRef: string, organizationRef: string, tag: string) {
    await openMedicalRecord(mr, {
      patientRef,
      organizationRef,
      actor: staffActor,
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
        `DELETE FROM nelyo_medical_record.medical_record_entry WHERE record_id IN
           (SELECT record_id FROM nelyo_medical_record.medical_record WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_medical_record.medical_record WHERE patient_ref = $1`, [
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

  it("appends a clinical entry (gated write during an encounter), keeping content and code out of events", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await openRecord(patientRef, organizationRef, "add-open");
    await grantBaselineConsent(patientRef, organizationRef, "add-consent");

    const ctx = safeContext("add");
    const added = await addMedicalRecordEntry(mr, {
      entryType: "allergy",
      codeSystem: "ICD-10",
      code: SENTINEL_CODE,
      clinicalContent: SENTINEL_CONTENT,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: staffActor,
      safeContext: ctx
    });
    expect(added.status).toBe("added");
    const entryId = added.status === "added" ? added.entryId : "";

    const entry = await loadMedicalRecordEntry(client, entryId);
    expect(entry).toMatchObject({
      entryType: "allergy",
      status: "active",
      authorRef: clinicianRef
    });
    expect(entry?.clinicalContent).toBe(SENTINEL_CONTENT);
    expect(entry?.code).toBe(SENTINEL_CODE);

    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("MedicalRecordEntryAdded");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");
    const audit = await client.query(
      `SELECT safe_details::text AS details FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0].details).not.toContain("SENSITIVE");
  });

  it("denies a clinical write without an active encounter, and without consent", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await openRecord(patientRef, organizationRef, "deny-open");

    // No consent -> denied.
    const noConsent = await addMedicalRecordEntry(mr, {
      entryType: "note",
      clinicalContent: "x",
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: staffActor,
      safeContext: safeContext("deny-noconsent")
    });
    expect(noConsent.status).toBe("denied");

    // Consent but no active encounter -> denied (encounter-required).
    await grantBaselineConsent(patientRef, organizationRef, "deny-consent");
    const noEncounter = await addMedicalRecordEntry(mr, {
      entryType: "note",
      clinicalContent: "x",
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, false),
      actor: staffActor,
      safeContext: safeContext("deny-noencounter")
    });
    expect(noEncounter.status).toBe("denied");
    if (noEncounter.status === "denied") {
      expect(noEncounter.decision.reasonCode).toBe("abac-encounter-required");
    }
  });

  it("enforces clinical-content immutability at the database", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await openRecord(patientRef, organizationRef, "imm-open");
    await grantBaselineConsent(patientRef, organizationRef, "imm-consent");
    const added = await addMedicalRecordEntry(mr, {
      entryType: "diagnosis",
      clinicalContent: SENTINEL_CONTENT,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: staffActor,
      safeContext: safeContext("imm-add")
    });
    const entryId = added.status === "added" ? added.entryId : "";

    await expect(
      client.query(
        `UPDATE nelyo_medical_record.medical_record_entry SET clinical_content = 'rewritten' WHERE entry_id = $1`,
        [entryId]
      )
    ).rejects.toThrow(/clinical content is immutable/);

    // Status transitions are allowed (corrections).
    await client.query(
      `UPDATE nelyo_medical_record.medical_record_entry SET status = 'resolved', updated_at = NOW() WHERE entry_id = $1`,
      [entryId]
    );
    expect((await loadMedicalRecordEntry(client, entryId))?.status).toBe("resolved");
  });

  it("amends an entry by appending a superseding entry (append-only)", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await openRecord(patientRef, organizationRef, "amend-open");
    await grantBaselineConsent(patientRef, organizationRef, "amend-consent");
    const added = await addMedicalRecordEntry(mr, {
      entryType: "diagnosis",
      clinicalContent: SENTINEL_CONTENT,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: staffActor,
      safeContext: safeContext("amend-add")
    });
    const priorId = added.status === "added" ? added.entryId : "";

    const amended = await amendMedicalRecordEntry(mr, {
      entryId: priorId,
      clinicalContent: "corrected diagnosis narrative",
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: staffActor,
      safeContext: safeContext("amend")
    });
    expect(amended.status).toBe("amended");

    // Prior entry preserved but marked amended; the new entry supersedes it.
    const prior = await loadMedicalRecordEntry(client, priorId);
    expect(prior?.status).toBe("amended");
    expect(prior?.clinicalContent).toBe(SENTINEL_CONTENT);
    if (amended.status === "amended") {
      const next = await loadMedicalRecordEntry(client, amended.entryId);
      expect(next).toMatchObject({ status: "active", supersedesEntryRef: priorId });
      expect(next?.clinicalContent).toBe("corrected diagnosis narrative");
    }
  });

  it("voids an entry (entered-in-error), preserving its content", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await openRecord(patientRef, organizationRef, "void-open");
    await grantBaselineConsent(patientRef, organizationRef, "void-consent");
    const added = await addMedicalRecordEntry(mr, {
      entryType: "medication",
      clinicalContent: SENTINEL_CONTENT,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: staffActor,
      safeContext: safeContext("void-add")
    });
    const entryId = added.status === "added" ? added.entryId : "";

    const voided = await voidMedicalRecordEntry(mr, {
      entryId,
      reasonCode: "duplicate-entry",
      actor: staffActor,
      safeContext: safeContext("void")
    });
    expect(voided.status).toBe("voided");
    const entry = await loadMedicalRecordEntry(client, entryId);
    expect(entry?.status).toBe("entered-in-error");
    expect(entry?.clinicalContent).toBe(SENTINEL_CONTENT);
  });

  it("governs a record read and propagates consent withdrawal", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await openRecord(patientRef, organizationRef, "read-open");
    await grantBaselineConsent(patientRef, organizationRef, "read-consent");
    await addMedicalRecordEntry(mr, {
      entryType: "problem",
      clinicalContent: SENTINEL_CONTENT,
      access: clinicianAccess(clinicianRef, patientRef, organizationRef, true),
      actor: staffActor,
      safeContext: safeContext("read-add")
    });

    const allowed = await readMedicalRecord(mr, {
      access: clinicianAccess(clinicianRef, patientRef, organizationRef)
    });
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      expect(allowed.record.entries[0]?.clinicalContent).toBe(SENTINEL_CONTENT);
    }

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-withdraw")
    });

    const denied = await readMedicalRecord(mr, {
      access: clinicianAccess(clinicianRef, patientRef, organizationRef)
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("record");
  });
});
