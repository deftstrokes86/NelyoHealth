import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  assignRole,
  createDatabaseClient,
  createDatabasePool,
  createFacility,
  createMembership,
  createOrganization,
  createPerson,
  createSession,
  createUserAccount,
  updateOrganizationStatus
} from "../../packages/database/src/index.js";
import {
  createPgActingContextPorts,
  resolveActingContext,
  resolveTenancyAccess
} from "../../apps/api/src/acting-context-resolver.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

describe.skipIf(!shouldRun)("acting-context resolver integration (identity + tenancy)", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const run = `ac-${Date.now()}`;
  let accountId = "";
  let personId = "";
  let orgId = "";
  let facilityId = "";

  beforeAll(async () => {
    await client.connect();
    const person = await createPerson(client, { displayName: `${run}-person` });
    personId = person.id;
    const account = await createUserAccount(client, {
      personId: person.id,
      loginEmail: `${run}@example.test`,
      status: "active"
    });
    accountId = account.id;

    const org = await createOrganization(client, {
      legalName: `${run} Clinic Ltd`,
      displayName: `${run} Clinic`
    });
    orgId = org.id;
    const facility = await createFacility(client, {
      organizationId: org.id,
      displayName: `${run} Branch`
    });
    facilityId = facility.id;

    const membership = await createMembership(client, {
      organizationId: org.id,
      personId: person.id,
      status: "active"
    });
    await assignRole(client, {
      organizationId: org.id,
      membershipId: membership.id,
      roleCode: "clinician",
      facilityId: facility.id
    });
  });

  afterAll(async () => {
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
    await client.query(
      `DELETE FROM nelyo_tenancy.facility f USING nelyo_tenancy.organization o
       WHERE f.organization_id = o.id AND o.legal_name LIKE $1`,
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
    await pool.end();
  });

  it("derives the Organization workspace from a session with a valid active tenant", async () => {
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString(),
      activeTenantId: orgId
    });

    const ctx = await resolveActingContext(createPgActingContextPorts(pool), {
      accountId,
      sessionId: session.id
    });

    expect(ctx.identity).toEqual({ accountId, personId });
    expect(ctx.workspace).toBe("organization");
    expect(ctx.activeTenantId).toBe(orgId);
    expect(ctx.activeTenantValid).toBe(true);
    expect(ctx.persona.kind).toBe("organization");
    expect(ctx.persona.actorRoles).toEqual(["clinician"]);
    expect(ctx.memberships).toHaveLength(1);
    expect(ctx.memberships[0].roleScopes[0].facilityIds).toEqual([facilityId]);
  });

  it("derives the Personal workspace when the session has no active tenant", async () => {
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString()
    });
    const ctx = await resolveActingContext(createPgActingContextPorts(pool), {
      accountId,
      sessionId: session.id
    });
    expect(ctx.workspace).toBe("personal");
    expect(ctx.activeTenantId).toBeNull();
    expect(ctx.persona.actorRole).toBe("patient");
  });

  it("degrades to Personal and flags the claim when the active org is offboarded", async () => {
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString(),
      activeTenantId: orgId
    });
    await updateOrganizationStatus(client, orgId, "offboarded");
    try {
      const ctx = await resolveActingContext(createPgActingContextPorts(pool), {
        accountId,
        sessionId: session.id
      });
      expect(ctx.workspace).toBe("personal");
      expect(ctx.activeTenantValid).toBe(false);
      expect(ctx.activeTenantReasonCode).toBe("tenant-not-active");
    } finally {
      await updateOrganizationStatus(client, orgId, "active");
    }
  });

  it("resolves tenancy access to an allowed decision for the active tenant + role", async () => {
    const session = await createSession(client, {
      userAccountId: accountId,
      expiresAtIso: new Date(Date.now() + 60_000).toISOString(),
      activeTenantId: orgId
    });
    const { decision, actingContext } = await resolveTenancyAccess(
      createPgActingContextPorts(pool),
      {
        accountId,
        sessionId: session.id,
        accessRequestId: `${run}-req`,
        requestedTenantId: orgId,
        requiredRoleCode: "clinician",
        requestedFacilityId: facilityId,
        allowTenantSwitch: false
      }
    );
    expect(actingContext.activeTenantValid).toBe(true);
    expect(decision.status).toBe("allowed");
    expect(decision.resolvedTenantId).toBe(orgId);
  });
});
