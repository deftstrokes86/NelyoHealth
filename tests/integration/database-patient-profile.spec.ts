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
  type PatientProfileAccessRequest,
  type PatientProfileCreateAccessContext,
  type PatientProfileWriteAccessContext
} from "../../apps/api/src/patient-profile-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_NAME = "SENTINEL Jane Preferred";
const SENTINEL_MRN = "SENSITIVE-MRN-000123";

/**
 * M5.1 patient-profile persistence + M6.3 write authorization against live
 * Postgres. Proves:
 *  - CREATE is decide(capability+workspace) -> dedup(non-enumerating) -> bootstrap:
 *    it atomically writes the profile AND its governing consent (self/org) or
 *    relationship+consent (guardian) with provenance, so a post-create read
 *    succeeds via the NORMAL pipeline with no special case;
 *  - UPDATE is decide-before-write through the full pipeline (denied writes nothing);
 *  - demographics / identifier values NEVER appear in an event or audit detail;
 *  - a consent withdrawal propagates to the very next read/write.
 */
describe.skipIf(!shouldRun)("patient-profile persistence + write authorization", () => {
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

  function orgCreateAccess(
    organizationRef: string,
    tag: string,
    overrides: Partial<PatientProfileCreateAccessContext> = {}
  ): PatientProfileCreateAccessContext {
    return {
      decisionRequestId: `cr-${run}-${tag}`,
      actorId: "org-admin-actor",
      actorRole: "organization-admin",
      actorType: "admin",
      organizationId: organizationRef,
      purpose: "tenant-administration",
      sameTenant: true,
      sessionStatus: "active",
      evaluatedAt: new Date().toISOString(),
      ...overrides
    };
  }

  function writeAccess(
    patientId: string,
    organizationRef: string,
    overrides: Partial<PatientProfileWriteAccessContext> = {}
  ): PatientProfileWriteAccessContext {
    return {
      decisionRequestId: `wr-${run}-${randomUUID()}`,
      actorId: randomUUID(),
      actorRole: "organization-admin",
      actorType: "admin",
      patientId,
      organizationId: organizationRef,
      purpose: "tenant-administration",
      requiresRelationship: false,
      relationshipType: "none",
      requestedConsentDomains: [],
      sessionStatus: "active",
      sameTenant: true,
      emergencyStatus: "none",
      activeEncounter: false,
      evaluatedAt: new Date().toISOString(),
      ...overrides
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
      registrationMode: "organization",
      preferredName: SENTINEL_NAME,
      biologicalSex: "female",
      preferredLanguage: "en",
      contactPoints: [{ kind: "phone", value: "+15551230000", isPrimary: true }],
      emergencyContacts: [{ name: "Kin", relationshipLabel: "sister", phone: "+15559990000" }],
      identifiers: [{ system: "mrn", value: SENTINEL_MRN, assigningAuthority: "org-1" }],
      access: orgCreateAccess(organizationRef, "create"),
      actor: staffActor,
      safeContext: ctx
    });
    expect(outcome.status).toBe("created");
    const patientId = outcome.status === "created" ? outcome.patientId : "";
    patientRefs.push(patientId);

    const profile = await loadPatientProfile(client, patientId);
    expect(profile?.preferredName).toBe(SENTINEL_NAME);
    expect(profile?.identifiers).toEqual([
      { system: "mrn", value: SENTINEL_MRN, assigningAuthority: "org-1" }
    ]);

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

  it("bootstraps governing consent so a post-create read succeeds via the normal pipeline", async () => {
    const personRef = randomUUID();
    personRefs.push(personRef);
    const organizationRef = randomUUID();
    const clinicianRef = randomUUID();
    actorRefs.push(clinicianRef);

    const created = await createPatientProfile(profileDeps, {
      personRef,
      organizationRef,
      registrationMode: "organization",
      access: orgCreateAccess(organizationRef, "boot-create"),
      actor: staffActor,
      safeContext: safeContext("boot-create")
    });
    const patientId = created.status === "created" ? created.patientId : "";
    patientRefs.push(patientId);

    // The bootstrap consent version carries provenance + the treatment scope.
    const consent = await client.query(
      `SELECT cv.provenance, cv.granted_domains FROM nelyo_consent.consent_version cv
         JOIN nelyo_consent.consent_record cr ON cr.consent_id = cv.consent_id
        WHERE cr.patient_ref = $1 ORDER BY cv.version ASC LIMIT 1`,
      [patientId]
    );
    expect(consent.rows[0].provenance).toBe("captured-at-registration");
    expect(consent.rows[0].granted_domains).toContain("provider-data-sharing");

    // No explicit grant — yet a clinician read is allowed via the bootstrap consent.
    const read = await readPatientProfile(profileDeps, {
      decisionRequestId: "boot-read",
      actorId: clinicianRef,
      actorRole: "clinician",
      actorType: "clinician",
      patientId,
      organizationId: organizationRef,
      requestedAction: "read",
      purpose: "care-delivery",
      requiresRelationship: false,
      relationshipType: "none",
      requestedConsentDomains: ["provider-data-sharing"],
      sessionStatus: "active",
      sameTenant: true,
      emergencyStatus: "none",
      activeEncounter: true,
      evaluatedAt: new Date().toISOString()
    });
    expect(read.status).toBe("allowed");
  });

  it("self-registration and guardian-registration bootstrap the right governing rows", async () => {
    // Self-registration: actor is the patient; consent provenance self-registration.
    const selfPerson = randomUUID();
    personRefs.push(selfPerson);
    const selfOrg = randomUUID();
    const selfCreated = await createPatientProfile(profileDeps, {
      personRef: selfPerson,
      organizationRef: selfOrg,
      registrationMode: "self",
      access: orgCreateAccess(selfOrg, "self-create", {
        actorId: "self-actor",
        actorRole: "patient",
        actorType: "patient",
        purpose: "care-delivery"
      }),
      actor: {
        accountRef: "self-actor",
        personaKind: "personal",
        actorRole: "patient",
        tenantRef: null
      },
      safeContext: safeContext("self-create")
    });
    const selfPatientId = selfCreated.status === "created" ? selfCreated.patientId : "";
    patientRefs.push(selfPatientId);
    const selfConsent = await client.query(
      `SELECT cv.provenance FROM nelyo_consent.consent_version cv
         JOIN nelyo_consent.consent_record cr ON cr.consent_id = cv.consent_id
        WHERE cr.patient_ref = $1`,
      [selfPatientId]
    );
    expect(selfConsent.rows[0].provenance).toBe("self-registration");

    // Guardian-registration: actor is the guardian; a guardian relationship + consent.
    const wardPerson = randomUUID();
    personRefs.push(wardPerson);
    const wardOrg = randomUUID();
    const guardianRef = randomUUID();
    actorRefs.push(guardianRef);
    const guardianCreated = await createPatientProfile(profileDeps, {
      personRef: wardPerson,
      organizationRef: wardOrg,
      registrationMode: "guardian",
      access: orgCreateAccess(wardOrg, "guardian-create", {
        actorId: guardianRef,
        actorRole: "guardian",
        actorType: "guardian",
        purpose: "care-delivery"
      }),
      actor: {
        accountRef: guardianRef,
        personaKind: "personal",
        actorRole: "guardian",
        tenantRef: null
      },
      safeContext: safeContext("guardian-create")
    });
    const wardId = guardianCreated.status === "created" ? guardianCreated.patientId : "";
    patientRefs.push(wardId);

    const rel = await client.query(
      `SELECT actor_ref, status, relationship_type FROM nelyo_relationship.relationship
        WHERE patient_ref = $1`,
      [wardId]
    );
    expect(rel.rows[0]).toMatchObject({
      actor_ref: guardianRef,
      status: "active",
      relationship_type: "guardian"
    });
    const guardianConsent = await client.query(
      `SELECT cv.provenance FROM nelyo_consent.consent_version cv
         JOIN nelyo_consent.consent_record cr ON cr.consent_id = cv.consent_id
        WHERE cr.patient_ref = $1`,
      [wardId]
    );
    expect(guardianConsent.rows[0].provenance).toBe("guardian-granted");
  });

  it("updates a profile through decide-before-write and emits PatientProfileUpdated", async () => {
    const personRef = randomUUID();
    personRefs.push(personRef);
    const organizationRef = randomUUID();
    const created = await createPatientProfile(profileDeps, {
      personRef,
      organizationRef,
      registrationMode: "organization",
      preferredName: "Before",
      access: orgCreateAccess(organizationRef, "upd-create"),
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
      access: writeAccess(patientId, organizationRef),
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

  it("denies an update once consent is withdrawn, writing nothing and auditing the deny", async () => {
    const personRef = randomUUID();
    personRefs.push(personRef);
    const organizationRef = randomUUID();
    const created = await createPatientProfile(profileDeps, {
      personRef,
      organizationRef,
      registrationMode: "organization",
      preferredName: "Keep",
      access: orgCreateAccess(organizationRef, "deny-upd-create"),
      actor: staffActor,
      safeContext: safeContext("deny-upd-create")
    });
    const patientId = created.status === "created" ? created.patientId : "";
    patientRefs.push(patientId);

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
      safeContext: safeContext("deny-upd-withdraw")
    });

    const ctx = safeContext("deny-update");
    const denied = await updatePatientProfile(profileDeps, {
      patientId,
      preferredName: "ShouldNotPersist",
      access: writeAccess(patientId, organizationRef),
      actor: staffActor,
      safeContext: ctx
    });
    expect(denied.status).toBe("denied");
    if (denied.status === "denied") {
      expect(denied.decision.reasonCode).toBe("consent-revoked");
    }

    // Nothing was written...
    const profile = await loadPatientProfile(client, patientId);
    expect(profile?.preferredName).toBe("Keep");
    // ...and the deny was audited.
    const audit = await client.query(
      `SELECT outcome FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0]).toMatchObject({ outcome: "denied" });
  });

  it("returns a non-enumerating outcome for a duplicate medical identifier", async () => {
    const organizationRef = randomUUID();
    const personA = randomUUID();
    const personB = randomUUID();
    personRefs.push(personA, personB);

    const a = await createPatientProfile(profileDeps, {
      personRef: personA,
      organizationRef,
      registrationMode: "organization",
      identifiers: [{ system: "mrn", value: "SHARED-MRN-1" }],
      access: orgCreateAccess(organizationRef, "uniq-a"),
      actor: staffActor,
      safeContext: safeContext("uniq-a")
    });
    expect(a.status).toBe("created");
    if (a.status === "created") patientRefs.push(a.patientId);

    const b = await createPatientProfile(profileDeps, {
      personRef: personB,
      organizationRef,
      registrationMode: "organization",
      identifiers: [{ system: "mrn", value: "SHARED-MRN-1" }],
      access: orgCreateAccess(organizationRef, "uniq-b"),
      actor: staffActor,
      safeContext: safeContext("uniq-b")
    });
    // Generic, non-enumerating: no matched identity ref/attributes in the response.
    expect(b).toEqual({ status: "possible-existing-identity", nextStep: "identity-claim-or-link" });

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
      registrationMode: "organization",
      preferredName: SENTINEL_NAME,
      access: orgCreateAccess(organizationRef, "gov-create"),
      actor: staffActor,
      safeContext: safeContext("gov-create")
    });
    const patientId = created.status === "created" ? created.patientId : "";
    patientRefs.push(patientId);

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

  it("allows a clinician to read via break-glass after consent is withdrawn", async () => {
    const personRef = randomUUID();
    personRefs.push(personRef);
    const organizationRef = randomUUID();
    const clinicianRef = randomUUID();
    actorRefs.push(clinicianRef);

    const created = await createPatientProfile(profileDeps, {
      personRef,
      organizationRef,
      registrationMode: "organization",
      access: orgCreateAccess(organizationRef, "bg-create"),
      actor: staffActor,
      safeContext: safeContext("bg-create")
    });
    const patientId = created.status === "created" ? created.patientId : "";
    patientRefs.push(patientId);

    // Withdraw the bootstrap consent so only break-glass can open access.
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
      safeContext: safeContext("bg-withdraw")
    });

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
