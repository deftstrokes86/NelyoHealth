export const configPackageBoundary = {
  id: "config",
  packageName: "@nelyohealth/config",
  kind: "shared-package",
  status: "boundary-only",
  owningIssue: "P02-ISS-015",
  publicApi: "Typed environment configuration boundary",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type ConfigPackageBoundary = typeof configPackageBoundary;
