export interface RuntimeRouteMetaDto {
    requestId: string;
    correlationId: string;
}
export interface PaymentTransitionRouteRequestDto extends RuntimeRouteMetaDto {
    paymentId: string;
    toStatus: "quoted" | "initiated" | "authorized" | "settled" | "failed";
    transitionedAt: string;
}
export interface RefundTransitionRouteRequestDto extends RuntimeRouteMetaDto {
    refundId: string;
    toStatus: "requested" | "eligibility-review" | "approved" | "processing" | "completed" | "failed";
    transitionedAt: string;
}
export interface ProviderDisclosureEligibilityRouteRequestDto extends RuntimeRouteMetaDto {
    orderId: string;
    paymentStatus: "quoted" | "initiated" | "authorized" | "settled" | "failed";
    refundStatus?: "requested" | "eligibility-review" | "approved" | "processing" | "completed" | "failed";
    hasAuthorization: boolean;
    sameTenant: boolean;
}
export declare function createPaymentTransitionRouteRequestDto(input: PaymentTransitionRouteRequestDto): PaymentTransitionRouteRequestDto;
export declare function createRefundTransitionRouteRequestDto(input: RefundTransitionRouteRequestDto): RefundTransitionRouteRequestDto;
export declare function createProviderDisclosureEligibilityRouteRequestDto(input: ProviderDisclosureEligibilityRouteRequestDto): ProviderDisclosureEligibilityRouteRequestDto;
//# sourceMappingURL=runtime-routes.d.ts.map