export const domainPackageBoundary = {
  id: "domain",
  packageName: "@nelyohealth/domain",
  kind: "shared-package",
  status: "phase-3-identity-tenancy-model-scaffold",
  owningIssue: "P03-ISS-001",
  publicApi:
    "Domain model contracts for identity and tenancy foundations, and the frozen platform event envelope contract",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type DomainPackageBoundary = typeof domainPackageBoundary;

export * from "./identity-tenancy-model.js";
export * from "./platform-events.js";
