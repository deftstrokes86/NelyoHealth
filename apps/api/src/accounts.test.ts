import { describe, expect, it } from "vitest";
import { createAccountDraft } from "./accounts.js";

describe("account draft contract", () => {
  it("creates an account draft with the expected shape", () => {
    const account = createAccountDraft({
      accountId: "account-1",
      personId: "person-1",
      tenantId: "tenant-1",
      roles: ["patient"],
      consentState: "active",
      createdAt: "2026-07-01T00:00:00.000Z"
    });

    expect(account).toMatchObject({
      accountId: "account-1",
      personId: "person-1",
      tenantId: "tenant-1",
      roles: ["patient"],
      consentState: "active",
      createdAt: "2026-07-01T00:00:00.000Z"
    });
  });
});
