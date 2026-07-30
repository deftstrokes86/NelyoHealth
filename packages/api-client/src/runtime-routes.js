export function createPaymentTransitionRouteRequestDto(input) {
    return {
        requestId: input.requestId,
        correlationId: input.correlationId,
        paymentId: input.paymentId,
        toStatus: input.toStatus,
        transitionedAt: input.transitionedAt
    };
}
export function createRefundTransitionRouteRequestDto(input) {
    return {
        requestId: input.requestId,
        correlationId: input.correlationId,
        refundId: input.refundId,
        toStatus: input.toStatus,
        transitionedAt: input.transitionedAt
    };
}
export function createProviderDisclosureEligibilityRouteRequestDto(input) {
    return {
        requestId: input.requestId,
        correlationId: input.correlationId,
        orderId: input.orderId,
        paymentStatus: input.paymentStatus,
        refundStatus: input.refundStatus,
        hasAuthorization: input.hasAuthorization,
        sameTenant: input.sameTenant
    };
}
//# sourceMappingURL=runtime-routes.js.map