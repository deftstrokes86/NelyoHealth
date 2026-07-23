import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import { createDatabaseClient } from "../../packages/database/src/index.js";
import { createNestApiApp } from "../../apps/api/src/nest/bootstrap.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

type NestApiApp = Awaited<ReturnType<typeof createNestApiApp>>;

async function startApp(app: NestApiApp): Promise<number> {
  await app.init();
  const server = app.getHttpServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  return (server.address() as AddressInfo).port;
}

describe.skipIf(!shouldRun)("auth HTTP endpoints (POST /api/auth/sessions, /registrations)", () => {
  const client = createDatabaseClient();
  const run = `authhttp-${Date.now()}`;
  let app: NestApiApp | undefined;
  let port = 0;

  beforeAll(async () => {
    await client.connect();
    app = await createNestApiApp();
    port = await startApp(app);
  });

  afterAll(async () => {
    if (app) await app.close();
    await client.query(
      `DELETE FROM nelyo_foundation.audit_event
       WHERE aggregate_id IN (
         SELECT id::text FROM nelyo_identity.user_account WHERE login_email LIKE $1
       )`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_identity.password_credential pc USING nelyo_identity.user_account ua
       WHERE pc.user_account_id = ua.id AND ua.login_email LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_identity.session s USING nelyo_identity.user_account ua
       WHERE s.user_account_id = ua.id AND ua.login_email LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_identity.authentication_event ae USING nelyo_identity.user_account ua
       WHERE ae.user_account_id = ua.id AND ua.login_email LIKE $1`,
      [`${run}%`]
    );
    await client.query(`DELETE FROM nelyo_identity.user_account WHERE login_email LIKE $1`, [
      `${run}%`
    ]);
    await client.query(`DELETE FROM nelyo_identity.contact_point WHERE value LIKE $1`, [`${run}%`]);
    await client.query(`DELETE FROM nelyo_identity.person WHERE display_name LIKE $1`, [`${run}%`]);
    await client
      .query(
        `DELETE FROM nelyo_foundation.transactional_outbox WHERE event_type = 'AccountRegistered'
       AND payload_json->>'accountRef' IN (
         SELECT id::text FROM nelyo_identity.user_account WHERE login_email LIKE $1
       )`,
        [`${run}%`]
      )
      .catch(() => {
        /* best-effort: user_account rows may already be gone by this point */
      });
    await client.end();
  });

  async function register(body: Record<string, unknown>): Promise<Response> {
    return fetch(`http://127.0.0.1:${port}/api/auth/registrations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  async function signIn(body: Record<string, unknown>): Promise<Response> {
    return fetch(`http://127.0.0.1:${port}/api/auth/sessions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  it("registers a new account and returns the generic accepted response", async () => {
    const email = `${run}-fresh@example.test`;
    const res = await register({
      fullName: "Amina Okafor",
      email,
      password: "correct horse battery staple"
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data).toEqual({ accepted: true });

    const account = await client.query(
      `SELECT id, status FROM nelyo_identity.user_account WHERE login_email = $1`,
      [email]
    );
    expect(account.rows[0]?.status).toBe("pending");

    // Retrofit (M3.3): registration now runs as a transactional command, so a
    // command audit intent was written atomically, keyed on the new account id.
    const audit = await client.query(
      `SELECT command_name, action, outcome, actor_account_ref, source
       FROM nelyo_foundation.audit_event WHERE aggregate_id = $1`,
      [account.rows[0].id]
    );
    expect(audit.rows[0]).toMatchObject({
      command_name: "identity.registrations.create",
      action: "register",
      outcome: "committed",
      actor_account_ref: "public:registration",
      source: "command"
    });
  });

  it("rejects a weak password with a specific, safe validation error", async () => {
    const res = await register({
      fullName: "Amina Okafor",
      email: `${run}-weak@example.test`,
      password: "short"
    });
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.errors[0].message).toBe("weak-password");
  });

  it("returns the identical accepted response for a duplicate email (no enumeration) and does not duplicate the person", async () => {
    const email = `${run}-dupe@example.test`;
    const first = await register({
      fullName: "Amina Okafor",
      email,
      password: "correct horse battery staple"
    });
    const second = await register({
      fullName: "Someone Else",
      email,
      password: "another password 123"
    });
    expect(first.status).toBe(second.status);
    // Compare only the payload — requestId/correlationId are per-request
    // UUIDs and legitimately differ between the two calls.
    const firstBody = await first.json();
    const secondBody = await second.json();
    expect(firstBody.data).toEqual(secondBody.data);
    expect(firstBody.errors).toEqual(secondBody.errors);

    const accounts = await client.query(
      `SELECT COUNT(*)::int AS count FROM nelyo_identity.user_account WHERE login_email = $1`,
      [email]
    );
    expect(accounts.rows[0].count).toBe(1);
  });

  it("denies sign-in for a pending (unverified) account with the generic reason", async () => {
    const email = `${run}-pending@example.test`;
    await register({ fullName: "Pending Person", email, password: "correct horse battery staple" });
    const res = await signIn({ email, password: "correct horse battery staple" });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.errors[0].message).toBe("credentials-invalid");
  });

  it("signs in an activated account and resolves a personal-workspace redirect", async () => {
    const email = `${run}-active@example.test`;
    await register({ fullName: "Active Person", email, password: "correct horse battery staple" });
    await client.query(
      `UPDATE nelyo_identity.user_account SET status = 'active' WHERE login_email = $1`,
      [email]
    );

    const res = await signIn({ email, password: "correct horse battery staple" });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data).toMatchObject({ requiresChallenge: false, redirectPath: "/account" });
    expect(typeof body.data.sessionId).toBe("string");

    const session = await client.query(
      `SELECT status, auth_level FROM nelyo_identity.session WHERE id = $1`,
      [body.data.sessionId]
    );
    expect(session.rows[0]).toMatchObject({ status: "active", auth_level: "primary" });
  });

  it("denies an activated account with the wrong password (no signal leaked)", async () => {
    const email = `${run}-wrongpw@example.test`;
    await register({ fullName: "Wrong Password", email, password: "correct horse battery staple" });
    await client.query(
      `UPDATE nelyo_identity.user_account SET status = 'active' WHERE login_email = $1`,
      [email]
    );
    const res = await signIn({ email, password: "totally different password" });
    expect(res.status).toBe(401);
  });

  it("denies an unknown email identically to a known-but-wrong-password account", async () => {
    const unknown = await signIn({
      email: `${run}-neverexisted@example.test`,
      password: "whatever12345"
    });
    expect(unknown.status).toBe(401);
    const unknownBody = await unknown.json();

    const email = `${run}-known@example.test`;
    await register({ fullName: "Known Person", email, password: "correct horse battery staple" });
    await client.query(
      `UPDATE nelyo_identity.user_account SET status = 'active' WHERE login_email = $1`,
      [email]
    );
    const known = await signIn({ email, password: "wrong password entirely" });
    expect(known.status).toBe(401);
    const knownBody = await known.json();

    expect(unknownBody.errors[0].message).toBe(knownBody.errors[0].message);
  });
});
