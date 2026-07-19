import { describe, expect, it } from "vitest";
import type {
  Organization,
  OrganizationMembership,
  RoleAssignment,
  Session,
  UserAccount
} from "@nelyohealth/domain";
import {
  resolveActingContext,
  resolveTenancyAccess,
  type ActingContextPorts
} from "./acting-context-resolver.js";

interface FakeState {
  accounts: UserAccount[];
  sessions: Session[];
  memberships: OrganizationMembership[];
  roleAssignments: RoleAssignment[];
  organizations: Organization[];
}

function createFakePorts(state: FakeState): ActingContextPorts {
  return {
    getUserAccountById: async (accountId) =>
      state.accounts.find((account) => account.id === accountId) ?? null,
    getSessionById: async (sessionId) =>
      state.sessions.find((session) => session.id === sessionId) ?? null,
    listMembershipsForPerson: async (personId) =>
      state.memberships.filter((membership) => membership.personId === personId),
    listRoleAssignmentsForMembership: async (membershipId) =>
      state.roleAssignments.filter((role) => role.membershipId === membershipId),
    getOrganizationById: async (tenantId) =>
      state.organizations.find((org) => org.id === tenantId) ?? null
  };
}

const account: UserAccount = {
  id: "acc-1",
  personId: "person-1",
  loginEmail: "amina@example.test",
  status: "active"
};

const org: Organization = {
  id: "org-1",
  legalName: "Clinic Group Ltd",
  displayName: "Clinic Group",
  status: "active"
};

function activeSession(overrides: Partial<Session> = {}): Session {
  return {
    id: "sess-1",
    userAccountId: "acc-1",
    status: "active",
    authLevel: "primary",
    expiresAtIso: new Date(Date.now() + 60_000).toISOString(),
    ...overrides
  };
}

function baseState(): FakeState {
  return {
    accounts: [account],
    sessions: [],
    memberships: [],
    roleAssignments: [],
    organizations: [org]
  };
}

describe("resolveActingContext — workspace & persona", () => {
  it("resolves the Personal workspace when the session has no active tenant", async () => {
    const state = baseState();
    state.sessions.push(activeSession({ activeTenantId: undefined }));

    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });

    expect(ctx.workspace).toBe("personal");
    expect(ctx.activeTenantId).toBeNull();
    expect(ctx.activeTenantValid).toBe(false);
    expect(ctx.activeTenantReasonCode).toBe("personal-context");
    expect(ctx.persona).toEqual({
      kind: "personal",
      actorRole: "patient",
      actorRoles: ["patient"]
    });
    expect(ctx.sessionStatus).toBe("active");
  });

  it("resolves the Organization workspace and persona from active roles", async () => {
    const state = baseState();
    state.sessions.push(activeSession({ activeTenantId: "org-1" }));
    state.memberships.push({
      id: "mem-1",
      organizationId: "org-1",
      personId: "person-1",
      status: "active",
      activeRoleAssignmentIds: ["role-1"]
    });
    state.roleAssignments.push(
      {
        id: "role-1",
        organizationId: "org-1",
        membershipId: "mem-1",
        roleCode: "clinician",
        status: "active",
        facilityId: "fac-1"
      },
      {
        id: "role-2",
        organizationId: "org-1",
        membershipId: "mem-1",
        roleCode: "billing",
        status: "revoked"
      }
    );

    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });

    expect(ctx.workspace).toBe("organization");
    expect(ctx.activeTenantId).toBe("org-1");
    expect(ctx.activeTenantValid).toBe(true);
    expect(ctx.activeTenantReasonCode).toBe("tenant-valid");
    expect(ctx.persona.kind).toBe("organization");
    // Only the active role is part of the persona capacity.
    expect(ctx.persona.actorRoles).toEqual(["clinician"]);
    expect(ctx.persona.actorRole).toBe("clinician");
    // Membership read model carries both role scopes with facilities unioned.
    const scope = ctx.memberships[0].roleScopes.find((s) => s.roleCode === "clinician");
    expect(scope?.facilityIds).toEqual(["fac-1"]);
  });
});

describe("resolveActingContext — active-tenant claim validation", () => {
  it("degrades to Personal when the person has no membership in the claimed tenant", async () => {
    const state = baseState();
    state.sessions.push(activeSession({ activeTenantId: "org-1" }));
    // No membership rows.
    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });
    expect(ctx.workspace).toBe("personal");
    expect(ctx.activeTenantId).toBeNull();
    expect(ctx.activeTenantValid).toBe(false);
    expect(ctx.activeTenantReasonCode).toBe("membership-missing");
  });

  it("degrades to Personal when the membership is not active", async () => {
    const state = baseState();
    state.sessions.push(activeSession({ activeTenantId: "org-1" }));
    state.memberships.push({
      id: "mem-1",
      organizationId: "org-1",
      personId: "person-1",
      status: "suspended",
      activeRoleAssignmentIds: []
    });
    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });
    expect(ctx.activeTenantValid).toBe(false);
    expect(ctx.activeTenantReasonCode).toBe("membership-not-active");
  });

  it("degrades to Personal when the organization itself is not active", async () => {
    const state = baseState();
    state.organizations[0] = { ...org, status: "offboarded" };
    state.sessions.push(activeSession({ activeTenantId: "org-1" }));
    state.memberships.push({
      id: "mem-1",
      organizationId: "org-1",
      personId: "person-1",
      status: "active",
      activeRoleAssignmentIds: []
    });
    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });
    expect(ctx.activeTenantValid).toBe(false);
    expect(ctx.activeTenantReasonCode).toBe("tenant-not-active");
  });
});

describe("resolveActingContext — session status mapping", () => {
  it("maps a revoked session to revoked", async () => {
    const state = baseState();
    state.sessions.push(activeSession({ status: "revoked" }));
    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });
    expect(ctx.sessionStatus).toBe("revoked");
  });

  it("maps an expired session (by status) to stale", async () => {
    const state = baseState();
    state.sessions.push(activeSession({ status: "expired" }));
    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });
    expect(ctx.sessionStatus).toBe("stale");
  });

  it("maps an active-but-past-expiry session to stale", async () => {
    const state = baseState();
    state.sessions.push(
      activeSession({ expiresAtIso: new Date(Date.now() - 1_000).toISOString() })
    );
    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });
    expect(ctx.sessionStatus).toBe("stale");
  });

  it("treats a missing session as revoked and reports elevated authLevel from the session", async () => {
    const state = baseState();
    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "nope"
    });
    expect(ctx.sessionStatus).toBe("revoked");
    expect(ctx.authLevel).toBe("primary");
  });

  it("carries the elevated authLevel through", async () => {
    const state = baseState();
    state.sessions.push(activeSession({ authLevel: "elevated" }));
    const ctx = await resolveActingContext(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1"
    });
    expect(ctx.authLevel).toBe("elevated");
  });

  it("throws when the account cannot be resolved (post-authentication invariant)", async () => {
    const state = baseState();
    await expect(
      resolveActingContext(createFakePorts(state), { accountId: "ghost", sessionId: "sess-1" })
    ).rejects.toThrow(/account ghost not found/);
  });
});

describe("resolveTenancyAccess — resolver feeding the tenancy decision", () => {
  function orgState(): FakeState {
    const state = baseState();
    state.sessions.push(activeSession({ activeTenantId: "org-1" }));
    state.memberships.push({
      id: "mem-1",
      organizationId: "org-1",
      personId: "person-1",
      status: "active",
      activeRoleAssignmentIds: ["role-1"]
    });
    state.roleAssignments.push({
      id: "role-1",
      organizationId: "org-1",
      membershipId: "mem-1",
      roleCode: "clinician",
      status: "active",
      facilityId: "fac-1"
    });
    return state;
  }

  it("allows access to the active tenant with a matching active role", async () => {
    const { decision, actingContext } = await resolveTenancyAccess(createFakePorts(orgState()), {
      accountId: "acc-1",
      sessionId: "sess-1",
      accessRequestId: "req-1",
      requestedTenantId: "org-1",
      requiredRoleCode: "clinician",
      requestedFacilityId: "fac-1",
      allowTenantSwitch: false
    });
    expect(decision.status).toBe("allowed");
    expect(decision.resolvedTenantId).toBe("org-1");
    expect(actingContext.workspace).toBe("organization");
  });

  it("challenges when switching to a different tenant is required", async () => {
    const state = orgState();
    // Add a second tenant the user belongs to, but the session is active on org-1.
    state.organizations.push({
      id: "org-2",
      legalName: "Second Ltd",
      displayName: "Second",
      status: "active"
    });
    state.memberships.push({
      id: "mem-2",
      organizationId: "org-2",
      personId: "person-1",
      status: "active",
      activeRoleAssignmentIds: ["role-2"]
    });
    state.roleAssignments.push({
      id: "role-2",
      organizationId: "org-2",
      membershipId: "mem-2",
      roleCode: "clinician",
      status: "active"
    });

    const { decision } = await resolveTenancyAccess(createFakePorts(state), {
      accountId: "acc-1",
      sessionId: "sess-1",
      accessRequestId: "req-2",
      requestedTenantId: "org-2",
      requiredRoleCode: "clinician",
      allowTenantSwitch: false
    });
    expect(decision.status).toBe("challenge-required");
    expect(decision.reasonCode).toBe("tenant-switch-required");
  });

  it("denies access to a tenant the person has no membership in", async () => {
    const { decision } = await resolveTenancyAccess(createFakePorts(orgState()), {
      accountId: "acc-1",
      sessionId: "sess-1",
      accessRequestId: "req-3",
      requestedTenantId: "org-unknown",
      requiredRoleCode: "clinician",
      allowTenantSwitch: true
    });
    expect(decision.status).toBe("denied");
    expect(decision.reasonCode).toBe("tenant-membership-missing");
  });
});
