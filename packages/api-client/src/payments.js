export function createPaymentDraftDto(input) {
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
//# sourceMappingURL=payments.js.map