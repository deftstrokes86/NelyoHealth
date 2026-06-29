import { describe, expect, it } from "vitest";
import { createPaymentDraft } from "../../apps/api/src/payments.js";
import { createRefundDraft } from "../../apps/api/src/refunds.js";
import { transitionPaymentStatus } from "../../apps/api/src/payment-handlers.js";
import { transitionRefundStatus } from "../../apps/api/src/refund-handlers.js";
import { evaluateProviderDisclosureEligibility } from "../../apps/api/src/provider-disclosure-handlers.js";

describe("payment and refund runtime transitions", () => {
  it("transitions a payment from quoted to settled with contract-safe fields", () => {
    const quoted = createPaymentDraft({
      paymentId: "payment-runtime-1",
      orderId: "order-runtime-1",
      status: "quoted",
      amount: "10000",
      currency: "NGN",
      authorizedAt: null,
      settledAt: null
    });

    const initiated = transitionPaymentStatus({
      payment: quoted,
      toStatus: "initiated",
      transitionedAt: "2026-07-09T09:00:00.000Z"
    });
    const authorized = transitionPaymentStatus({
      payment: initiated,
      toStatus: "authorized",
      transitionedAt: "2026-07-09T09:01:00.000Z"
    });
    const settled = transitionPaymentStatus({
      payment: authorized,
      toStatus: "settled",
      transitionedAt: "2026-07-09T09:02:00.000Z"
    });

    expect(settled.status).toBe("settled");
    expect(settled.authorizedAt).toBe("2026-07-09T09:01:00.000Z");
    expect(settled.settledAt).toBe("2026-07-09T09:02:00.000Z");
    expect(settled).not.toHaveProperty("providerId");
    expect(settled).not.toHaveProperty("providerAddress");
  });

  it("rejects invalid payment transitions", () => {
    const quoted = createPaymentDraft({
      paymentId: "payment-runtime-2",
      orderId: "order-runtime-2",
      status: "quoted",
      amount: "10000",
      currency: "NGN",
      authorizedAt: null,
      settledAt: null
    });

    expect(() =>
      transitionPaymentStatus({
        payment: quoted,
        toStatus: "settled",
        transitionedAt: "2026-07-09T09:10:00.000Z"
      })
    ).toThrow(/Invalid payment transition/);
  });

  it("transitions refund from requested to completed", () => {
    const requested = createRefundDraft({
      refundId: "refund-runtime-1",
      paymentId: "payment-runtime-1",
      orderId: "order-runtime-1",
      status: "requested",
      amount: "10000",
      currency: "NGN",
      completedAt: null
    });

    const review = transitionRefundStatus({
      refund: requested,
      toStatus: "eligibility-review",
      transitionedAt: "2026-07-09T10:00:00.000Z"
    });
    const approved = transitionRefundStatus({
      refund: review,
      toStatus: "approved",
      transitionedAt: "2026-07-09T10:01:00.000Z"
    });
    const processing = transitionRefundStatus({
      refund: approved,
      toStatus: "processing",
      transitionedAt: "2026-07-09T10:02:00.000Z"
    });
    const completed = transitionRefundStatus({
      refund: processing,
      toStatus: "completed",
      transitionedAt: "2026-07-09T10:03:00.000Z"
    });

    expect(completed.status).toBe("completed");
    expect(completed.completedAt).toBe("2026-07-09T10:03:00.000Z");
  });

  it("evaluates payment-to-disclosure eligibility deterministically", () => {
    const pendingDecision = evaluateProviderDisclosureEligibility({
      orderId: "order-runtime-4",
      providerDisplayName: "Provider Pending",
      paymentStatus: "authorized",
      hasAuthorization: true,
      sameTenant: true,
      evaluatedAt: "2026-07-09T11:00:00.000Z"
    });

    expect(pendingDecision).toMatchObject({
      orderId: "order-runtime-4",
      status: "not-eligible",
      reasonCode: "payment-not-settled",
      providerDisplayName: "Provider Pending",
      authorizedAt: null
    });

    const settledDecision = evaluateProviderDisclosureEligibility({
      orderId: "order-runtime-4",
      providerDisplayName: "Provider Eligible",
      paymentStatus: "settled",
      hasAuthorization: true,
      sameTenant: true,
      evaluatedAt: "2026-07-09T11:01:00.000Z"
    });

    expect(settledDecision).toMatchObject({
      orderId: "order-runtime-4",
      status: "eligible",
      reasonCode: "eligible",
      providerDisplayName: "Provider Eligible",
      authorizedAt: "2026-07-09T11:01:00.000Z"
    });
    expect(settledDecision).not.toHaveProperty("providerAddress");
  });

  it("denies disclosure when authorization is missing", () => {
    const deniedDecision = evaluateProviderDisclosureEligibility({
      orderId: "order-runtime-5",
      providerDisplayName: "Provider Unauthorized",
      paymentStatus: "settled",
      hasAuthorization: false,
      sameTenant: true,
      evaluatedAt: "2026-07-09T11:10:00.000Z"
    });

    expect(deniedDecision).toMatchObject({
      orderId: "order-runtime-5",
      status: "denied",
      reasonCode: "authorization-missing",
      providerDisplayName: "Provider Unauthorized",
      authorizedAt: null
    });
  });

  it("denies disclosure when tenant context mismatches", () => {
    const deniedDecision = evaluateProviderDisclosureEligibility({
      orderId: "order-runtime-6",
      providerDisplayName: "Provider Wrong Tenant",
      paymentStatus: "settled",
      hasAuthorization: true,
      sameTenant: false,
      evaluatedAt: "2026-07-09T11:20:00.000Z"
    });

    expect(deniedDecision).toMatchObject({
      orderId: "order-runtime-6",
      status: "denied",
      reasonCode: "tenant-mismatch",
      providerDisplayName: "Provider Wrong Tenant",
      authorizedAt: null
    });
  });
});
