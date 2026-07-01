import type { PaymentDraft } from "./payments.js";

const allowedPaymentTransitions: Record<
  PaymentDraft["status"],
  ReadonlyArray<PaymentDraft["status"]>
> = {
  quoted: ["initiated", "failed"],
  initiated: ["authorized", "failed"],
  authorized: ["settled", "failed"],
  settled: [],
  failed: []
};

export interface PaymentTransitionInput {
  payment: PaymentDraft;
  toStatus: PaymentDraft["status"];
  transitionedAt: string;
}

export function transitionPaymentStatus(input: PaymentTransitionInput): PaymentDraft {
  const allowed = allowedPaymentTransitions[input.payment.status];

  if (!allowed.includes(input.toStatus)) {
    throw new Error(`Invalid payment transition from ${input.payment.status} to ${input.toStatus}`);
  }

  return {
    ...input.payment,
    status: input.toStatus,
    authorizedAt:
      input.toStatus === "authorized" ? input.transitionedAt : input.payment.authorizedAt,
    settledAt: input.toStatus === "settled" ? input.transitionedAt : input.payment.settledAt
  };
}
