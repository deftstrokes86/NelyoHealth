import { describe, expect, it } from "vitest";
import {
  createRuntimeConfig,
  loadRuntimeConfigFromEnv,
  redactRuntimeConfig,
  resolveRuntimeConfig
} from "./env";

describe("runtime config resolution", () => {
  it("applies defaults for missing values", () => {
    const config = resolveRuntimeConfig({});

    expect(config).toMatchObject({
      deploymentEnvironment: "local",
      applicationName: "nelyohealth-app",
      nodeEnv: "development",
      port: 3000,
      apiBaseUrl: "http://127.0.0.1:3000",
      enableSyntheticData: true,
      logLevel: "info",
      featureFlags: {
        paymentsEnabled: true,
        providerDisclosureEnabled: true
      },
      secretReferences: {
        apiSessionSecret: {
          environment: "local",
          name: "synthetic-placeholder"
        },
        observabilityApiKey: {
          environment: "local",
          name: "synthetic-placeholder"
        }
      }
    });
  });

  it("parses explicit overrides", () => {
    const config = createRuntimeConfig({
      deploymentEnvironment: "staging",
      applicationName: "patient-web",
      nodeEnv: "production",
      port: "4000",
      apiBaseUrl: "https://example.test",
      enableSyntheticData: "false",
      logLevel: "debug",
      paymentsEnabled: "false",
      providerDisclosureEnabled: "false",
      apiSessionSecretName: "staging/session-secret",
      observabilityApiKeyName: "staging/observability-key"
    });

    expect(config).toMatchObject({
      deploymentEnvironment: "staging",
      applicationName: "patient-web",
      nodeEnv: "production",
      port: 4000,
      apiBaseUrl: "https://example.test",
      enableSyntheticData: false,
      logLevel: "debug",
      featureFlags: {
        paymentsEnabled: false,
        providerDisclosureEnabled: false
      },
      secretReferences: {
        apiSessionSecret: {
          environment: "staging",
          name: "staging/session-secret"
        },
        observabilityApiKey: {
          environment: "staging",
          name: "staging/observability-key"
        }
      }
    });
  });

  it("rejects invalid values", () => {
    expect(() => resolveRuntimeConfig({ port: "invalid" })).toThrow("Invalid port value");
    expect(() => resolveRuntimeConfig({ nodeEnv: "staging" })).toThrow("Invalid node environment");
    expect(() => resolveRuntimeConfig({ enableSyntheticData: "maybe" })).toThrow(
      "Invalid boolean value"
    );
    expect(() => resolveRuntimeConfig({ deploymentEnvironment: "prod" })).toThrow(
      "Invalid deployment environment"
    );
  });

  it("fails fast when required env values are missing in strict mode", () => {
    expect(() => loadRuntimeConfigFromEnv()).toThrow(
      "Missing required config value: NELYO_APP_NAME"
    );
  });

  it("redacts secret references from diagnostics", () => {
    const diagnostics = redactRuntimeConfig(
      resolveRuntimeConfig({
        deploymentEnvironment: "production",
        applicationName: "admin-web",
        apiSessionSecretName: "production/api-session-secret",
        observabilityApiKeyName: "production/observability-api-key"
      })
    );

    expect(diagnostics.secretReferences).toEqual({
      apiSessionSecret: "[redacted:production]",
      observabilityApiKey: "[redacted:production]"
    });
    expect(JSON.stringify(diagnostics)).not.toContain("production/api-session-secret");
    expect(JSON.stringify(diagnostics)).not.toContain("production/observability-api-key");
  });
});
