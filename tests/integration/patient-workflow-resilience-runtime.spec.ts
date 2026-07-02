import { describe, expect, it } from "vitest";
import {
  beginWorkflowAttempt,
  createInitialWorkflowResilienceState,
  isWorkflowRetryDue,
  markWorkflowConnectionRestored,
  registerWorkflowSuccess,
  registerWorkflowTransientFailure
} from "../../apps/patient-web/src/workflow-resilience.js";
import { createPaymentViewModel } from "../../apps/patient-web/src/payment.js";
import { evaluateProviderDisclosureEligibility } from "../../apps/api/src/provider-disclosure-handlers.js";
import { createPaymentDraft, type PaymentDraft } from "../../apps/api/src/payments.js";
import { transitionPaymentStatus } from "../../apps/api/src/payment-handlers.js";

describe("patient workflow low-bandwidth resilience runtime", () => {
  it("retries after degraded network failure and reaches successful completion", () => {
    let resilience = createInitialWorkflowResilienceState({
      workflowId: "payment-confirmation",
      now: "2026-07-02T12:00:00.000Z"
    });

    resilience = beginWorkflowAttempt(resilience, {
      now: "2026-07-02T12:00:01.000Z",
      connectionMode: "degraded"
    });
    resilience = registerWorkflowTransientFailure(resilience, {
      now: "2026-07-02T12:00:02.000Z",
      errorCode: "network-timeout",
      connectionMode: "degraded"
    });

    expect(resilience.status).toBe("retry-pending");
    expect(resilience.backoffMs).toBe(1000);
    expect(isWorkflowRetryDue(resilience, "2026-07-02T12:00:02.500Z")).toBe(false);
    expect(isWorkflowRetryDue(resilience, "2026-07-02T12:00:03.000Z")).toBe(true);

    resilience = beginWorkflowAttempt(resilience, {
      now: "2026-07-02T12:00:03.100Z",
      connectionMode: "online"
    });
    resilience = registerWorkflowSuccess(resilience, "2026-07-02T12:00:03.900Z");

    expect(resilience).toMatchObject({
      status: "succeeded",
      attemptCount: 2,
      pendingDraftPersisted: false
    });
  });

  it("keeps provider disclosure gated until payment workflow recovers from offline queue", () => {
    const paymentViewModel = createPaymentViewModel({
      paymentId: "payment-low-bandwidth-1",
      orderId: "order-low-bandwidth-1",
      status: "initiated",
      amount: "12000",
      currency: "NGN",
      authorizedAt: null,
      settledAt: null
    });

    let resilience = createInitialWorkflowResilienceState({
      workflowId: "payment-settlement",
      now: "2026-07-02T12:10:00.000Z"
    });

    resilience = beginWorkflowAttempt(resilience, {
      now: "2026-07-02T12:10:01.000Z",
      connectionMode: "offline"
    });

    const whileOffline = evaluateProviderDisclosureEligibility({
      orderId: paymentViewModel.orderId,
      providerDisplayName: "Synthetic Provider",
      paymentStatus: paymentViewModel.status,
      hasAuthorization: true,
      sameTenant: true,
      evaluatedAt: "2026-07-02T12:10:01.000Z"
    });

    expect(resilience.status).toBe("offline-queued");
    expect(whileOffline.reasonCode).toBe("payment-not-settled");

    resilience = markWorkflowConnectionRestored(resilience, "2026-07-02T12:10:05.000Z");
    expect(isWorkflowRetryDue(resilience, "2026-07-02T12:10:05.000Z")).toBe(true);

    resilience = beginWorkflowAttempt(resilience, {
      now: "2026-07-02T12:10:05.100Z",
      connectionMode: "online"
    });
    resilience = registerWorkflowSuccess(resilience, "2026-07-02T12:10:05.900Z");

    const settled = settlePaymentForDisclosure(paymentViewModel.paymentId, paymentViewModel.orderId);
    const afterRecovery = evaluateProviderDisclosureEligibility({
      orderId: settled.orderId,
      providerDisplayName: "Synthetic Provider",
      paymentStatus: settled.status,
      hasAuthorization: true,
      sameTenant: true,
      evaluatedAt: "2026-07-02T12:10:06.000Z"
    });

    expect(resilience.status).toBe("succeeded");
    expect(afterRecovery.reasonCode).toBe("eligible");
  });

  it("terminates retries at max-attempt boundary and preserves deterministic failure state", () => {
    let resilience = createInitialWorkflowResilienceState({
      workflowId: "booking-submit",
      now: "2026-07-02T12:20:00.000Z",
      maxAttempts: 2
    });

    resilience = beginWorkflowAttempt(resilience, {
      now: "2026-07-02T12:20:01.000Z",
      connectionMode: "online"
    });
    resilience = registerWorkflowTransientFailure(resilience, {
      now: "2026-07-02T12:20:02.000Z",
      errorCode: "gateway-timeout"
    });

    resilience = beginWorkflowAttempt(resilience, {
      now: "2026-07-02T12:20:03.500Z",
      connectionMode: "degraded"
    });
    resilience = registerWorkflowTransientFailure(resilience, {
      now: "2026-07-02T12:20:04.000Z",
      errorCode: "gateway-timeout",
      connectionMode: "degraded"
    });

    expect(resilience).toMatchObject({
      status: "failed",
      attemptCount: 2,
      lastErrorCode: "gateway-timeout",
      nextRetryAt: null
    });
  });
});

function settlePaymentForDisclosure(paymentId: string, orderId: string): PaymentDraft {
  const quoted = createPaymentDraft({
    paymentId,
    orderId,
    status: "quoted",
    amount: "12000",
    currency: "NGN",
    authorizedAt: null,
    settledAt: null
  });

  const initiated = transitionPaymentStatus({
    payment: quoted,
    toStatus: "initiated",
    transitionedAt: "2026-07-02T12:10:05.300Z"
  });
  const authorized = transitionPaymentStatus({
    payment: initiated,
    toStatus: "authorized",
    transitionedAt: "2026-07-02T12:10:05.500Z"
  });
  return transitionPaymentStatus({
    payment: authorized,
    toStatus: "settled",
    transitionedAt: "2026-07-02T12:10:05.700Z"
  });
}
