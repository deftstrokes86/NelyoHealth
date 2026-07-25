import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDatabaseClient, createDatabasePool } from "../../packages/database/src/index.js";
import {
  createPgAppointmentServiceDeps,
  readAppointment,
  type AppointmentAccessContext
} from "../../apps/api/src/appointment-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

/**
 * M6.3b (Principle 11) — the generalized deny-audit. Before M6.3b a denied
 * decide-before-load/write returned a decision draft that was NEVER persisted, so
 * denied access attempts were invisible. `resolveDecideAndAuditAccess` (used by
 * every M5 resource + care-circle) now persists an append-only audit event on any
 * non-allow. Proven here on a denied appointment READ.
 */
describe.skipIf(!shouldRun)("generalized deny-audit (Principle 11)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const deps = createPgAppointmentServiceDeps(pool);
  const decisionRequestIds: string[] = [];

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const id of decisionRequestIds) {
      await client.query(`DELETE FROM nelyo_foundation.audit_event WHERE correlation_id = $1`, [
        id
      ]);
    }
    await client.end();
    await pool.end();
  });

  it("persists an append-only audit event when a resource read is denied", async () => {
    const decisionRequestId = `deny-${randomUUID()}`;
    decisionRequestIds.push(decisionRequestId);
    const actorId = randomUUID();
    const patientId = randomUUID(); // no consent on file -> the decision denies

    const access: AppointmentAccessContext = {
      decisionRequestId,
      actorId,
      actorRole: "clinician",
      actorType: "clinician",
      patientId,
      organizationId: randomUUID(),
      purpose: "care-delivery",
      requiresRelationship: false,
      relationshipType: "none",
      requestedConsentDomains: ["provider-data-sharing"],
      sessionStatus: "active",
      sameTenant: true,
      emergencyStatus: "none",
      activeEncounter: true,
      evaluatedAt: new Date().toISOString()
    };

    const outcome = await readAppointment(deps, { appointmentId: randomUUID(), access });
    expect(outcome.status).toBe("denied");

    const audit = await client.query(
      `SELECT action, outcome, actor_account_ref, actor_role, aggregate_id, safe_details::text AS details
         FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [decisionRequestId]
    );
    expect(audit.rows).toHaveLength(1);
    expect(audit.rows[0]).toMatchObject({
      action: "read",
      outcome: "denied",
      actor_account_ref: actorId,
      actor_role: "clinician",
      aggregate_id: patientId
    });
    // The reason is a policy reasonCode + the resource — never PHI.
    expect(audit.rows[0].details).toContain("appointment");
    expect(audit.rows[0].details).toMatch(/consent-missing|rbac|abac|tenant|stale/);
  });
});
