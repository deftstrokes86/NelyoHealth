export interface ProviderSearchResponseDto {
    providerId: string;
    providerDisplayName: string;
    serviceName: string;
    price: number;
    currency: string;
    availabilityStatus: "available" | "booked" | "unavailable";
}
export interface ProviderSearchRequestDto {
    providerId: string;
    providerDisplayName: string;
    serviceName: string;
    price: number;
    currency: string;
    availabilityStatus: "available" | "booked" | "unavailable";
}
export declare function createProviderSearchResponseDto(input: ProviderSearchRequestDto): ProviderSearchResponseDto;
//# sourceMappingURL=providers.d.ts.map