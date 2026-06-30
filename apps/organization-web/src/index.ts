export { createOrganizationShellApiClient, organizationShellDescriptor } from "./shell.js";
export type { OrganizationShellDescriptor } from "./shell.js";

export const organizationWebApplicationBoundary = {
  id: "organization-web",
  packageName: "@nelyohealth/organization-web",
  kind: "application",
  status: "shell-runtime",
  owningIssue: "P02-ISS-012",
  frameworkTarget: "Next.js 16",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type OrganizationWebApplicationBoundary = typeof organizationWebApplicationBoundary;
