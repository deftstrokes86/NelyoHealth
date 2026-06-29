import { describe, expect, it } from "vitest";
import { createPaymentDraft } from "./payments.js";
import { createRefundDraft } from "./refunds.js";
import {
  handlePaymentTransitionRoute,
  handleProviderDisclosureEligibilityRoute,
  handleRefundTransitionRoute
} from "./runtime-routes.js";

describe("runtime route handlers", () => {
  it("returns an envelope for valid payment transitions", () => {
    const response = handlePaymentTransitionRoute({
      requestId: "req-1",
      correlationId: "corr-1",
      input: {
        payment: createPaymentDraft({
          paymentId: "payment-route-1",
          orderId: "order-route-1",
          status: "quoted",
          amount: "5000",
          currency: "NGN",
          authorizedAt: null,
          settledAt: null
        }),
        toStatus: "initiated",
        transitionedAt: "2026-07-10T09:00:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      paymentId: "payment-route-1",
      status: "initiated"
    });
    expect(response.errors).toEqual([]);
  });

  it("returns an error envelope for invalid payment transitions", () => {
    const response = handlePaymentTransitionRoute({
      requestId: "req-2",
      correlationId: "corr-2",
      input: {
        payment: createPaymentDraft({
          paymentId: "payment-route-2",
          orderId: "order-route-2",
          status: "quoted",
          amount: "5000",
          currency: "NGN",
          authorizedAt: null,
          settledAt: null
        }),
        toStatus: "settled",
        transitionedAt: "2026-07-10T09:00:00.000Z"
      }
    });

    expect(response.data).toBeNull();
    expect(response.errors).toMatchObject([
      {
        code: "PAYMENT_TRANSITION_FAILED"
      }
    ]);
  });

  it("returns an envelope for valid refund transitions", () => {
    const response = handleRefundTransitionRoute({
      requestId: "req-3",
      correlationId: "corr-3",
      input: {
        refund: createRefundDraft({
          refundId: "refund-route-1",
          paymentId: "payment-route-1",
          orderId: "order-route-1",
          status: "requested",
          amount: "5000",
          currency: "NGN",
          completedAt: null
        }),
        toStatus: "eligibility-review",
        transitionedAt: "2026-07-10T10:00:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      refundId: "refund-route-1",
      status: "eligibility-review"
    });
    expect(response.errors).toEqual([]);
  });

  it("returns disclosure eligibility envelope with deterministic decision", () => {
    const response = handleProviderDisclosureEligibilityRoute({
      requestId: "req-4",
      correlationId: "corr-4",
      input: {
        orderId: "order-route-4",
        providerDisplayName: "Provider Route",
        paymentStatus: "authorized",
        hasAuthorization: true,
        sameTenant: true,
        evaluatedAt: "2026-07-10T11:00:00.000Z"
      }
    });

    expect(response.data).toMatchObject({
      orderId: "order-route-4",
      status: "not-eligible",
      reasonCode: "payment-not-settled"
    });
    expect(response.errors).toEqual([]);
  });
});
