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

export function createProviderSearchResponseDto(input: ProviderSearchRequestDto): ProviderSearchResponseDto {
  return {
    providerId: input.providerId,
    providerDisplayName: input.providerDisplayName,
    serviceName: input.serviceName,
    price: input.price,
    currency: input.currency,
    availabilityStatus: input.availabilityStatus
  };
}
