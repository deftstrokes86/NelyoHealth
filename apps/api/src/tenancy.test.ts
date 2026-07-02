import { describe, expect, it } from "vitest";
import { createTenancyAccessDraft } from "./tenancy.js";

describe("tenancy access draft contract", () => {
  it("creates a tenancy access draft with the expected shape", () => {
    const draft = createTenancyAccessDraft({
      accessRequestId: "access-1",
      accountId: "account-1",
      activeTenantId: "tenant-1",
      requestedTenantId: "tenant-1",
      requiredRoleCode: "doctor",
      requestedFacilityId: "facility-1",
      allowTenantSwitch: true,
      memberships: [
        {
          membershipId: "membership-1",
          tenantId: "tenant-1",
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
      evaluatedAt: "2026-07-02T10:00:00.000Z"
    });

    expect(draft).toMatchObject({
      accessRequestId: "access-1",
      accountId: "account-1",
      activeTenantId: "tenant-1",
      requestedTenantId: "tenant-1",
      requiredRoleCode: "doctor",
      requestedFacilityId: "facility-1",
      allowTenantSwitch: true,
      evaluatedAt: "2026-07-02T10:00:00.000Z"
    });
    expect(draft.memberships).toHaveLength(1);
  });
});
