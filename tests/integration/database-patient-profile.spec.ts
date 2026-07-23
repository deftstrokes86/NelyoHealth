import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  loadPatientProfile
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  createPgRelationshipServiceDeps,
  establishRelationship
} from "../../apps/api/src/relationship-service.js";
import {
  activateBreakGlassAccess,
  createPgBreakGlassServiceDeps,
  requestBreakGlassAccess
} from "../../apps/api/src/break-glass-service.js";
import {
  createPatientProfile,
  createPgPatientProfileServiceDeps,
  findPatientByIdentifier,
  readPatientProfile,
  updatePatientProfile,
  type PatientProfileAccessRequest
} from "../../apps/api/src/patient-profile-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_NAME = "SENTINEL Jane Preferred";
const SENTINEL_MRN = "SENSITIVE-MRN-000123";

/**
 * M5.1 patient-profile persistence + full-pipeline governance against live
 * Postgres. Proves:
 *  - create / update run as transactional commands (state + event + audit);
 *  - demographics and identifier values NEVER appear in an event or audit detail;
 *  - a medical identifier is unique within an organization;
 *  - a profile READ is governed by the composed pipeline built from REAL
 *    persisted consent (M4.1), relationship (M4.2), and break-glass (M4.3), and a
 *    consent withdrawal propagates to the very next read.
 */
describe.skipIf(!shouldRun)("patient-profile persistence + full-pipeline access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const profileDeps = createPgPatientProfileServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);
  const relationshipDeps = createPgRelationshipServiceDeps(pool);
  const breakGlassDeps = createPgBreakGlassServiceDeps(pool);

  const run = `pp-${Date.now()}`;
  const personRefs: string[] = [];
  const patientRefs: string[] = [];
  const actorRefs: string[] = [];
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
      operationTag: "patient.profile.create"
    };
  }

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const personRef of personRefs) {
      await client.query(
        `DELETE FROM nelyo_patient.patient_identifier WHERE patient_id IN
           (SELECT patient_id FROM nelyo_patient.patient_profile WHERE person_ref = $1)`,
        [personRef]
      );
      await client.query(`DELETE FROM nelyo_patient.patient_profile WHERE person_ref = $1`, [
        personRef
      ]);
    }
    for (const patientRef of patientRefs) {
      await client.query(
        `DELETE FROM nelyo_consent.consent_version WHERE consent_id IN
           (SELECT consent_id FROM nelyo_consent.consent_record WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_consent.consent_record WHERE patient_ref = $1`, [
        patientRef
      ]);
      await client.query(`DELETE FROM nelyo_relationship.relationship WHERE patient_ref = $1`, [
        patientRef
      ]);
      await client.query(
        `DELETE FROM nelyo_break_glass.break_glass_access WHERE patient_ref = $1`,
        [patientRef]
      );
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

  it("creates a profile as a transactional command, keeping demographics out of events and audit", async () => {
    const personRef = randomUUID();
    personRefs.push(personRef);
    const organizationRef = randomUUID();
    const ctx = safeContext("create");

    const outcome = await createPatientProfile(profileDeps, {
      personRef,
      organizationRef,
      preferredName: SENTINEL_NAME,
      biologicalSex: "female",
      preferredLanguage: "en",
      contactPoints: [{ kind: "phone", value: "+15551230000", isPrimary: true }],
      emergencyContacts: [{ name: "Kin", relationshipLabel: "sister", phone: "+15559990000" }],
      identifiers: [{ system: "mrn", value: SENTINEL_MRN, assigningAuthority: "org-1" }],
      actor: staffActor,
      safeContext: ctx
    });
    expect(outcome.status).toBe("created");
    const patientId = outcome.status === "created" ? outcome.patientId : "";
    patientRefs.push(patientId);

    // Persisted profile carries the demographics + identifiers...
    const profile = await loadPatientProfile(client, patientId);
    expect(profile?.preferredName).toBe(SENTINEL_NAME);
    expect(profile?.identifiers).toEqual([
      { system: "mrn", value: SENTINEL_MRN, assigningAuthority: "org-1" }
    ]);
    expect(profile?.contactPoints[0]).toMatchObject({ kind: "phone", isPrimary: true });

    // ...but the event and audit carry references only.
    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("PatientProfileCreated");
    expect(outbox.rows[0].payload).not.toContain("SENTINEL");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE-MRN");

    const audit = await client.query(
      `SELECT command_name, safe_details::text AS details FROM nelyo_foundation.audit_event
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0].command_name).toBe("patient.profile.create");
    expect(audit.rows[0].details).not.toContain("SENTINEL");
    expect(audit.rows[0].details).not.toContain("SENSITIVE-MRN");
  });

  it("updates a profile and emits PatientProfileUpdated", async () => {
    const personRef = randomUUID();
    personRefs.push(personRef);
    const organizationRef = randomUUID();
    const created = await createPatientProfile(profileDeps, {
      personRef,
      organizationRef,
      preferredName: "Before",
      actor: staffActor,
      safeContext: safeContext("upd-create")
    });
    const patientId = created.status === "created" ? created.patientId : "";
    patientRefs.push(patientId);

    const ctx = safeContext("update");
    const updated = await updatePatientProfile(profileDeps, {
      patientId,
      preferredName: "After",
      preferredLanguage: "fr",
      actor: staffActor,
      safeContext: ctx
    });
    expect(updated.status).toBe("updated");

    const profile = await loadPatientProfile(client, patientId);
    expect(profile).toMatchObject({ preferredName: "After", preferredLanguage: "fr" });

    const outbox = await client.query(
      `SELECT event_type FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0]).toMatchObject({ event_type: "PatientProfileUpdated" });
  });

  it("enforces medical-identifier uniqueness within an organization", async () => {
    const organizationRef = randomUUID();
    const personA = randomUUID();
    const personB = randomUUID();
    personRefs.push(personA, personB);

    const a = await createPatientProfile(profileDeps, {
      personRef: personA,
      organizationRef,
      identifiers: [{ system: "mrn", value: "SHARED-MRN-1" }],
      actor: staffActor,
      safeContext: safeContext("uniq-a")
    });
    expect(a.status).toBe("created");
    if (a.status === "created") patientRefs.push(a.patientId);

    // A different person cannot claim the same MRN in the same organization.
    const b = await createPatientProfile(profileDeps, {
      personRef: personB,
      organizationRef,
      identifiers: [{ system: "mrn", value: "SHARED-MRN-1" }],
      actor: staffActor,
      safeContext: safeContext("uniq-b")
    });
    expect(b).toEqual({ status: "rejected", reasonCode: "duplicate-identifier" });

    const found = await findPatientByIdentifier(profileDeps, {
      organizationRef,
      system: "mrn",
      value: "SHARED-MRN-1"
    });
    expect(found).toBe(a.status === "created" ? a.patientId : null);
  });

  it("governs a profile read through the full pipeline and propagates consent withdrawal", async () => {
    const personRef = randomUUID();
    personRefs.push(personRef);
    const organizationRef = randomUUID();
    const guardianRef = randomUUID();
    actorRefs.push(guardianRef);

    const created = await createPatientProfile(profileDeps, {
      personRef,
      organizationRef,
      preferredName: SENTINEL_NAME,
      actor: staffActor,
      safeContext: safeContext("gov-create")
    });
    const patientId = created.status === "created" ? created.patientId : "";
    patientRefs.push(patientId);

    // Real persisted consent (M4.1) + relationship (M4.2).
    await grantConsent(consentDeps, {
      patientRef: patientId,
      organizationRef,
      grantedDomains: ["provider-data-sharing"],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor: {
        accountRef: patientId,
        personaKind: "personal",
        actorRole: "patient",
        tenantRef: null
      },
      safeContext: safeContext("gov-consent")
    });
    await establishRelationship(relationshipDeps, {
      actorRef: guardianRef,
      patientRef: patientId,
      organizationRef,
      relationshipType: "guardian",
      verificationMethod: "legal-document",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      expiryDate: "2027-01-01T00:00:00.000Z",
      permittedActions: ["read"],
      actor: staffActor,
      safeContext: safeContext("gov-rel")
    });

    const guardianRead: PatientProfileAccessRequest = {
      decisionRequestId: "gov-read-1",
      actorId: guardianRef,
      actorRole: "guardian",
      actorType: "guardian",
      patientId,
      organizationId: organizationRef,
      requestedAction: "read",
      purpose: "care-delivery",
      requiresRelationship: true,
      relationshipType: "guardian",
      requestedConsentDomains: ["provider-data-sharing"],
      sessionStatus: "active",
      sameTenant: true,
      emergencyStatus: "none",
      activeEncounter: true,
      evaluatedAt: new Date().toISOString()
    };

    const allowed = await readPatientProfile(profileDeps, guardianRead);
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      expect(allowed.profile.preferredName).toBe(SENTINEL_NAME);
    }

    // Withdraw consent -> the very next read is denied, and returns NO profile.
    await withdrawConsent(consentDeps, {
      patientRef: patientId,
      organizationRef,
      revocationReason: "patient-request",
      actor: {
        accountRef: patientId,
        personaKind: "personal",
        actorRole: "patient",
        tenantRef: null
      },
      safeContext: safeContext("gov-withdraw")
    });

    const denied = await readPatientProfile(profileDeps, {
      ...guardianRead,
      evaluatedAt: new Date().toISOString()
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("profile");
    if (denied.status === "denied") {
      expect(denied.decision.reasonCode).toBe("consent-revoked");
    }
  });

  it("allows a clinician to read via a persisted break-glass grant in an emergency", async () => {
    const personRef = randomUUID();
    personRefs.push(personRef);
    const organizationRef = randomUUID();
    const clinicianRef = randomUUID();
    actorRefs.push(clinicianRef);

    const created = await createPatientProfile(profileDeps, {
      personRef,
      organizationRef,
      actor: staffActor,
      safeContext: safeContext("bg-create")
    });
    const patientId = created.status === "created" ? created.patientId : "";
    patientRefs.push(patientId);

    // No consent on file — only an active break-glass grant (M4.3).
    const requested = await requestBreakGlassAccess(breakGlassDeps, {
      actorRef: clinicianRef,
      patientRef: patientId,
      organizationRef,
      justification: "unconscious patient in ED",
      ttlMinutes: 10,
      actor: {
        accountRef: clinicianRef,
        personaKind: "staff",
        actorRole: "clinician",
        tenantRef: null
      },
      safeContext: safeContext("bg-request")
    });
    const accessId = requested.status === "requested" ? requested.accessId : "";
    await activateBreakGlassAccess(breakGlassDeps, {
      accessId,
      actor: {
        accountRef: clinicianRef,
        personaKind: "staff",
        actorRole: "clinician",
        tenantRef: null
      },
      safeContext: safeContext("bg-activate")
    });

    const emergencyRead: PatientProfileAccessRequest = {
      decisionRequestId: "bg-read-1",
      actorId: clinicianRef,
      actorRole: "clinician",
      actorType: "clinician",
      patientId,
      organizationId: organizationRef,
      requestedAction: "read",
      purpose: "emergency-care",
      requiresRelationship: false,
      relationshipType: "none",
      requestedConsentDomains: [],
      sessionStatus: "active",
      sameTenant: true,
      emergencyStatus: "declared",
      activeEncounter: true,
      evaluatedAt: new Date().toISOString()
    };

    const decision = await readPatientProfile(profileDeps, emergencyRead);
    expect(decision.status).toBe("allowed");
    if (decision.status === "allowed") {
      expect(decision.decision.breakGlassActive).toBe(true);
    }
  });
});
