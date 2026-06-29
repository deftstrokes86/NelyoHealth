import { describe, expect, it } from "vitest";
import { createProviderDisclosureDecisionDraftDto } from "./provider-disclosure.js";

describe("api client provider disclosure dto", () => {
  it("maps provider disclosure decisions into public dto shape", () => {
    const dto = createProviderDisclosureDecisionDraftDto({
      orderId: "order-2",
      status: "eligible",
      reasonCode: "eligible",
      providerDisplayName: "Provider B",
      authorizedAt: "2026-07-02T00:00:00.000Z"
    });

    expect(dto).toMatchObject({
      orderId: "order-2",
      status: "eligible",
      reasonCode: "eligible",
      providerDisplayName: "Provider B",
      authorizedAt: "2026-07-02T00:00:00.000Z"
    });
  });
});
