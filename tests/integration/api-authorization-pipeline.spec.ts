import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import {
  assignRole,
  createDatabaseClient,
  createMembership,
  createOrganization,
  createPerson,
  createSession,
  createUserAccount,
  revokeSessionsForAccount
} from "../../packages/database/src/index.js";
import { createNestApiApp } from "../../apps/api/src/nest/bootstrap.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

type NestApiApp = Awaited<ReturnType<typeof createNestApiApp>>;

async function startApp(app: NestApiApp): Promise<number> {
  await app.init();
  const server = app.getHttpServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  return (server.address() as AddressInfo).port;
}

describe.skipIf(!shouldRun)("authorization pipeline (Authenticate -> Resolve -> Authorize)", () => {
  const client = createDatabaseClient();
  const run = `authz-${Date.now()}`;
  let app: NestApiApp | undefined;
  let port = 0;
  let accountId = "";
  let orgId = "";

  beforeAll(async () => {
    await client.connect();
    const person = await createPerson(client, { displayName: `${run}-person` });
    const account = await createUserAccount(client, {
      personId: person.id,
      loginEmail: `${run}@example.test`,
      status: "active"
    });
    accountId = account.id;

    const org = await createOrganization(client, {
      legalName: `${run} Ltd`,
      displayName: `${run} Org`
    });
    orgId = org.id;
    const membership = await createMembership(client, {
      organizationId: org.id,
      personId: person.id,
      status: "active"
    });
    await assignRole(client, {
      organizationId: org.id,
      membershipId: membership.id,
      roleCode: "clinician"
    });

    app = await createNestApiApp();
    port = await startApp(app);
  });

  afterAll(async () => {
    if (app) await app.close();
    await client.query(
      `DELETE FROM nelyo_tenancy.role_assignment r USING nelyo_tenancy.organization o
       WHERE r.organization_id = o.id AND o.legal_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_tenancy.organization_membership m USING nelyo_tenancy.organization o
       WHERE m.organization_id = o.id AND o.legal_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(`DELETE FROM nelyo_tenancy.organization WHERE legal_name LIKE $1`, [
      `${run}%`
    ]);
    await client.query(`DELETE FROM nelyo_identity.session WHERE user_account_id = $1`, [
      accountId
    ]);
    await client.query(`DELETE FROM nelyo_identity.user_account WHERE id = $1`, [accountId]);
    await client.query(`DELETE FROM nelyo_identity.person WHERE display_name LIKE $1`, [`${run}%`]);
    await client.end();
  });

  async function getContext(headers: Record<string, string>): Promise<Response> {
    return fetch(`http://127.0.0.1:${port}/api/session/context`, { headers });
  }

  it("denies an unauthenticated request (no credential) with 401", async () => {
    const res = await getContext({});
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.errors[0].message).toBe("unauthenticated");
  });

  it("denies an unknown session credential with 401", async () => {
    const res = await getContext({ authorization: "Bearer 00000000-0000-0000-0000-000000000000" });
    expect(res.status).toBe(401);
  });

  it("resolves the Personal workspace for an authenticated session (200)", async () => {
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString()
    });
    const res = await getContext({ authorization: `Bearer ${session.id}` });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toMatchObject({
      accountId,
      workspace: "personal",
      sessionStatus: "active",
      activeTenantValid: false
    });
    expect(body.data.persona.actorRole).toBe("patient");
  });

  it("resolves the Organization workspace when the session has a valid active tenant", async () => {
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString(),
      activeTenantId: orgId
    });
    const res = await getContext({ authorization: `Bearer ${session.id}` });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.workspace).toBe("organization");
    expect(body.data.activeTenantId).toBe(orgId);
    expect(body.data.persona.actorRoles).toEqual(["clinician"]);
  });

  it("denies a revoked session with 403 (session-revoked)", async () => {
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString()
    });
    await revokeSessionsForAccount(client, accountId);
    const res = await getContext({ authorization: `Bearer ${session.id}` });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.errors[0].message).toBe("session-revoked");
  });

  it("challenges a past-expiry session with 401 (session-stale)", async () => {
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() - 1_000).toISOString()
    });
    const res = await getContext({ authorization: `Bearer ${session.id}` });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.errors[0].message).toBe("session-stale");
  });
});
