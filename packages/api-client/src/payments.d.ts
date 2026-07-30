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
export declare function createPaymentDraftDto(input: PaymentDraftRequestDto): PaymentDraftDto;
//# sourceMappingURL=payments.d.ts.map