import { describe, expect, it } from "vitest";
import { createRefundDraft } from "./refunds.js";

describe("refund draft contract", () => {
  it("creates a refund draft with the expected shape", () => {
    const refund = createRefundDraft({
      refundId: "refund-1",
      paymentId: "payment-1",
      orderId: "order-1",
      status: "processing",
      amount: "12000",
      currency: "NGN",
      completedAt: null
    });

    expect(refund).toMatchObject({
      refundId: "refund-1",
      paymentId: "payment-1",
      orderId: "order-1",
      status: "processing",
      amount: "12000",
      currency: "NGN",
      completedAt: null
    });
  });
});
