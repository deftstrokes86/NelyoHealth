import { describe, expect, it } from "vitest";
import { createProviderDiscoveryViewModel } from "./provider-discovery.js";

describe("patient web provider discovery view model", () => {
  it("maps the dto into a patient-facing view model", () => {
    const viewModel = createProviderDiscoveryViewModel({
      providerId: "provider-4",
      providerDisplayName: "Care Path Clinic",
      serviceName: "Wellness Visit",
      price: 80,
      currency: "USD",
      availabilityStatus: "available"
    });

    expect(viewModel).toMatchObject({
      providerId: "provider-4",
      providerDisplayName: "Care Path Clinic",
      serviceName: "Wellness Visit",
      price: 80,
      currency: "USD",
      availabilityStatus: "available"
    });
  });
});
