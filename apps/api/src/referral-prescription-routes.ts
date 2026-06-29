import { createApiEnvelope, createErrorEnvelope, type ApiEnvelope } from "./response.js";
import { transitionReferralStatus, transitionPrescriptionStatus } from "./referral-prescription-handlers.js";
import type { RuntimeRouteMeta } from "./runtime-routes.js";
import type { ReferralDraftAdvanced, ReferralStatusUpdateInput } from "./referral-advanced.js";
import type { PrescriptionDraftAdvanced, PrescriptionStatusUpdateInput } from "./prescription-advanced.js";

export interface ReferralStatusRouteRequest extends RuntimeRouteMeta {
  input: ReferralStatusUpdateInput;
}

export interface PrescriptionStatusRouteRequest extends RuntimeRouteMeta {
  input: PrescriptionStatusUpdateInput;
}

export function handleReferralStatusRoute(
  request: ReferralStatusRouteRequest
): ApiEnvelope<ReferralDraftAdvanced> {
  try {
    const referral = transitionReferralStatus(request.input);
    return createApiEnvelope({
      data: referral,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "referral.status.transition",
      decisionReasonTag: `to:${referral.status}`
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Referral transition failed",
      code: "REFERRAL_TRANSITION_FAILED",
      operationTag: "referral.status.transition",
      decisionReasonTag: "transition-denied"
    });
  }
}

export function handlePrescriptionStatusRoute(
  request: PrescriptionStatusRouteRequest
): ApiEnvelope<PrescriptionDraftAdvanced> {
  try {
    const prescription = transitionPrescriptionStatus(request.input);
    return createApiEnvelope({
      data: prescription,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "prescription.status.transition",
      decisionReasonTag: `to:${prescription.status}`
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Prescription transition failed",
      code: "PRESCRIPTION_TRANSITION_FAILED",
      operationTag: "prescription.status.transition",
      decisionReasonTag: "transition-denied"
    });
  }
}
