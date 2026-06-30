export type NodeEnvironment = "development" | "test" | "production";

export type DeploymentEnvironment =
  | "local"
  | "pr"
  | "development"
  | "staging"
  | "production"
  | "partner-sandbox";

export interface SecretReference {
  environment: DeploymentEnvironment;
  name: string;
}

export interface RuntimeConfig {
  deploymentEnvironment: DeploymentEnvironment;
  applicationName: string;
  nodeEnv: NodeEnvironment;
  port: number;
  apiBaseUrl: string;
  enableSyntheticData: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  featureFlags: {
    paymentsEnabled: boolean;
    providerDisclosureEnabled: boolean;
  };
  secretReferences: {
    apiSessionSecret: SecretReference;
    observabilityApiKey: SecretReference;
  };
}

export interface RuntimeConfigOverrides {
  deploymentEnvironment?: string;
  applicationName?: string;
  nodeEnv?: string;
  port?: string;
  apiBaseUrl?: string;
  enableSyntheticData?: string;
  logLevel?: string;
  paymentsEnabled?: string;
  providerDisclosureEnabled?: string;
  apiSessionSecretName?: string;
  observabilityApiKeyName?: string;
}

export interface RuntimeConfigResolutionOptions {
  strict?: boolean;
}

export interface RuntimeConfigDiagnosticSummary {
  deploymentEnvironment: DeploymentEnvironment;
  applicationName: string;
  nodeEnv: NodeEnvironment;
  port: number;
  apiBaseUrl: string;
  enableSyntheticData: boolean;
  logLevel: RuntimeConfig["logLevel"];
  featureFlags: RuntimeConfig["featureFlags"];
  secretReferences: {
    apiSessionSecret: string;
    observabilityApiKey: string;
  };
}

const DEFAULT_PORT = 3000;
const DEFAULT_API_BASE_URL = "http://127.0.0.1:3000";
const DEFAULT_DEPLOYMENT_ENVIRONMENT: DeploymentEnvironment = "local";
const DEFAULT_APPLICATION_NAME = "nelyohealth-app";
const DEFAULT_SECRET_NAME = "synthetic-placeholder";

function parseDeploymentEnvironment(
  value: string | undefined,
  fallback: DeploymentEnvironment
): DeploymentEnvironment {
  if (value === undefined || value === "") {
    return fallback;
  }

  if (
    value === "local" ||
    value === "pr" ||
    value === "development" ||
    value === "staging" ||
    value === "production" ||
    value === "partner-sandbox"
  ) {
    return value;
  }

  throw new Error(`Invalid deployment environment: ${value}`);
}

function parseRequiredString(value: string | undefined, fieldName: string): string {
  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing required config value: ${fieldName}`);
  }

  return value;
}

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

function parseNodeEnvironment(
  value: string | undefined,
  fallback: NodeEnvironment
): NodeEnvironment {
  if (value === undefined || value === "") {
    return fallback;
  }

  if (value === "development" || value === "test" || value === "production") {
    return value;
  }

  throw new Error(`Invalid node environment: ${value}`);
}

function parseLogLevel(
  value: string | undefined,
  fallback: RuntimeConfig["logLevel"]
): RuntimeConfig["logLevel"] {
  if (value === undefined || value === "") {
    return fallback;
  }

  if (value === "debug" || value === "info" || value === "warn" || value === "error") {
    return value;
  }

  throw new Error(`Invalid log level: ${value}`);
}

function resolveSecretReference(
  environment: DeploymentEnvironment,
  value: string | undefined,
  fallbackName: string,
  strict: boolean,
  fieldName: string
): SecretReference {
  if (strict) {
    return {
      environment,
      name: parseRequiredString(value, fieldName)
    };
  }

  return {
    environment,
    name: value === undefined || value === "" ? fallbackName : value
  };
}

export function resolveRuntimeConfig(
  env: RuntimeConfigOverrides = {},
  options: RuntimeConfigResolutionOptions = {}
): RuntimeConfig {
  const strict = options.strict ?? false;
  const deploymentEnvironment = parseDeploymentEnvironment(
    env.deploymentEnvironment ?? process.env.NELYO_DEPLOYMENT_ENV,
    DEFAULT_DEPLOYMENT_ENVIRONMENT
  );
  const applicationName = strict
    ? parseRequiredString(env.applicationName ?? process.env.NELYO_APP_NAME, "NELYO_APP_NAME")
    : (env.applicationName ?? process.env.NELYO_APP_NAME ?? DEFAULT_APPLICATION_NAME);

  const apiBaseUrl = strict
    ? parseRequiredString(env.apiBaseUrl ?? process.env.NELYO_API_BASE_URL, "NELYO_API_BASE_URL")
    : (env.apiBaseUrl ?? process.env.NELYO_API_BASE_URL ?? DEFAULT_API_BASE_URL);

  return {
    deploymentEnvironment,
    applicationName,
    nodeEnv: parseNodeEnvironment(env.nodeEnv ?? process.env.NELYO_NODE_ENV, "development"),
    port: parsePort(env.port ?? process.env.NELYO_PORT, DEFAULT_PORT),
    apiBaseUrl,
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
    },
    secretReferences: {
      apiSessionSecret: resolveSecretReference(
        deploymentEnvironment,
        env.apiSessionSecretName ?? process.env.NELYO_API_SESSION_SECRET_NAME,
        DEFAULT_SECRET_NAME,
        strict,
        "NELYO_API_SESSION_SECRET_NAME"
      ),
      observabilityApiKey: resolveSecretReference(
        deploymentEnvironment,
        env.observabilityApiKeyName ?? process.env.NELYO_OBSERVABILITY_API_KEY_NAME,
        DEFAULT_SECRET_NAME,
        strict,
        "NELYO_OBSERVABILITY_API_KEY_NAME"
      )
    }
  };
}

export function createRuntimeConfig(env: RuntimeConfigOverrides = {}): RuntimeConfig {
  return resolveRuntimeConfig(env);
}

export function loadRuntimeConfigFromEnv(): RuntimeConfig {
  return resolveRuntimeConfig({}, { strict: true });
}

export function redactRuntimeConfig(config: RuntimeConfig): RuntimeConfigDiagnosticSummary {
  return {
    deploymentEnvironment: config.deploymentEnvironment,
    applicationName: config.applicationName,
    nodeEnv: config.nodeEnv,
    port: config.port,
    apiBaseUrl: config.apiBaseUrl,
    enableSyntheticData: config.enableSyntheticData,
    logLevel: config.logLevel,
    featureFlags: config.featureFlags,
    secretReferences: {
      apiSessionSecret: `[redacted:${config.secretReferences.apiSessionSecret.environment}]`,
      observabilityApiKey: `[redacted:${config.secretReferences.observabilityApiKey.environment}]`
    }
  };
}

export const defaultRuntimeConfig: RuntimeConfig = resolveRuntimeConfig({});
