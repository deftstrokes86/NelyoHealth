import { describe, expect, it } from "vitest";
import { createRefundViewModel } from "./refund.js";

describe("patient web refund view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createRefundViewModel({
      refundId: "refund-4",
      paymentId: "payment-4",
      orderId: "order-4",
      status: "approved",
      amount: "24000",
      currency: "NGN",
      completedAt: null
    });

    expect(viewModel).toMatchObject({
      refundId: "refund-4",
      paymentId: "payment-4",
      orderId: "order-4",
      status: "approved",
      amount: "24000",
      currency: "NGN",
      completedAt: null
    });
  });
});
