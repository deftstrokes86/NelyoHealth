import { describe, expect, it } from "vitest";
import { createRefundDraftDto } from "./refunds.js";

describe("api client refund dto", () => {
  it("maps a refund draft request into a public dto", () => {
    const dto = createRefundDraftDto({
      refundId: "refund-2",
      paymentId: "payment-2",
      orderId: "order-2",
      status: "completed",
      amount: "18000",
      currency: "NGN",
      completedAt: "2026-07-07T09:00:00.000Z"
    });

    expect(dto).toMatchObject({
      refundId: "refund-2",
      paymentId: "payment-2",
      orderId: "order-2",
      status: "completed",
      amount: "18000",
      currency: "NGN",
      completedAt: "2026-07-07T09:00:00.000Z"
    });
  });
});
