import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createCareCircleProjectionConsumer,
  createDatabaseClient,
  createDatabasePool,
  listCareCircleForPatient,
  listWardsForActor,
  PgOutboxStore
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  createPgRelationshipServiceDeps,
  establishRelationship,
  revokeRelationship
} from "../../apps/api/src/relationship-service.js";
import {
  createPgCareCircleServiceDeps,
  listMyWards,
  readPatientCareCircle,
  type CareCircleAccessContext
} from "../../apps/api/src/care-circle-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

/**
 * M6.1 Care Circle read-model projection against live Postgres. Proves the
 * event-driven projection: establishing a relationship (which emits a
 * RelationshipEstablished domain event to the outbox) is projected by the
 * care-circle consumer into a bidirectionally-queryable membership; revocation is
 * re-projected; the consumer is idempotent under redelivery; and a patient's
 * care-circle read is governed by the full pipeline with consent-withdrawal
 * propagation.
 *
 * To stay isolated from other test files sharing the outbox, this fetches each
 * relationship's real pending event and invokes the consumer directly (rather than
 * globally dispatching), which still exercises the consumer end to end.
 */
describe.skipIf(!shouldRun)("care-circle read-model projection + access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const relationshipDeps = createPgRelationshipServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);
  const careCircleDeps = createPgCareCircleServiceDeps(pool);
  const outbox = new PgOutboxStore<Record<string, unknown>>(pool);
  const careCircleConsumer = createCareCircleProjectionConsumer(pool);

  const run = `cc-${Date.now()}`;
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
      operationTag: "relationship.graph.establish"
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

  async function establishGuardian(
    guardianRef: string,
    patientRef: string,
    organizationRef: string,
    tag: string
  ) {
    const outcome = await establishRelationship(relationshipDeps, {
      actorRef: guardianRef,
      patientRef,
      organizationRef,
      relationshipType: "guardian",
      verificationMethod: "legal-document",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      expiryDate: "2027-01-01T00:00:00.000Z",
      permittedActions: ["read"],
      actor: staffActor,
      safeContext: safeContext(tag)
    });
    return outcome.relationshipId;
  }

  /** Fetch the real pending outbox event for a relationship and project it. */
  async function project(relationshipId: string, eventType: string): Promise<void> {
    const pending = await outbox.listPending(5000);
    const event = pending.find(
      (candidate) => candidate.aggregateId === relationshipId && candidate.eventType === eventType
    );
    if (!event) {
      throw new Error(`no pending ${eventType} for ${relationshipId}`);
    }
    await careCircleConsumer.consume(event);
  }

  function patientReadAccess(patientRef: string, organizationRef: string): CareCircleAccessContext {
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

  function newSubjects() {
    const guardianRef = randomUUID();
    const patientRef = randomUUID();
    const organizationRef = randomUUID();
    actorRefs.push(guardianRef);
    patientRefs.push(patientRef);
    return { guardianRef, patientRef, organizationRef };
  }

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const patientRef of patientRefs) {
      await client.query(
        `DELETE FROM nelyo_care_circle.care_circle_member WHERE patient_ref = $1`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_relationship.relationship WHERE patient_ref = $1`, [
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

  it("projects an established relationship into the care circle, bidirectionally", async () => {
    const { guardianRef, patientRef, organizationRef } = newSubjects();
    const relationshipId = await establishGuardian(
      guardianRef,
      patientRef,
      organizationRef,
      "estab"
    );
    await project(relationshipId, "RelationshipEstablished");

    const circle = await listCareCircleForPatient(client, { patientRef, organizationRef });
    expect(circle).toHaveLength(1);
    expect(circle[0]).toMatchObject({
      relationshipRef: relationshipId,
      actorRef: guardianRef,
      patientRef,
      relationshipType: "guardian",
      membershipStatus: "active"
    });
    expect(circle[0]?.permittedActions).toEqual(["read"]);

    const wards = await listWardsForActor(client, { actorRef: guardianRef, organizationRef });
    expect(wards).toHaveLength(1);
    expect(wards[0]).toMatchObject({ patientRef, membershipStatus: "active" });
  });

  it("reflects a revocation after re-projection", async () => {
    const { guardianRef, patientRef, organizationRef } = newSubjects();
    const relationshipId = await establishGuardian(
      guardianRef,
      patientRef,
      organizationRef,
      "rev-estab"
    );
    await project(relationshipId, "RelationshipEstablished");

    await revokeRelationship(relationshipDeps, {
      relationshipId,
      revocationReason: "guardianship-ended",
      actor: staffActor,
      safeContext: safeContext("rev")
    });
    await project(relationshipId, "RelationshipRevoked");

    const circle = await listCareCircleForPatient(client, { patientRef, organizationRef });
    expect(circle[0]).toMatchObject({
      relationshipRef: relationshipId,
      membershipStatus: "revoked"
    });
  });

  it("is idempotent when the same event is redelivered", async () => {
    const { guardianRef, patientRef, organizationRef } = newSubjects();
    const relationshipId = await establishGuardian(
      guardianRef,
      patientRef,
      organizationRef,
      "idem"
    );

    // Redelivery: the same pending event is offered to the consumer twice.
    await project(relationshipId, "RelationshipEstablished");
    await project(relationshipId, "RelationshipEstablished");

    const circle = await listCareCircleForPatient(client, { patientRef, organizationRef });
    expect(circle).toHaveLength(1);
    expect(circle[0]).toMatchObject({ membershipStatus: "active" });
  });

  it("governs a patient's care-circle read and propagates consent withdrawal", async () => {
    const { guardianRef, patientRef, organizationRef } = newSubjects();
    const relationshipId = await establishGuardian(
      guardianRef,
      patientRef,
      organizationRef,
      "read-estab"
    );
    await project(relationshipId, "RelationshipEstablished");

    await grantConsent(consentDeps, {
      patientRef,
      organizationRef,
      grantedDomains: [],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-consent")
    });

    const allowed = await readPatientCareCircle(careCircleDeps, {
      access: patientReadAccess(patientRef, organizationRef)
    });
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      expect(allowed.members).toHaveLength(1);
      expect(allowed.members[0]).toMatchObject({
        actorRef: guardianRef,
        relationshipType: "guardian"
      });
    }

    // The guardian's own-wards view (self-scoped) shows the effective ward.
    const wards = await listMyWards(careCircleDeps, { actorRef: guardianRef, organizationRef });
    expect(wards.map((ward) => ward.patientRef)).toContain(patientRef);

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-withdraw")
    });

    const denied = await readPatientCareCircle(careCircleDeps, {
      access: patientReadAccess(patientRef, organizationRef)
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("members");
  });
});
