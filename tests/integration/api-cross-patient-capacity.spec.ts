import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import type { AddressInfo } from "node:net";
import {
  createDatabaseClient,
  createDatabasePool,
  createOrganization,
  createPerson,
  createSession,
  createUserAccount,
  insertRelationship,
  insertTimelineEntry
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import { createNestApiApp } from "../../apps/api/src/nest/bootstrap.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
type NestApiApp = Awaited<ReturnType<typeof createNestApiApp>>;

/**
 * M7.2 cross-patient capacity resolution (ADR-0014). A caregiver reaches a consented
 * patient's timeline over HTTP via a derived capacity from the relationship graph.
 * Proves the four required properties:
 *   1. caregiver 200 with messaging HIDDEN (the visibility invariant holds);
 *   2. relationship revoked -> next read 404 (the pipeline's live re-load);
 *   3. consent withdrawn -> 404;
 *   4. a stranger (no relationship) === a non-existent subject (identical 404).
 * Plus: the allowed delegated access records the selected relationship + capacity.
 */
describe.skipIf(!shouldRun)("cross-patient capacity (M7.2)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const consentDeps = createPgConsentServiceDeps(pool);
  const run = `m72-${Date.now()}`;
  let app: NestApiApp | undefined;
  let port = 0;
  let subjectPersonId = "";
  let orgId = "";
  let caregiverAccountId = "";
  let caregiverSessionId = "";
  let strangerSessionId = "";
  let relationshipId = "";

  function get(path: string, token: string): Promise<Response> {
    return fetch(`http://127.0.0.1:${port}${path}`, {
      headers: { authorization: `Bearer ${token}` }
    });
  }
  const consentActor = () => ({
    accountRef: subjectPersonId,
    personaKind: "personal",
    actorRole: "patient" as const,
    tenantRef: null
  });
  const safeContext = (tag: string) => ({
    requestId: `req-${run}-${tag}`,
    correlationId: `corr-${run}-${tag}`,
    idempotencyKey: `idem-${run}-${tag}`,
    operationTag: "t"
  });

  beforeAll(async () => {
    await client.connect();
    const subject = await createPerson(client, { displayName: `${run}-subject` });
    subjectPersonId = subject.id;
    const org = await createOrganization(client, {
      legalName: `${run} Ltd`,
      displayName: `${run} Org`
    });
    orgId = org.id;

    const caregiverPerson = await createPerson(client, { displayName: `${run}-caregiver` });
    const caregiverAccount = await createUserAccount(client, {
      personId: caregiverPerson.id,
      loginEmail: `${run}-cg@example.test`,
      status: "active"
    });
    caregiverAccountId = caregiverAccount.id;
    caregiverSessionId = (
      await createSession(client, {
        userAccountId: caregiverAccountId,
        expiresAtIso: new Date(Date.now() + 300_000).toISOString()
      })
    ).id;

    const strangerPerson = await createPerson(client, { displayName: `${run}-stranger` });
    const strangerAccount = await createUserAccount(client, {
      personId: strangerPerson.id,
      loginEmail: `${run}-st@example.test`,
      status: "active"
    });
    strangerSessionId = (
      await createSession(client, {
        userAccountId: strangerAccount.id,
        expiresAtIso: new Date(Date.now() + 300_000).toISOString()
      })
    ).id;

    // The caregiver-delegation relationship (actorRef = caregiver ACCOUNT, per the pipeline).
    relationshipId = randomUUID();
    const nowIso = new Date().toISOString();
    await insertRelationship(client, {
      relationshipId,
      actorRef: caregiverAccountId,
      patientRef: subjectPersonId,
      organizationRef: orgId,
      relationshipType: "caregiver-delegation",
      status: "active",
      verificationMethod: "organization-attestation",
      effectiveDate: "2026-01-01T00:00:00.000Z",
      permittedActions: ["read"],
      createdAt: nowIso,
      updatedAt: nowIso
    });

    // The patient consents to the org.
    await grantConsent(consentDeps, {
      patientRef: subjectPersonId,
      organizationRef: orgId,
      grantedDomains: [],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor: consentActor(),
      safeContext: safeContext("grant")
    });

    // Timeline entries: a clinical-record entry (visible to a caregiver) + a message
    // entry (must stay hidden from a caregiver — participant/self-scoped).
    await insertTimelineEntry(client, {
      entryId: randomUUID(),
      sourceEventRef: randomUUID(),
      patientRef: subjectPersonId,
      resourceDomain: "clinical-record",
      entryType: "record-entry-added",
      aggregateRef: randomUUID(),
      occurredAt: new Date(Date.now() - 20_000).toISOString()
    });
    await insertTimelineEntry(client, {
      entryId: randomUUID(),
      sourceEventRef: randomUUID(),
      patientRef: subjectPersonId,
      resourceDomain: "message",
      entryType: "message-posted",
      aggregateRef: randomUUID(),
      occurredAt: new Date(Date.now() - 10_000).toISOString()
    });

    app = await createNestApiApp();
    await app.init();
    const server = app.getHttpServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    port = (server.address() as AddressInfo).port;
  });

  afterAll(async () => {
    if (app) await app.close();
    await client.query(`DELETE FROM nelyo_timeline.timeline_entry WHERE patient_ref = $1`, [
      subjectPersonId
    ]);
    await client.query(`DELETE FROM nelyo_relationship.relationship WHERE patient_ref = $1`, [
      subjectPersonId
    ]);
    await client.query(
      `DELETE FROM nelyo_consent.consent_version WHERE consent_id IN
         (SELECT consent_id FROM nelyo_consent.consent_record WHERE patient_ref = $1)`,
      [subjectPersonId]
    );
    await client.query(`DELETE FROM nelyo_consent.consent_record WHERE patient_ref = $1`, [
      subjectPersonId
    ]);
    await client.query(`DELETE FROM nelyo_foundation.audit_event WHERE aggregate_id = $1`, [
      subjectPersonId
    ]);
    await client.query(
      `DELETE FROM nelyo_identity.session WHERE user_account_id IN
         (SELECT id FROM nelyo_identity.user_account WHERE login_email LIKE $1)`,
      [`${run}%`]
    );
    await client.query(`DELETE FROM nelyo_identity.user_account WHERE login_email LIKE $1`, [
      `${run}%`
    ]);
    await client.query(`DELETE FROM nelyo_identity.person WHERE display_name LIKE $1`, [`${run}%`]);
    await client.query(`DELETE FROM nelyo_tenancy.organization WHERE legal_name LIKE $1`, [
      `${run}%`
    ]);
    await client.end();
    await pool.end();
  });

  it("PROOF 1: a caregiver reads the patient's timeline (200), with messaging HIDDEN", async () => {
    const res = await get(`/api/patients/${subjectPersonId}/timeline`, caregiverSessionId);
    expect(res.status).toBe(200);
    const body = await res.json();
    const domains = new Set(
      body.data.entries.map((entry: { resourceDomain: string }) => entry.resourceDomain)
    );
    expect(domains.has("clinical-record")).toBe(true); // consented, relationship-permitted
    expect(domains.has("message")).toBe(false); // participant/self-scoped — never a caregiver
  });

  it("records the selected relationship + derived capacity on the allowed delegated access", async () => {
    await get(`/api/patients/${subjectPersonId}/timeline`, caregiverSessionId);
    const audit = await client.query(
      `SELECT outcome, safe_details FROM nelyo_foundation.audit_event
        WHERE aggregate_id = $1 AND actor_account_ref = $2
          AND safe_details->>'selectedRelationshipRef' = $3
        ORDER BY occurred_at DESC LIMIT 1`,
      [subjectPersonId, caregiverAccountId, relationshipId]
    );
    expect(audit.rows.length).toBe(1);
    expect(audit.rows[0].outcome).toBe("delegated-access-granted");
    expect(audit.rows[0].safe_details.derivedActorRole).toBe("caregiver");
  });

  it("PROOF 4: a stranger and a non-existent subject both return an identical 404", async () => {
    const stranger = await get(`/api/patients/${subjectPersonId}/timeline`, strangerSessionId);
    const nonExistent = await get(`/api/patients/${randomUUID()}/timeline`, strangerSessionId);
    expect(stranger.status).toBe(404);
    expect(nonExistent.status).toBe(404);
    expect((await stranger.json()).errors).toEqual((await nonExistent.json()).errors);
  });

  it("PROOF 3: withdrawing the patient's consent denies the caregiver's next read (404)", async () => {
    await withdrawConsent(consentDeps, {
      patientRef: subjectPersonId,
      organizationRef: orgId,
      revocationReason: "patient-request",
      actor: consentActor(),
      safeContext: safeContext("withdraw")
    });
    const res = await get(`/api/patients/${subjectPersonId}/timeline`, caregiverSessionId);
    expect(res.status).toBe(404);
  });

  it("PROOF 2: revoking the relationship denies the caregiver's next read (404)", async () => {
    // Re-grant consent so the ONLY thing denying is the revoked relationship.
    await grantConsent(consentDeps, {
      patientRef: subjectPersonId,
      organizationRef: orgId,
      grantedDomains: [],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor: consentActor(),
      safeContext: safeContext("regrant")
    });
    await client.query(
      `UPDATE nelyo_relationship.relationship SET status = 'revoked' WHERE relationship_id = $1`,
      [relationshipId]
    );
    const res = await get(`/api/patients/${subjectPersonId}/timeline`, caregiverSessionId);
    expect(res.status).toBe(404);
  });
});
