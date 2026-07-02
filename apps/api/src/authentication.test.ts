import { describe, expect, it } from "vitest";
import { createAuthenticationDraft } from "./authentication.js";

describe("authentication draft contract", () => {
  it("creates an authentication draft with the expected shape", () => {
    const draft = createAuthenticationDraft({
      authRequestId: "auth-draft-1",
      accountId: "account-1",
      personId: "person-1",
      tenantId: "tenant-1",
      intent: "login",
      mode: "password",
      tier: "patient",
      loginIdentifier: "patient@example.com",
      requestedAt: "2026-07-02T09:00:00.000Z"
    });

    expect(draft).toMatchObject({
      authRequestId: "auth-draft-1",
      accountId: "account-1",
      personId: "person-1",
      tenantId: "tenant-1",
      intent: "login",
      mode: "password",
      tier: "patient",
      loginIdentifier: "patient@example.com",
      requestedAt: "2026-07-02T09:00:00.000Z"
    });
  });
});
