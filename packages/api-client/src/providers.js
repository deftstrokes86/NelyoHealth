export function createProviderSearchResponseDto(input) {
    return {
        providerId: input.providerId,
        providerDisplayName: input.providerDisplayName,
        serviceName: input.serviceName,
        price: input.price,
        currency: input.currency,
        availabilityStatus: input.availabilityStatus
    };
}
//# sourceMappingURL=providers.js.map