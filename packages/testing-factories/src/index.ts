export const testingFactoriesPackageBoundary = {
  id: "testing-factories",
  packageName: "@nelyohealth/testing-factories",
  kind: "shared-package",
  status: "boundary-only",
  owningIssue: "P02-ISS-014",
  publicApi: "Synthetic test data builders and route fixtures boundary",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type TestingFactoriesPackageBoundary = typeof testingFactoriesPackageBoundary;
