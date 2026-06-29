import { describe, expect, it } from "vitest";
import { createAccountViewModel } from "./account.js";

describe("patient web account view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createAccountViewModel({
      accountId: "account-4",
      personId: "person-4",
      tenantId: "tenant-4",
      roles: ["patient"],
      consentState: "active",
      createdAt: "2026-07-04T00:00:00.000Z"
    });

    expect(viewModel).toMatchObject({
      accountId: "account-4",
      personId: "person-4",
      tenantId: "tenant-4",
      roles: ["patient"],
      consentState: "active",
      createdAt: "2026-07-04T00:00:00.000Z"
    });
  });
});
