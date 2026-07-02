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
  BreakGlassExpiredError,
  type BreakGlassWorkflowService,
  type ListPatientBreakGlassHistoryInput,
  type RequestBreakGlassAccessInput,
  type ReviewBreakGlassAccessInput,
  type ActivateBreakGlassAccessInput,
  type PatientBreakGlassHistoryEntry,
  type BreakGlassAccessDraft,
  BreakGlassValidationError
} from "./break-glass-workflows.js";
import {
  type AmendAuditEventInput,
  AuditAppendOnlyViolationError,
  type AppendAuditEventInput,
  AuditEventNotFoundError,
  type AuditEventWorkflowService,
  type MutationAttemptInput
} from "./audit-event-workflows.js";
import {
  evaluateTenancyAccessDecision,
  type EvaluateTenancyAccessDecisionInput
} from "./tenancy-handlers.js";
import { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
import type { PaymentDraft } from "./payments.js";
import type { RefundDraft } from "./refunds.js";
import type { ProviderDisclosureDecisionDraft } from "./provider-disclosure.js";
import type { AuthenticationDecisionDraft } from "./authentication.js";
import type { TenancyAccessDecisionDraft } from "./tenancy.js";
import type {
  AuthorizationPolicyDecisionDraft,
  AuthorizationPolicyDecisionDraftInput
} from "./authorization-policy.js";
import type { AuditEventDraft } from "./audit-event-workflows.js";

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

export interface AuthorizationPolicyDecisionRouteRequest extends RuntimeRouteMeta {
  input: AuthorizationPolicyDecisionDraftInput;
}

export interface BreakGlassRequestRouteRequest extends RuntimeRouteMeta {
  input: RequestBreakGlassAccessInput;
  workflowService: BreakGlassWorkflowService;
}

export interface BreakGlassActivateRouteRequest extends RuntimeRouteMeta {
  input: ActivateBreakGlassAccessInput;
  workflowService: BreakGlassWorkflowService;
}

export interface BreakGlassReviewRouteRequest extends RuntimeRouteMeta {
  input: ReviewBreakGlassAccessInput;
  workflowService: BreakGlassWorkflowService;
}

export interface BreakGlassPatientHistoryRouteRequest extends RuntimeRouteMeta {
  input: ListPatientBreakGlassHistoryInput;
  workflowService: BreakGlassWorkflowService;
}

export interface AuditEventAppendRouteRequest extends RuntimeRouteMeta {
  input: AppendAuditEventInput;
  workflowService: AuditEventWorkflowService;
}

export interface AuditEventAmendRouteRequest extends RuntimeRouteMeta {
  input: AmendAuditEventInput;
  workflowService: AuditEventWorkflowService;
}

export interface AuditEventMutationAttemptRouteRequest extends RuntimeRouteMeta {
  input: MutationAttemptInput;
  workflowService: AuditEventWorkflowService;
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

export function handleAuthorizationPolicyDecisionRoute(
  request: AuthorizationPolicyDecisionRouteRequest
): ApiEnvelope<AuthorizationPolicyDecisionDraft> {
  const decision = evaluateAuthorizationPolicyDecision(request.input);

  return createApiEnvelope({
    data: decision,
    requestId: request.requestId,
    correlationId: request.correlationId,
    operationTag: "authorization.policy.evaluate",
    decisionReasonTag: decision.reasonCode
  });
}

export function handleBreakGlassRequestRoute(
  request: BreakGlassRequestRouteRequest
): ApiEnvelope<BreakGlassAccessDraft> {
  try {
    const access = request.workflowService.requestAccess(request.input);
    return createApiEnvelope({
      data: access,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "break-glass.request",
      decisionReasonTag: "requested"
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Break-glass request failed",
      code:
        error instanceof BreakGlassValidationError
          ? "BREAK_GLASS_REQUEST_INVALID"
          : "BREAK_GLASS_REQUEST_FAILED",
      operationTag: "break-glass.request",
      decisionReasonTag: "request-rejected"
    });
  }
}

export function handleBreakGlassActivateRoute(
  request: BreakGlassActivateRouteRequest
): ApiEnvelope<BreakGlassAccessDraft> {
  try {
    const access = request.workflowService.activateAccess(request.input);
    return createApiEnvelope({
      data: access,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "break-glass.activate",
      decisionReasonTag: "activated"
    });
  } catch (error) {
    const code =
      error instanceof BreakGlassExpiredError
        ? "BREAK_GLASS_EXPIRED"
        : "BREAK_GLASS_ACTIVATE_FAILED";
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Break-glass activation failed",
      code,
      operationTag: "break-glass.activate",
      decisionReasonTag: "activation-rejected"
    });
  }
}

export function handleBreakGlassReviewRoute(
  request: BreakGlassReviewRouteRequest
): ApiEnvelope<BreakGlassAccessDraft> {
  try {
    const access = request.workflowService.reviewAccess(request.input);
    return createApiEnvelope({
      data: access,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "break-glass.review",
      decisionReasonTag: "review-completed"
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Break-glass review failed",
      code: "BREAK_GLASS_REVIEW_FAILED",
      operationTag: "break-glass.review",
      decisionReasonTag: "review-rejected"
    });
  }
}

export function handleBreakGlassPatientHistoryRoute(
  request: BreakGlassPatientHistoryRouteRequest
): ApiEnvelope<PatientBreakGlassHistoryEntry[]> {
  const history = request.workflowService.listPatientVisibleHistory(request.input);
  return createApiEnvelope({
    data: history,
    requestId: request.requestId,
    correlationId: request.correlationId,
    operationTag: "break-glass.patient-history",
    decisionReasonTag: "history-returned"
  });
}

export function handleAuditEventAppendRoute(
  request: AuditEventAppendRouteRequest
): ApiEnvelope<AuditEventDraft> {
  try {
    const event = request.workflowService.appendEvent(request.input);
    return createApiEnvelope({
      data: event,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "audit.event.append",
      decisionReasonTag: "appended"
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Audit append failed",
      code: "AUDIT_EVENT_APPEND_FAILED",
      operationTag: "audit.event.append",
      decisionReasonTag: "append-rejected"
    });
  }
}

export function handleAuditEventAmendRoute(
  request: AuditEventAmendRouteRequest
): ApiEnvelope<AuditEventDraft> {
  try {
    const event = request.workflowService.appendAmendment(request.input);
    return createApiEnvelope({
      data: event,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "audit.event.amend",
      decisionReasonTag: "amended"
    });
  } catch (error) {
    const code =
      error instanceof AuditEventNotFoundError
        ? "AUDIT_EVENT_NOT_FOUND"
        : error instanceof AuditAppendOnlyViolationError
          ? "AUDIT_APPEND_ONLY_ENFORCED"
          : "AUDIT_EVENT_AMEND_FAILED";

    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Audit amendment failed",
      code,
      operationTag: "audit.event.amend",
      decisionReasonTag: "amendment-rejected"
    });
  }
}

export function handleAuditEventMutationAttemptRoute(
  request: AuditEventMutationAttemptRouteRequest
): ApiEnvelope<null> {
  try {
    request.workflowService.rejectMutationAttempt(request.input);
    return createApiEnvelope({
      data: null,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "audit.event.mutation",
      decisionReasonTag: "unexpected-success"
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Audit mutation rejected",
      code: "AUDIT_APPEND_ONLY_ENFORCED",
      operationTag: "audit.event.mutation",
      decisionReasonTag: "append-only-rejected"
    });
  }
}
