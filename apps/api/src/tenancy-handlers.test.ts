import { describe, expect, it } from "vitest";
import { createTenancyAccessDraft } from "./tenancy.js";
import {
  evaluateMembershipLifecycleDecision,
  evaluateTenancyAccessDecision
} from "./tenancy-handlers.js";

describe("tenancy decision handlers", () => {
  it("denies when tenant context is missing", () => {
    const decision = evaluateTenancyAccessDecision({
      access: createTenancyAccessDraft({
        accessRequestId: "access-1",
        accountId: "account-1",
        activeTenantId: "tenant-1",
        requestedTenantId: null,
        requiredRoleCode: "doctor",
        allowTenantSwitch: false,
        memberships: [],
        evaluatedAt: "2026-07-02T10:01:00.000Z"
      })
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "tenant-context-missing"
    });
  });

  it("challenges when tenant switch is required but not confirmed", () => {
    const decision = evaluateTenancyAccessDecision({
      access: createTenancyAccessDraft({
        accessRequestId: "access-2",
        accountId: "account-2",
        activeTenantId: "tenant-1",
        requestedTenantId: "tenant-2",
        requiredRoleCode: "doctor",
        allowTenantSwitch: false,
        memberships: [
          {
            membershipId: "membership-2",
            tenantId: "tenant-2",
            status: "active",
            roleScopes: [
              {
                roleCode: "doctor",
                status: "active",
                facilityIds: ["facility-1"]
              }
            ]
          }
        ],
        evaluatedAt: "2026-07-02T10:02:00.000Z"
      })
    });

    expect(decision).toMatchObject({
      status: "challenge-required",
      reasonCode: "tenant-switch-required"
    });
  });

  it("denies when role scope is missing", () => {
    const decision = evaluateTenancyAccessDecision({
      access: createTenancyAccessDraft({
        accessRequestId: "access-3",
        accountId: "account-3",
        activeTenantId: "tenant-1",
        requestedTenantId: "tenant-1",
        requiredRoleCode: "doctor",
        allowTenantSwitch: true,
        memberships: [
          {
            membershipId: "membership-3",
            tenantId: "tenant-1",
            status: "active",
            roleScopes: [
              {
                roleCode: "nurse",
                status: "active",
                facilityIds: ["facility-1"]
              }
            ]
          }
        ],
        evaluatedAt: "2026-07-02T10:03:00.000Z"
      })
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "role-assignment-missing"
    });
  });

  it("allows tenant access and switches tenant context when confirmed", () => {
    const decision = evaluateTenancyAccessDecision({
      access: createTenancyAccessDraft({
        accessRequestId: "access-4",
        accountId: "account-4",
        activeTenantId: "tenant-1",
        requestedTenantId: "tenant-2",
        requiredRoleCode: "doctor",
        requestedFacilityId: "facility-2",
        allowTenantSwitch: true,
        memberships: [
          {
            membershipId: "membership-4",
            tenantId: "tenant-2",
            status: "active",
            roleScopes: [
              {
                roleCode: "doctor",
                status: "active",
                facilityIds: ["facility-2"]
              }
            ]
          }
        ],
        evaluatedAt: "2026-07-02T10:04:00.000Z"
      })
    });

    expect(decision).toMatchObject({
      status: "allowed",
      reasonCode: "allowed",
      sessionTenantAction: "switch-tenant",
      resolvedTenantId: "tenant-2"
    });
  });

  it("applies invitation acceptance from invited to active", () => {
    const decision = evaluateMembershipLifecycleDecision({
      membershipId: "membership-5",
      tenantId: "tenant-1",
      currentStatus: "invited",
      action: "accept-invitation",
      evaluatedAt: "2026-07-02T10:05:00.000Z"
    });

    expect(decision).toMatchObject({
      status: "applied",
      reasonCode: "applied",
      updatedStatus: "active"
    });
  });

  it("applies offboarding and revokes session", () => {
    const decision = evaluateMembershipLifecycleDecision({
      membershipId: "membership-6",
      tenantId: "tenant-2",
      currentStatus: "suspended",
      action: "offboard-membership",
      evaluatedAt: "2026-07-02T10:06:00.000Z"
    });

    expect(decision).toMatchObject({
      status: "applied",
      reasonCode: "applied",
      updatedStatus: "offboarded",
      sessionAction: "revoke-session"
    });
  });
});
