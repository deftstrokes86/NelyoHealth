import { describe, expect, it } from "vitest";
import { createRuntimeConfig, resolveRuntimeConfig } from "./env";

describe("runtime config resolution", () => {
  it("applies defaults for missing values", () => {
    const config = resolveRuntimeConfig({});

    expect(config).toMatchObject({
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
  });

  it("parses explicit overrides", () => {
    const config = createRuntimeConfig({
      nodeEnv: "production",
      port: "4000",
      apiBaseUrl: "https://example.test",
      enableSyntheticData: "false",
      logLevel: "debug",
      paymentsEnabled: "false",
      providerDisclosureEnabled: "false"
    });

    expect(config).toMatchObject({
      nodeEnv: "production",
      port: 4000,
      apiBaseUrl: "https://example.test",
      enableSyntheticData: false,
      logLevel: "debug",
      featureFlags: {
        paymentsEnabled: false,
        providerDisclosureEnabled: false
      }
    });
  });

  it("rejects invalid values", () => {
    expect(() => resolveRuntimeConfig({ port: "invalid" })).toThrow("Invalid port value");
    expect(() => resolveRuntimeConfig({ nodeEnv: "staging" })).toThrow("Invalid node environment");
    expect(() => resolveRuntimeConfig({ enableSyntheticData: "maybe" })).toThrow("Invalid boolean value");
  });
});
