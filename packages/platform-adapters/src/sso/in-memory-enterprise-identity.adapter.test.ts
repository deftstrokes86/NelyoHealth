import { describe, expect, it } from "vitest";
import { InMemoryEnterpriseIdentityAdapter } from "./in-memory-enterprise-identity.adapter.js";

describe("in-memory enterprise identity adapter", () => {
  it("starts and completes OIDC authentication", async () => {
    const adapter = new InMemoryEnterpriseIdentityAdapter();

    const start = await adapter.startAuthentication({
      tenantId: "tenant-a",
      protocol: "oidc",
      requestedByAccountId: "account-1",
      redirectUri: "https://example.test/callback",
      state: "state-1"
    });

    expect(start.authorizationUrl).toContain("protocol=oidc");

    const complete = await adapter.completeAuthentication({
      tenantId: "tenant-a",
      protocol: "oidc",
      state: "state-1",
      codeOrAssertion: "subject-1",
      redirectUri: "https://example.test/callback"
    });

    expect(complete).toMatchObject({
      authenticationEvent: "authenticated",
      reasonCode: "authenticated",
      externalSubject: "subject-1"
    });
  });

  it("provisions JIT identity and then imports roster entries", async () => {
    const adapter = new InMemoryEnterpriseIdentityAdapter();

    const jit = await adapter.provisionJustInTime({
      tenantId: "tenant-b",
      externalSubject: "subject-2",
      email: "provider@example.com",
      displayName: "Provider 2",
      targetRoleCodes: ["doctor"]
    });

    expect(jit.status).toBe("provisioned");

    const roster = await adapter.importWorkforceRoster({
      tenantId: "tenant-b",
      importBatchId: "batch-1",
      records: [
        {
          rosterId: "r-1",
          externalSubject: "subject-2",
          email: "provider@example.com",
          displayName: "Provider 2",
          roleCodes: ["doctor"],
          facilityIds: ["facility-1"],
          active: true
        },
        {
          rosterId: "r-2",
          externalSubject: "subject-3",
          email: "nurse@example.com",
          displayName: "Nurse 3",
          roleCodes: ["nurse"],
          facilityIds: ["facility-2"],
          active: false
        },
        {
          rosterId: "r-3",
          externalSubject: "",
          email: "invalid@example.com",
          displayName: "Invalid",
          roleCodes: ["support"],
          facilityIds: [],
          active: true
        }
      ]
    });

    expect(roster).toMatchObject({
      imported: 1,
      deactivated: 1,
      skipped: 1
    });
  });
});
