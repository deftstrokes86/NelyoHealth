import { describe, expect, it } from "vitest";
import { createProviderSearchResponseDto } from "./providers.js";

describe("api client provider dto", () => {
  it("maps a provider search request into a public response dto", () => {
    const dto = createProviderSearchResponseDto({
      providerId: "provider-3",
      providerDisplayName: "North Wellness",
      serviceName: "Checkup",
      price: 60,
      currency: "USD",
      availabilityStatus: "available"
    });

    expect(dto).toMatchObject({
      providerId: "provider-3",
      providerDisplayName: "North Wellness",
      serviceName: "Checkup",
      price: 60,
      currency: "USD",
      availabilityStatus: "available"
    });
  });
});
