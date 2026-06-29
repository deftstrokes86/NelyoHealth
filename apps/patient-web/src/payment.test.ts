import { describe, expect, it } from "vitest";
import { createPaymentViewModel } from "./payment.js";

describe("patient web payment view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createPaymentViewModel({
      paymentId: "payment-4",
      orderId: "order-4",
      status: "authorized",
      amount: "45000",
      currency: "NGN",
      authorizedAt: "2026-07-04T00:00:00.000Z",
      settledAt: null
    });

    expect(viewModel).toMatchObject({
      paymentId: "payment-4",
      orderId: "order-4",
      status: "authorized",
      amount: "45000",
      currency: "NGN",
      authorizedAt: "2026-07-04T00:00:00.000Z",
      settledAt: null
    });
  });
});
