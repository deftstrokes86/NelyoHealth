import { describe, expect, it } from "vitest";
import { createProviderDisclosureDecisionViewModel } from "./provider-disclosure.js";

describe("patient web provider disclosure view model", () => {
  it("maps provider disclosure dto into patient-facing view model", () => {
    const viewModel = createProviderDisclosureDecisionViewModel({
      orderId: "order-4",
      status: "denied",
      reasonCode: "authorization-missing",
      providerDisplayName: "Provider C",
      authorizedAt: null
    });

    expect(viewModel).toMatchObject({
      orderId: "order-4",
      status: "denied",
      reasonCode: "authorization-missing",
      providerDisplayName: "Provider C",
      authorizedAt: null
    });
  });
});
