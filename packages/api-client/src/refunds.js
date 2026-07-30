export function createRefundDraftDto(input) {
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
//# sourceMappingURL=refunds.js.map