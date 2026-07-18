import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  PgOutboxStore,
  createDatabaseClient,
  createDatabasePool,
  createPerson,
  createSession,
  createUserAccount,
  dispatchPendingOutboxEvents,
  elevateSession,
  ExternalCallPolicy,
  getSessionById,
  listActiveSessionsForAccount,
  listAuthenticationEventsForAccount,
  recordAuthenticationEvent,
  registerDevice,
  setDeviceTrusted,
  type DomainEventPublisher,
  type OutboxEventRecord
} from "../../packages/database/src/index.js";
import {
  createPgIdentitySessionPorts,
  executeAccountSessionRevocation
} from "../../apps/api/src/identity-session-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

describe.skipIf(!shouldRun)("session & auth wiring integration (nelyo_identity)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const run = `sa-${Date.now()}`;
  let accountId = "";

  beforeAll(async () => {
    await client.connect();
    const person = await createPerson(client, { displayName: `${run}-person` });
    const account = await createUserAccount(client, {
      personId: person.id,
      loginEmail: `${run}@example.test`,
      status: "active"
    });
    accountId = account.id;
  });

  afterAll(async () => {
    await client.query(
      `DELETE FROM nelyo_foundation.transactional_outbox WHERE aggregate_id = $1`,
      [accountId]
    );
    await client.query(
      `DELETE FROM nelyo_identity.authentication_event WHERE user_account_id = $1`,
      [accountId]
    );
    await client.query(`DELETE FROM nelyo_identity.session WHERE user_account_id = $1`, [
      accountId
    ]);
    await client.query(`DELETE FROM nelyo_identity.device WHERE user_account_id = $1`, [accountId]);
    await client.query(`DELETE FROM nelyo_identity.user_account WHERE id = $1`, [accountId]);
    await client.query(`DELETE FROM nelyo_identity.person WHERE display_name LIKE $1`, [`${run}%`]);
    await client.end();
    await pool.end();
  });

  it("persists devices, sessions, and step-up elevation with expiry guards", async () => {
    const device = await registerDevice(client, {
      userAccountId: accountId,
      displayName: `${run}-laptop`
    });
    expect(device.trusted).toBe(false);

    const trusted = await setDeviceTrusted(client, device.id, true);
    expect(trusted?.trusted).toBe(true);

    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString(),
      trustedDeviceId: device.id
    });
    expect(session.status).toBe("active");
    expect(session.authLevel).toBe("primary");
    expect(session.trustedDeviceId).toBe(device.id);

    const elevated = await elevateSession(client, session.id);
    expect(elevated?.authLevel).toBe("elevated");

    // Expired session cannot elevate (SQL guard).
    const expired = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() - 1_000).toISOString()
    });
    expect(await elevateSession(client, expired.id)).toBeNull();
  });

  it("records an append-only authentication trail", async () => {
    await recordAuthenticationEvent(client, {
      userAccountId: accountId,
      result: "challenge-required",
      method: "password",
      reasonCode: "mfa-required"
    });
    await recordAuthenticationEvent(client, {
      userAccountId: accountId,
      result: "success",
      method: "mfa"
    });
    // Unknown-identifier failures are recordable without an account.
    const anonymous = await recordAuthenticationEvent(client, {
      result: "failure",
      method: "password",
      reasonCode: "credentials-invalid"
    });
    expect(anonymous.userAccountId).toBeUndefined();

    const events = await listAuthenticationEventsForAccount(client, accountId, 10);
    expect(events.length).toBeGreaterThanOrEqual(2);
    expect(events[0].result).toBe("success");
  });

  it("revokes all sessions transactionally and emits SessionsRevoked via the pg outbox", async () => {
    const ports = createPgIdentitySessionPorts(pool);
    const outbox = new PgOutboxStore<Record<string, unknown>>(pool);

    await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString()
    });
    const before = await listActiveSessionsForAccount(client, accountId);
    expect(before.length).toBeGreaterThanOrEqual(1);

    const { revokedSessionIds } = await executeAccountSessionRevocation(ports, {
      userAccountId: accountId,
      reasonCode: "account-recovery",
      safeContext: {
        requestId: `req-${run}`,
        correlationId: `corr-${run}`,
        idempotencyKey: `idem-${run}`,
        operationTag: "identity.sessions.revoke"
      }
    });
    expect(revokedSessionIds.length).toBe(before.length);

    const after = await listActiveSessionsForAccount(client, accountId);
    expect(after).toHaveLength(0);
    for (const sessionId of revokedSessionIds) {
      const revoked = await getSessionById(client, sessionId);
      expect(revoked?.status).toBe("revoked");
    }

    // The event row exists, pending, with reference-only payload.
    const pending = await outbox.listPending(50);
    const ours = pending.filter(
      (event) => event.eventType === "SessionsRevoked" && event.aggregateId === accountId
    );
    expect(ours).toHaveLength(1);
    expect(ours[0].payload).toMatchObject({
      accountRef: accountId,
      reasonCode: "account-recovery",
      revokedSessionCount: before.length
    });

    // Dispatch it and confirm bookkeeping.
    const delivered: Array<OutboxEventRecord<Record<string, unknown>>> = [];
    const publisher: DomainEventPublisher<Record<string, unknown>> = {
      publish: async (event) => {
        delivered.push(event);
      }
    };
    const stats = await dispatchPendingOutboxEvents({
      outbox,
      publisher,
      externalCallPolicy: new ExternalCallPolicy(),
      maxAttempts: 3
    });
    expect(stats.dispatched).toBeGreaterThanOrEqual(1);
    expect(delivered.some((event) => event.eventId === ours[0].eventId)).toBe(true);

    const dispatchedRecord = await outbox.readByEventId(ours[0].eventId);
    expect(dispatchedRecord?.dispatchStatus).toBe("dispatched");
    expect(dispatchedRecord?.dispatchedAt).not.toBeNull();
  });
});
