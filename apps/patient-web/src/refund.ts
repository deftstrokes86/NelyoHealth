export interface RefundDraftDtoLike {
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

export interface RefundViewModel {
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

export function createRefundViewModel(dto: RefundDraftDtoLike): RefundViewModel {
  return {
    refundId: dto.refundId,
    paymentId: dto.paymentId,
    orderId: dto.orderId,
    status: dto.status,
    amount: dto.amount,
    currency: dto.currency,
    completedAt: dto.completedAt
  };
}
