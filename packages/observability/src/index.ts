export const observabilityPackageBoundary = {
  id: "observability",
  packageName: "@nelyohealth/observability",
  kind: "shared-package",
  status: "boundary-only",
  owningIssue: "P02-ISS-011",
  publicApi: "Logs, traces, metrics, and safe diagnostics boundary",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type ObservabilityPackageBoundary = typeof observabilityPackageBoundary;
