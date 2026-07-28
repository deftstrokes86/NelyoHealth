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
  insertAvailabilitySlot,
  insertTimelineEntry
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import { FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS } from "../../packages/domain/src/index.js";
import { createNestApiApp } from "../../apps/api/src/nest/bootstrap.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
type NestApiApp = Awaited<ReturnType<typeof createNestApiApp>>;

/**
 * M7 resource HTTP surface (ADR-0014). Proves the load-bearing properties end-to-end:
 *  - the self-access invariant: after WITHDRAWING every consent grant, the data
 *    subject still reads their own timeline (self is not consent-mediated);
 *  - self sees every domain (incl. message) of their own timeline;
 *  - non-enumeration: an unauthorized cross-patient read and a non-existent patient
 *    both return a byte-identical 404;
 *  - response DTO discipline: no forbidden (PHI-ish) key fragments cross the wire;
 *  - the booking write loop: 201 / 200 / 409 (state conflict only post-authz);
 *  - edge hygiene: a tampered cursor is a uniform 400; security headers present.
 */
describe.skipIf(!shouldRun)("resource HTTP surface (M7)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const consentDeps = createPgConsentServiceDeps(pool);
  const run = `m7-${Date.now()}`;
  let app: NestApiApp | undefined;
  let port = 0;
  let personId = "";
  let accountId = "";
  let sessionId = "";
  let otherPersonId = "";
  let orgId = "";
  let slotId = "";

  async function get(path: string, headers: Record<string, string> = {}): Promise<Response> {
    return fetch(`http://127.0.0.1:${port}${path}`, { headers });
  }
  async function post(
    path: string,
    body: unknown,
    headers: Record<string, string> = {}
  ): Promise<Response> {
    return fetch(`http://127.0.0.1:${port}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify(body)
    });
  }
  function authed(token = sessionId): Record<string, string> {
    return { authorization: `Bearer ${token}` };
  }

  beforeAll(async () => {
    await client.connect();
    const person = await createPerson(client, { displayName: `${run}-subject` });
    personId = person.id;
    const account = await createUserAccount(client, {
      personId,
      loginEmail: `${run}@example.test`,
      status: "active"
    });
    accountId = account.id;
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 300_000).toISOString()
    });
    sessionId = session.id;

    const otherPerson = await createPerson(client, { displayName: `${run}-other` });
    otherPersonId = otherPerson.id;

    const org = await createOrganization(client, {
      legalName: `${run} Ltd`,
      displayName: `${run} Org`
    });
    orgId = org.id;

    // Own-timeline entries across two domains — self must see BOTH (incl. message).
    await insertTimelineEntry(client, {
      entryId: randomUUID(),
      sourceEventRef: randomUUID(),
      patientRef: personId,
      resourceDomain: "appointment",
      entryType: "appointment-booked",
      aggregateRef: randomUUID(),
      occurredAt: new Date(Date.now() - 20_000).toISOString()
    });
    await insertTimelineEntry(client, {
      entryId: randomUUID(),
      sourceEventRef: randomUUID(),
      patientRef: personId,
      resourceDomain: "message",
      entryType: "message-posted",
      aggregateRef: randomUUID(),
      occurredAt: new Date(Date.now() - 10_000).toISOString()
    });

    // An open slot for the booking loop.
    slotId = randomUUID();
    const clinicianRef = randomUUID();
    const nowIso = new Date().toISOString();
    await insertAvailabilitySlot(client, {
      slotId,
      clinicianRef,
      organizationRef: orgId,
      startAt: new Date(Date.now() + 86_400_000).toISOString(),
      endAt: new Date(Date.now() + 86_400_000 + 1_800_000).toISOString(),
      createdAt: nowIso,
      updatedAt: nowIso
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
      personId
    ]);
    await client.query(`DELETE FROM nelyo_appointment.appointment WHERE patient_ref = $1`, [
      personId
    ]);
    await client.query(
      `DELETE FROM nelyo_appointment.availability_slot WHERE organization_ref = $1`,
      [orgId]
    );
    await client.query(
      `DELETE FROM nelyo_consent.consent_version WHERE consent_id IN
         (SELECT consent_id FROM nelyo_consent.consent_record WHERE patient_ref = $1)`,
      [personId]
    );
    await client.query(`DELETE FROM nelyo_consent.consent_record WHERE patient_ref = $1`, [
      personId
    ]);
    await client.query(`DELETE FROM nelyo_foundation.audit_event WHERE actor_account_ref = $1`, [
      accountId
    ]);
    await client.query(`DELETE FROM nelyo_identity.session WHERE user_account_id = $1`, [
      accountId
    ]);
    await client.query(`DELETE FROM nelyo_identity.user_account WHERE id = $1`, [accountId]);
    await client.query(`DELETE FROM nelyo_identity.person WHERE display_name LIKE $1`, [`${run}%`]);
    await client.query(`DELETE FROM nelyo_tenancy.organization WHERE legal_name LIKE $1`, [
      `${run}%`
    ]);
    await client.end();
    await pool.end();
  });

  it("denies an unauthenticated timeline read with 401", async () => {
    const res = await get("/api/me/timeline");
    expect(res.status).toBe(401);
  });

  it("INVARIANT: after withdrawing every consent grant, the subject still reads their own timeline", async () => {
    // Grant then withdraw ALL consent for the subject+org — the data-subject-rights case.
    const actor = {
      accountRef: personId,
      personaKind: "personal",
      actorRole: "patient" as const,
      tenantRef: null
    };
    const safeContext = (tag: string) => ({
      requestId: `req-${run}-${tag}`,
      correlationId: `corr-${run}-${tag}`,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "t"
    });
    await grantConsent(consentDeps, {
      patientRef: personId,
      organizationRef: orgId,
      grantedDomains: [],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor,
      safeContext: safeContext("grant")
    });
    await withdrawConsent(consentDeps, {
      patientRef: personId,
      organizationRef: orgId,
      revocationReason: "patient-request",
      actor,
      safeContext: safeContext("withdraw")
    });

    const res = await get("/api/me/timeline", authed());
    expect(res.status).toBe(200);
    const body = await res.json();
    // Self sees EVERY domain of their own timeline, including message.
    const domains = new Set(
      body.data.entries.map((e: { resourceDomain: string }) => e.resourceDomain)
    );
    expect(domains).toEqual(new Set(["appointment", "message"]));

    // Response DTO discipline: only declared fields; no forbidden (PHI-ish) fragments.
    const serialized = JSON.stringify(body.data).toLowerCase();
    for (const fragment of FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS) {
      expect(serialized).not.toContain(fragment);
    }
    expect(Object.keys(body.data.entries[0]).sort()).toEqual(
      ["aggregateRef", "entryId", "entryType", "occurredAt", "resourceDomain"].sort()
    );
  });

  it("NON-ENUMERATION: cross-patient and non-existent both return an identical 404", async () => {
    const crossPatient = await get(`/api/patients/${otherPersonId}/timeline`, authed());
    const nonExistent = await get(`/api/patients/${randomUUID()}/timeline`, authed());
    expect(crossPatient.status).toBe(404);
    expect(nonExistent.status).toBe(404);
    const a = await crossPatient.json();
    const b = await nonExistent.json();
    // The error payload is byte-identical — existence is not revealed.
    expect(a.errors).toEqual(b.errors);
    expect(a.errors[0].code).toBe("RESOURCE_UNAVAILABLE");
  });

  it("rejects a tampered timeline cursor with a uniform 400 (no 500, no oracle)", async () => {
    const res = await get("/api/me/timeline?cursor=not-a-valid-cursor", authed());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.errors[0].code).toBe("VALIDATION_FAILED");
  });

  it("sets baseline security headers", async () => {
    const res = await get("/api/me/timeline", authed());
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("DENY");
  });

  it("serves a self-scoped notification inbox and 404s a mark-read for a foreign id", async () => {
    const inbox = await get("/api/notifications", authed());
    expect(inbox.status).toBe(200);
    const body = await inbox.json();
    expect(Array.isArray(body.data.notifications)).toBe(true);

    const markRead = await post(`/api/notifications/${randomUUID()}/read`, {}, authed());
    expect(markRead.status).toBe(404);
    expect((await markRead.json()).errors[0].code).toBe("RESOURCE_UNAVAILABLE");
  });

  it("runs the self booking loop: book 201 -> read 200 -> cancel 200 -> cancel-again 409", async () => {
    const booked = await post(
      "/api/appointments",
      { slotId, appointmentType: "consultation" },
      authed()
    );
    expect(booked.status).toBe(201);
    const appointmentId = (await booked.json()).data.appointmentId as string;
    expect(appointmentId).toBeTruthy();

    const read = await get(`/api/appointments/${appointmentId}`, authed());
    expect(read.status).toBe(200);
    expect((await read.json()).data.appointmentId).toBe(appointmentId);

    const cancel = await post(`/api/appointments/${appointmentId}/cancel`, {}, authed());
    expect(cancel.status).toBe(200);

    // A second cancel is an invalid transition — reachable ONLY post-authz, so 409.
    const cancelAgain = await post(`/api/appointments/${appointmentId}/cancel`, {}, authed());
    expect(cancelAgain.status).toBe(409);
    expect((await cancelAgain.json()).errors[0].code).toBe("STATE_CONFLICT");
  });

  it("404s a read of an appointment that is not the caller's own (non-enumeration)", async () => {
    const res = await get(`/api/appointments/${randomUUID()}`, authed());
    expect(res.status).toBe(404);
    expect((await res.json()).errors[0].code).toBe("RESOURCE_UNAVAILABLE");
  });
});
