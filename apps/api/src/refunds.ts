export interface RefundDraft {
  refundId: string;
  paymentId: string;
  orderId: string;
  status:
    | "requested"
    | "eligibility-review"
    | "approved"
    | "processing"
    | "completed"
    | "failed";
  amount: string;
  currency: string;
  completedAt: string | null;
}

export interface RefundDraftInput {
  refundId: string;
  paymentId: string;
  orderId: string;
  status:
    | "requested"
    | "eligibility-review"
    | "approved"
    | "processing"
    | "completed"
    | "failed";
  amount: string;
  currency: string;
  completedAt: string | null;
}

export function createRefundDraft(input: RefundDraftInput): RefundDraft {
  return {
    refundId: input.refundId,
    paymentId: input.paymentId,
    orderId: input.orderId,
    status: input.status,
    amount: input.amount,
    currency: input.currency,
    completedAt: input.completedAt
  };
}
