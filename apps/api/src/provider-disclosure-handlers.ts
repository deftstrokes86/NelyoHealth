import type { PaymentDraft } from "./payments.js";
import type { RefundDraft } from "./refunds.js";
import { createProviderDisclosureDecisionDraft, type ProviderDisclosureDecisionDraft } from "./provider-disclosure.js";

export interface ProviderDisclosureEligibilityInput {
  orderId: string;
  providerDisplayName: string;
  paymentStatus: PaymentDraft["status"];
  refundStatus?: RefundDraft["status"];
  hasAuthorization: boolean;
  sameTenant: boolean;
  evaluatedAt: string;
}

export function evaluateProviderDisclosureEligibility(
  input: ProviderDisclosureEligibilityInput
): ProviderDisclosureDecisionDraft {
  if (!input.sameTenant) {
    return createProviderDisclosureDecisionDraft({
      orderId: input.orderId,
      status: "denied",
      reasonCode: "tenant-mismatch",
      providerDisplayName: input.providerDisplayName,
      authorizedAt: null
    });
  }

  if (!input.hasAuthorization) {
    return createProviderDisclosureDecisionDraft({
      orderId: input.orderId,
      status: "denied",
      reasonCode: "authorization-missing",
      providerDisplayName: input.providerDisplayName,
      authorizedAt: null
    });
  }

  if (input.paymentStatus !== "settled") {
    return createProviderDisclosureDecisionDraft({
      orderId: input.orderId,
      status: "not-eligible",
      reasonCode: "payment-not-settled",
      providerDisplayName: input.providerDisplayName,
      authorizedAt: null
    });
  }

  if (input.refundStatus === "completed") {
    return createProviderDisclosureDecisionDraft({
      orderId: input.orderId,
      status: "not-eligible",
      reasonCode: "policy-gated",
      providerDisplayName: input.providerDisplayName,
      authorizedAt: null
    });
  }

  return createProviderDisclosureDecisionDraft({
    orderId: input.orderId,
    status: "eligible",
    reasonCode: "eligible",
    providerDisplayName: input.providerDisplayName,
    authorizedAt: input.evaluatedAt
  });
}
