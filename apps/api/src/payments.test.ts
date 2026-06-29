import { describe, expect, it } from "vitest";
import { createPaymentDraft } from "./payments.js";

describe("payment draft contract", () => {
  it("creates a payment draft with the expected shape", () => {
    const payment = createPaymentDraft({
      paymentId: "payment-1",
      orderId: "order-1",
      status: "authorized",
      amount: "25000",
      currency: "NGN",
      authorizedAt: "2026-07-01T00:00:00.000Z",
      settledAt: null
    });

    expect(payment).toMatchObject({
      paymentId: "payment-1",
      orderId: "order-1",
      status: "authorized",
      amount: "25000",
      currency: "NGN",
      authorizedAt: "2026-07-01T00:00:00.000Z",
      settledAt: null
    });
  });
});
