declare module "@nelyohealth/api-client" {
  export interface ProviderSearchResponseDto {
    providerId: string;
    providerDisplayName: string;
    serviceName: string;
    price: number;
    currency: string;
    availabilityStatus: "available" | "booked" | "unavailable";
  }
}
