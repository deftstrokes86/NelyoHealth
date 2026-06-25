export const apiClientPackageBoundary = {
  id: "api-client",
  packageName: "@nelyohealth/api-client",
  kind: "shared-package",
  status: "boundary-only",
  owningIssue: "P02-ISS-006",
  publicApi: "Generated OpenAPI typed client boundary",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type ApiClientPackageBoundary = typeof apiClientPackageBoundary;
