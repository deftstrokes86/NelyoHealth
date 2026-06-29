export interface PaymentDraftDto {
  paymentId: string;
  orderId: string;
  status: "quoted" | "initiated" | "authorized" | "settled" | "failed";
  amount: string;
  currency: string;
  authorizedAt: string | null;
  settledAt: string | null;
}

export interface PaymentDraftRequestDto {
  paymentId: string;
  orderId: string;
  status: "quoted" | "initiated" | "authorized" | "settled" | "failed";
  amount: string;
  currency: string;
  authorizedAt: string | null;
  settledAt: string | null;
}

export function createPaymentDraftDto(input: PaymentDraftRequestDto): PaymentDraftDto {
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
