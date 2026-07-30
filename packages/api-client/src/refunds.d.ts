export interface RefundDraftDto {
    refundId: string;
    paymentId: string;
    orderId: string;
    status: "requested" | "eligibility-review" | "approved" | "processing" | "completed" | "failed";
    amount: string;
    currency: string;
    completedAt: string | null;
}
export interface RefundDraftRequestDto {
    refundId: string;
    paymentId: string;
    orderId: string;
    status: "requested" | "eligibility-review" | "approved" | "processing" | "completed" | "failed";
    amount: string;
    currency: string;
    completedAt: string | null;
}
export declare function createRefundDraftDto(input: RefundDraftRequestDto): RefundDraftDto;
//# sourceMappingURL=refunds.d.ts.map