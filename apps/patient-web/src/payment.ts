export interface PaymentDraftDtoLike {
  paymentId: string;
  orderId: string;
  status: "quoted" | "initiated" | "authorized" | "settled" | "failed";
  amount: string;
  currency: string;
  authorizedAt: string | null;
  settledAt: string | null;
}

export interface PaymentViewModel {
  paymentId: string;
  orderId: string;
  status: "quoted" | "initiated" | "authorized" | "settled" | "failed";
  amount: string;
  currency: string;
  authorizedAt: string | null;
  settledAt: string | null;
}

export function createPaymentViewModel(dto: PaymentDraftDtoLike): PaymentViewModel {
  return {
    paymentId: dto.paymentId,
    orderId: dto.orderId,
    status: dto.status,
    amount: dto.amount,
    currency: dto.currency,
    authorizedAt: dto.authorizedAt,
    settledAt: dto.settledAt
  };
}
