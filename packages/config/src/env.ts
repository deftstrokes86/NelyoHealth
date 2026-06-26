export type NodeEnvironment = "development" | "test" | "production";

export interface RuntimeConfig {
  nodeEnv: NodeEnvironment;
  port: number;
  apiBaseUrl: string;
  enableSyntheticData: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  featureFlags: {
    paymentsEnabled: boolean;
    providerDisclosureEnabled: boolean;
  };
}

export interface RuntimeConfigOverrides {
  nodeEnv?: string;
  port?: string;
  apiBaseUrl?: string;
  enableSyntheticData?: string;
  logLevel?: string;
  paymentsEnabled?: string;
  providerDisclosureEnabled?: string;
}

const DEFAULT_PORT = 3000;
const DEFAULT_API_BASE_URL = "http://127.0.0.1:3000";

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid boolean value: ${value}`);
}

function parsePort(value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`Invalid port value: ${value}`);
  }

  return parsed;
}

function parseNodeEnvironment(value: string | undefined, fallback: NodeEnvironment): NodeEnvironment {
  if (value === undefined || value === "") {
    return fallback;
  }

  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  throw new Error(`Invalid node environment: ${value}`);
}

function parseLogLevel(value: string | undefined, fallback: RuntimeConfig["logLevel"]): RuntimeConfig["logLevel"] {
  if (value === undefined || value === "") {
    return fallback;
  }

  if (value === "debug" || value === "info" || value === "warn" || value === "error") {
    return value;
  }

  throw new Error(`Invalid log level: ${value}`);
}

export function resolveRuntimeConfig(env: RuntimeConfigOverrides = {}): RuntimeConfig {
  return {
    nodeEnv: parseNodeEnvironment(env.nodeEnv ?? process.env.NELYO_NODE_ENV, "development"),
    port: parsePort(env.port ?? process.env.NELYO_PORT, DEFAULT_PORT),
    apiBaseUrl: env.apiBaseUrl ?? process.env.NELYO_API_BASE_URL ?? DEFAULT_API_BASE_URL,
    enableSyntheticData: parseBoolean(
      env.enableSyntheticData ?? process.env.NELYO_ENABLE_SYNTHETIC_DATA,
      true
    ),
    logLevel: parseLogLevel(env.logLevel ?? process.env.NELYO_LOG_LEVEL, "info"),
    featureFlags: {
      paymentsEnabled: parseBoolean(
        env.paymentsEnabled ?? process.env.NELYO_FEATURE_PAYMENTS_ENABLED,
        true
      ),
      providerDisclosureEnabled: parseBoolean(
        env.providerDisclosureEnabled ?? process.env.NELYO_FEATURE_PROVIDER_DISCLOSURE_ENABLED,
        true
      )
    }
  };
}

export function createRuntimeConfig(env: RuntimeConfigOverrides = {}): RuntimeConfig {
  return resolveRuntimeConfig(env);
}

export const defaultRuntimeConfig: RuntimeConfig = resolveRuntimeConfig({});
