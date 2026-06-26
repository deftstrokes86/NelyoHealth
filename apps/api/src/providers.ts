export interface ProviderSearchResponse {
  providerId: string;
  providerDisplayName: string;
  serviceName: string;
  price: number;
  currency: string;
  availabilityStatus: "available" | "booked" | "unavailable";
}

export interface ProviderSearchInput {
  providerId: string;
  providerDisplayName: string;
  serviceName: string;
  price: number;
  currency: string;
  availabilityStatus: "available" | "booked" | "unavailable";
}

export interface ProviderSearchInputWithProtectedFields extends ProviderSearchInput {
  address?: string;
  phoneNumber?: string;
  branchId?: string;
}

export function createProviderSearchResponse(input: ProviderSearchInput): ProviderSearchResponse {
  return {
    providerId: input.providerId,
    providerDisplayName: input.providerDisplayName,
    serviceName: input.serviceName,
    price: input.price,
    currency: input.currency,
    availabilityStatus: input.availabilityStatus
  };
}

export function createProviderSearchResponseWithProtectedFields(
  input: ProviderSearchInputWithProtectedFields
): ProviderSearchResponse {
  return createProviderSearchResponse(input);
}
