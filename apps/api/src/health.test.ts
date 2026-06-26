import { describe, expect, it } from "vitest";
import { createApiHealthResponse, createReadinessResponse } from "./health.js";

describe("api health responses", () => {
  it("builds a health response from runtime configuration", () => {
    const response = createApiHealthResponse({
      nodeEnv: "test",
      port: 4000,
      apiBaseUrl: "https://example.test",
      enableSyntheticData: true,
      logLevel: "debug",
      featureFlags: {
        paymentsEnabled: false,
        providerDisclosureEnabled: true
      }
    });

    expect(response).toMatchObject({
      status: "ok",
      service: "@nelyohealth/api",
      environment: "test",
      port: 4000,
      syntheticDataEnabled: true,
      features: {
        paymentsEnabled: false,
        providerDisclosureEnabled: true
      }
    });
  });

  it("marks readiness as true when the service is configured", () => {
    const response = createReadinessResponse({
      nodeEnv: "development",
      port: 3000,
      apiBaseUrl: "http://127.0.0.1:3000",
      enableSyntheticData: true,
      logLevel: "info",
      featureFlags: {
        paymentsEnabled: true,
        providerDisclosureEnabled: true
      }
    });

    expect(response).toMatchObject({
      ready: true,
      service: "@nelyohealth/api"
    });
  });
});
