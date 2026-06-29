import { describe, expect, it } from "vitest";
import { createAccountDraftDto } from "./accounts.js";

describe("api client account dto", () => {
  it("maps an account draft request into a public dto", () => {
    const dto = createAccountDraftDto({
      accountId: "account-2",
      personId: "person-2",
      tenantId: "tenant-2",
      roles: ["patient"],
      consentState: "active",
      createdAt: "2026-07-02T00:00:00.000Z"
    });

    expect(dto).toMatchObject({
      accountId: "account-2",
      personId: "person-2",
      tenantId: "tenant-2",
      roles: ["patient"],
      consentState: "active",
      createdAt: "2026-07-02T00:00:00.000Z"
    });
  });
});
