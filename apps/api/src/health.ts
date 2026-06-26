export interface RuntimeConfigLike {
  nodeEnv: "development" | "test" | "production";
  port: number;
  apiBaseUrl: string;
  enableSyntheticData: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  featureFlags: {
    paymentsEnabled: boolean;
    providerDisclosureEnabled: boolean;
  };
}

export interface ApiHealthResponse {
  status: "ok";
  service: string;
  environment: RuntimeConfigLike["nodeEnv"];
  port: number;
  syntheticDataEnabled: boolean;
  features: {
    paymentsEnabled: boolean;
    providerDisclosureEnabled: boolean;
  };
}

export interface ReadinessResponse {
  ready: boolean;
  service: string;
  checkedAt: string;
}

export function createApiHealthResponse(config: RuntimeConfigLike): ApiHealthResponse {
  return {
    status: "ok",
    service: "@nelyohealth/api",
    environment: config.nodeEnv,
    port: config.port,
    syntheticDataEnabled: config.enableSyntheticData,
    features: {
      paymentsEnabled: config.featureFlags.paymentsEnabled,
      providerDisclosureEnabled: config.featureFlags.providerDisclosureEnabled
    }
  };
}

export function createReadinessResponse(config: RuntimeConfigLike): ReadinessResponse {
  return {
    ready: Boolean(config.port > 0),
    service: "@nelyohealth/api",
    checkedAt: new Date().toISOString()
  };
}
