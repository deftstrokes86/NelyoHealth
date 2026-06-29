import { describe, expect, it } from "vitest";
import { createPaymentDraftDto } from "./payments.js";

describe("api client payment dto", () => {
  it("maps a payment draft request into a public dto", () => {
    const dto = createPaymentDraftDto({
      paymentId: "payment-2",
      orderId: "order-2",
      status: "settled",
      amount: "33000",
      currency: "NGN",
      authorizedAt: "2026-07-02T00:00:00.000Z",
      settledAt: "2026-07-02T00:05:00.000Z"
    });

    expect(dto).toMatchObject({
      paymentId: "payment-2",
      orderId: "order-2",
      status: "settled",
      amount: "33000",
      currency: "NGN",
      authorizedAt: "2026-07-02T00:00:00.000Z",
      settledAt: "2026-07-02T00:05:00.000Z"
    });
  });
});
