export {
  createRuntimeConfig,
  defaultRuntimeConfig,
  loadRuntimeConfigFromEnv,
  redactRuntimeConfig,
  resolveRuntimeConfig
} from "./env.js";
export type {
  DeploymentEnvironment,
  NodeEnvironment,
  RuntimeConfig,
  RuntimeConfigDiagnosticSummary,
  RuntimeConfigOverrides,
  RuntimeConfigResolutionOptions,
  SecretReference
} from "./env.js";

export const configPackageBoundary = {
  id: "config",
  packageName: "@nelyohealth/config",
  kind: "shared-package",
  status: "environment-runtime",
  owningIssue: "P02-ISS-015",
  publicApi: "Typed environment configuration boundary",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type ConfigPackageBoundary = typeof configPackageBoundary;
