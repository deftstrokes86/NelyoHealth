import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  insertRelationship,
  loadRelationship,
  loadRelationshipForSubject
} from "../../packages/database/src/index.js";
import {
  createPgRelationshipServiceDeps,
  decideAuthorizationForSubject,
  establishRelationship,
  revokeRelationship,
  verifyRelationship,
  type RelationshipAuthorizationBaseInput
} from "../../apps/api/src/relationship-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

/**
 * M4.2 relationship persistence against live Postgres. Proves:
 *  - the repository round-trips a relationship row;
 *  - establish / verify / revoke run as transactional commands (relationship
 *    state, the outbox event, and the audit intent all commit together);
 *  - re-establishing an (actor, patient, org, type) re-activates that row;
 *  - a revocation recorded through the command flips status to 'revoked' AND
 *    propagates to the very next authorization decision loaded from the
 *    database (no cached relationship).
 */
describe.skipIf(!shouldRun)(
  "relationship persistence (repository + transactional commands)",
  () => {
    const client = createDatabaseClient();
    const pool = createDatabasePool();
    const deps = createPgRelationshipServiceDeps(pool);
    const run = `rel-${Date.now()}`;
    const actorRefs: string[] = [];
    const correlationIds: string[] = [];

    const actor = {
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
        await client.query(`DELETE FROM nelyo_relationship.relationship WHERE actor_ref = $1`, [
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

    it("round-trips a relationship through the repository", async () => {
      const { actorRef, patientRef, organizationRef } = newSubject();
      const relationshipId = randomUUID();
      const at = "2026-01-01T00:00:00.000Z";

      await insertRelationship(client, {
        relationshipId,
        actorRef,
        patientRef,
        organizationRef,
        relationshipType: "guardian",
        status: "active",
        verificationMethod: "legal-document",
        effectiveDate: at,
        permittedActions: ["read", "update-consent"],
        createdAt: at,
        updatedAt: at
      });

      const byId = await loadRelationship(client, relationshipId);
      expect(byId).toMatchObject({ relationshipId, actorRef, relationshipType: "guardian" });
      expect(byId?.permittedActions).toEqual(["read", "update-consent"]);

      const bySubject = await loadRelationshipForSubject(client, {
        actorRef,
        patientRef,
        organizationRef,
        relationshipType: "guardian"
      });
      expect(bySubject?.relationshipId).toBe(relationshipId);
    });

    it("establishes a relationship as a transactional command (state + outbox + audit)", async () => {
      const { actorRef, patientRef, organizationRef } = newSubject();
      const ctx = safeContext("establish");

      const outcome = await establishRelationship(deps, {
        actorRef,
        patientRef,
        organizationRef,
        relationshipType: "guardian",
        verificationMethod: "legal-document",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        permittedActions: ["read", "update-consent"],
        actor,
        safeContext: ctx
      });
      expect(outcome).toMatchObject({ status: "established", reactivated: false });

      const record = await loadRelationship(client, outcome.relationshipId);
      expect(record?.status).toBe("active");

      const outbox = await client.query(
        `SELECT event_type, dispatch_status, payload_json FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
        [ctx.correlationId]
      );
      expect(outbox.rows).toHaveLength(1);
      expect(outbox.rows[0]).toMatchObject({
        event_type: "RelationshipEstablished",
        dispatch_status: "pending"
      });
      expect(outbox.rows[0].payload_json).toMatchObject({
        relationshipRef: outcome.relationshipId,
        relationshipType: "guardian"
      });

      const audit = await client.query(
        `SELECT command_name, action, outcome FROM nelyo_foundation.audit_event
        WHERE correlation_id = $1`,
        [ctx.correlationId]
      );
      expect(audit.rows[0]).toMatchObject({
        command_name: "relationship.graph.establish",
        action: "establish",
        outcome: "committed"
      });
    });

    it("re-activates an existing relationship on re-establish", async () => {
      const { actorRef, patientRef, organizationRef } = newSubject();

      const first = await establishRelationship(deps, {
        actorRef,
        patientRef,
        organizationRef,
        relationshipType: "caregiver-delegation",
        verificationMethod: "organization-attestation",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        permittedActions: ["read"],
        actor,
        safeContext: safeContext("reest-1")
      });
      await revokeRelationship(deps, {
        relationshipId: first.relationshipId,
        revocationReason: "delegation-paused",
        actor,
        safeContext: safeContext("reest-revoke")
      });

      const second = await establishRelationship(deps, {
        actorRef,
        patientRef,
        organizationRef,
        relationshipType: "caregiver-delegation",
        verificationMethod: "government-id",
        effectiveDate: "2026-04-01T00:00:00.000Z",
        permittedActions: ["read", "update-consent"],
        actor,
        safeContext: safeContext("reest-2")
      });
      expect(second.relationshipId).toBe(first.relationshipId);
      expect(second.reactivated).toBe(true);

      const record = await loadRelationship(client, second.relationshipId);
      expect(record?.status).toBe("active");
      expect(record?.revokedAt).toBeUndefined();
      expect(record?.permittedActions).toEqual(["read", "update-consent"]);
    });

    it("verifies a relationship and emits RelationshipVerified", async () => {
      const { actorRef, patientRef, organizationRef } = newSubject();
      const established = await establishRelationship(deps, {
        actorRef,
        patientRef,
        organizationRef,
        relationshipType: "clinical-proxy",
        verificationMethod: "self-attested",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        permittedActions: ["read"],
        actor,
        safeContext: safeContext("verify-establish")
      });

      const ctx = safeContext("verify");
      const outcome = await verifyRelationship(deps, {
        relationshipId: established.relationshipId,
        verificationMethod: "clinical-attestation",
        actor,
        safeContext: ctx
      });
      expect(outcome).toMatchObject({ status: "verified" });

      const record = await loadRelationship(client, established.relationshipId);
      expect(record?.verificationMethod).toBe("clinical-attestation");

      const outbox = await client.query(
        `SELECT event_type FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
        [ctx.correlationId]
      );
      expect(outbox.rows[0]).toMatchObject({ event_type: "RelationshipVerified" });
    });

    it("revokes a relationship and propagates to the very next authorization decision", async () => {
      const { actorRef, patientRef, organizationRef } = newSubject();
      const established = await establishRelationship(deps, {
        actorRef,
        patientRef,
        organizationRef,
        relationshipType: "guardian",
        verificationMethod: "legal-document",
        effectiveDate: "2026-01-01T00:00:00.000Z",
        permittedActions: ["read", "update-consent"],
        actor,
        safeContext: safeContext("wd-establish")
      });

      const decisionBase = authorizationBase(actorRef, patientRef, organizationRef);

      const before = await decideAuthorizationForSubject(deps, decisionBase, "guardian");
      expect(before.status).toBe("allowed");

      const ctx = safeContext("revoke");
      const revoked = await revokeRelationship(deps, {
        relationshipId: established.relationshipId,
        revocationReason: "guardianship-ended",
        actor,
        safeContext: ctx
      });
      expect(revoked.status).toBe("revoked");

      const outbox = await client.query(
        `SELECT event_type FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
        [ctx.correlationId]
      );
      expect(outbox.rows[0]).toMatchObject({ event_type: "RelationshipRevoked" });

      const after = await decideAuthorizationForSubject(deps, decisionBase, "guardian");
      expect(after.status).toBe("denied");
      expect(after.reasonCode).toBe("relationship-revoked");
    });

    it("is a no-op when revoking a relationship that does not exist", async () => {
      const outcome = await revokeRelationship(deps, {
        relationshipId: randomUUID(),
        revocationReason: "guardianship-ended",
        actor,
        safeContext: safeContext("revoke-none")
      });
      expect(outcome).toEqual({ status: "not-found" });
    });
  }
);

/** Permissive decision context (consent granted) so the relationship decides. */
function authorizationBase(
  actorRef: string,
  patientRef: string,
  organizationRef: string
): RelationshipAuthorizationBaseInput {
  return {
    decisionRequestId: "rel-db-authz-1",
    actorId: actorRef,
    actorRole: "guardian",
    actorType: "guardian",
    organizationId: organizationRef,
    patientId: patientRef,
    requestedConsentDomains: [],
    consent: {
      consentId: "consent-x",
      patientId: patientRef,
      organizationId: organizationRef,
      currentVersion: 1,
      updatedAt: "2026-01-01T00:00:00.000Z",
      versions: [
        {
          version: 1,
          status: "granted",
          grantedDomains: [],
          effectiveDate: "2026-01-01T00:00:00.000Z",
          createdAt: "2026-01-01T00:00:00.000Z",
          createdByActorId: patientRef
        }
      ]
    },
    consentStatus: "granted",
    requestedResource: "clinical-record-summary",
    requestedAction: "read",
    purpose: "care-delivery",
    sessionStatus: "active",
    activeEncounter: true,
    emergencyStatus: "none",
    sameTenant: true,
    sponsorPaymentOnly: false,
    requiresRelationship: true,
    breakGlassRequested: false,
    impersonationAttempt: false,
    auditEventEditAttempt: false,
    evaluatedAt: "2026-07-02T12:00:00.000Z"
  };
}
