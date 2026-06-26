import { describe, expect, it } from "vitest";
import { createProviderSearchResponse, createProviderSearchResponseWithProtectedFields } from "./providers.js";

describe("provider discovery contract", () => {
  it("returns a safe pre-payment provider response", () => {
    const response = createProviderSearchResponse({
      providerId: "provider-1",
      providerDisplayName: "Warm Care Pharmacy",
      serviceName: "Medication Review",
      price: 45,
      currency: "USD",
      availabilityStatus: "available"
    });

    expect(response).toMatchObject({
      providerId: "provider-1",
      providerDisplayName: "Warm Care Pharmacy",
      serviceName: "Medication Review",
      price: 45,
      currency: "USD",
      availabilityStatus: "available"
    });

    expect(response).not.toHaveProperty("address");
    expect(response).not.toHaveProperty("phoneNumber");
    expect(response).not.toHaveProperty("branchId");
  });

  it("does not expose protected fields in a pre-payment response", () => {
    const response = createProviderSearchResponseWithProtectedFields({
      providerId: "provider-2",
      providerDisplayName: "Bright Lab",
      serviceName: "Blood Panel",
      price: 120,
      currency: "USD",
      availabilityStatus: "available",
      address: "123 Test Street",
      phoneNumber: "555-0000",
      branchId: "BR-2"
    });

    expect(response).not.toHaveProperty("address");
    expect(response).not.toHaveProperty("phoneNumber");
    expect(response).not.toHaveProperty("branchId");
  });
});
