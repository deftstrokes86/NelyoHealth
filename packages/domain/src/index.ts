export const domainPackageBoundary = {
  id: "domain",
  packageName: "@nelyohealth/domain",
  kind: "shared-package",
  status: "boundary-only",
  owningIssue: "P02-ISS-005",
  publicApi: "Domain-neutral primitives and errors boundary",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type DomainPackageBoundary = typeof domainPackageBoundary;
