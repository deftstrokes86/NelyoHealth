import { createApiEnvelope, createErrorEnvelope, type ApiEnvelope } from "./response.js";
import { transitionPaymentStatus, type PaymentTransitionInput } from "./payment-handlers.js";
import { transitionRefundStatus, type RefundTransitionInput } from "./refund-handlers.js";
import {
  evaluateProviderDisclosureEligibility,
  type ProviderDisclosureEligibilityInput
} from "./provider-disclosure-handlers.js";
import {
  evaluateAuthenticationDecision,
  type EvaluateAuthenticationDecisionInput
} from "./authentication-handlers.js";
import {
  evaluateTenancyAccessDecision,
  type EvaluateTenancyAccessDecisionInput
} from "./tenancy-handlers.js";
import type { PaymentDraft } from "./payments.js";
import type { RefundDraft } from "./refunds.js";
import type { ProviderDisclosureDecisionDraft } from "./provider-disclosure.js";
import type { AuthenticationDecisionDraft } from "./authentication.js";
import type { TenancyAccessDecisionDraft } from "./tenancy.js";

export interface RuntimeRouteMeta {
  requestId: string;
  correlationId: string;
}

export interface PaymentTransitionRouteRequest extends RuntimeRouteMeta {
  input: PaymentTransitionInput;
}

export interface RefundTransitionRouteRequest extends RuntimeRouteMeta {
  input: RefundTransitionInput;
}

export interface ProviderDisclosureEligibilityRouteRequest extends RuntimeRouteMeta {
  input: ProviderDisclosureEligibilityInput;
}

export interface AuthenticationDecisionRouteRequest extends RuntimeRouteMeta {
  input: EvaluateAuthenticationDecisionInput;
}

export interface TenancyAccessDecisionRouteRequest extends RuntimeRouteMeta {
  input: EvaluateTenancyAccessDecisionInput;
}

export function handlePaymentTransitionRoute(
  request: PaymentTransitionRouteRequest
): ApiEnvelope<PaymentDraft> {
  try {
    const payment = transitionPaymentStatus(request.input);
    return createApiEnvelope({
      data: payment,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "payment.transition",
      decisionReasonTag: `to:${payment.status}`
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Payment transition failed",
      code: "PAYMENT_TRANSITION_FAILED",
      operationTag: "payment.transition",
      decisionReasonTag: "transition-denied"
    });
  }
}

export function handleRefundTransitionRoute(
  request: RefundTransitionRouteRequest
): ApiEnvelope<RefundDraft> {
  try {
    const refund = transitionRefundStatus(request.input);
    return createApiEnvelope({
      data: refund,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "refund.transition",
      decisionReasonTag: `to:${refund.status}`
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Refund transition failed",
      code: "REFUND_TRANSITION_FAILED",
      operationTag: "refund.transition",
      decisionReasonTag: "transition-denied"
    });
  }
}

export function handleProviderDisclosureEligibilityRoute(
  request: ProviderDisclosureEligibilityRouteRequest
): ApiEnvelope<ProviderDisclosureDecisionDraft> {
  const decision = evaluateProviderDisclosureEligibility(request.input);
  return createApiEnvelope({
    data: decision,
    requestId: request.requestId,
    correlationId: request.correlationId,
    operationTag: "provider-disclosure.eligibility.evaluate",
    decisionReasonTag: decision.reasonCode
  });
}

export function handleAuthenticationDecisionRoute(
  request: AuthenticationDecisionRouteRequest
): ApiEnvelope<AuthenticationDecisionDraft> {
  const decision = evaluateAuthenticationDecision(request.input);

  return createApiEnvelope({
    data: decision,
    requestId: request.requestId,
    correlationId: request.correlationId,
    operationTag: "authentication.decision.evaluate",
    decisionReasonTag: decision.reasonCode
  });
}

export function handleTenancyAccessDecisionRoute(
  request: TenancyAccessDecisionRouteRequest
): ApiEnvelope<TenancyAccessDecisionDraft> {
  const decision = evaluateTenancyAccessDecision(request.input);

  return createApiEnvelope({
    data: decision,
    requestId: request.requestId,
    correlationId: request.correlationId,
    operationTag: "tenancy.access.evaluate",
    decisionReasonTag: decision.reasonCode
  });
}
