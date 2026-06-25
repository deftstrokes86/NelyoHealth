export const platformAdaptersPackageBoundary = {
  id: "platform-adapters",
  packageName: "@nelyohealth/platform-adapters",
  kind: "shared-package",
  status: "boundary-only",
  owningIssue: "P02-ISS-009/P02-ISS-010/P02-ISS-011",
  publicApi: "Provider-neutral platform ports and adapter boundary",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type PlatformAdaptersPackageBoundary = typeof platformAdaptersPackageBoundary;
