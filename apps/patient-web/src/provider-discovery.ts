export interface ProviderSearchResponseDtoLike {
  providerId: string;
  providerDisplayName: string;
  serviceName: string;
  price: number;
  currency: string;
  availabilityStatus: "available" | "booked" | "unavailable";
}

export interface ProviderDiscoveryViewModel {
  providerId: string;
  providerDisplayName: string;
  serviceName: string;
  price: number;
  currency: string;
  availabilityStatus: "available" | "booked" | "unavailable";
}

export function createProviderDiscoveryViewModel(dto: ProviderSearchResponseDtoLike): ProviderDiscoveryViewModel {
  return {
    providerId: dto.providerId,
    providerDisplayName: dto.providerDisplayName,
    serviceName: dto.serviceName,
    price: dto.price,
    currency: dto.currency,
    availabilityStatus: dto.availabilityStatus
  };
}
