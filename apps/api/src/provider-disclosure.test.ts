import { describe, expect, it } from "vitest";
import { createProviderDisclosureDecisionDraft } from "./provider-disclosure.js";

describe("provider disclosure decision contract", () => {
  it("creates a provider disclosure decision with allowed fields only", () => {
    const decision = createProviderDisclosureDecisionDraft({
      orderId: "order-1",
      status: "not-eligible",
      reasonCode: "payment-not-settled",
      providerDisplayName: "Provider A",
      authorizedAt: null,
      providerId: "provider-hidden-1",
      providerAddress: "Hidden Street",
      providerPhone: "+2348000000000"
    });

    expect(decision).toMatchObject({
      orderId: "order-1",
      status: "not-eligible",
      reasonCode: "payment-not-settled",
      providerDisplayName: "Provider A",
      authorizedAt: null
    });
    expect(decision).not.toHaveProperty("providerId");
    expect(decision).not.toHaveProperty("providerAddress");
    expect(decision).not.toHaveProperty("providerPhone");
  });
});
