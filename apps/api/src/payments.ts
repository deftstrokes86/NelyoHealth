export interface PaymentDraft {
  paymentId: string;
  orderId: string;
  status: "quoted" | "initiated" | "authorized" | "settled" | "failed";
  amount: string;
  currency: string;
  authorizedAt: string | null;
  settledAt: string | null;
}

export interface PaymentDraftInput {
  paymentId: string;
  orderId: string;
  status: "quoted" | "initiated" | "authorized" | "settled" | "failed";
  amount: string;
  currency: string;
  authorizedAt: string | null;
  settledAt: string | null;
}

export function createPaymentDraft(input: PaymentDraftInput): PaymentDraft {
  return {
    paymentId: input.paymentId,
    orderId: input.orderId,
    status: input.status,
    amount: input.amount,
    currency: input.currency,
    authorizedAt: input.authorizedAt,
    settledAt: input.settledAt
  };
}
