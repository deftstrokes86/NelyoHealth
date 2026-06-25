export const organizationWebApplicationBoundary = {
  id: "organization-web",
  packageName: "@nelyohealth/organization-web",
  kind: "application",
  status: "boundary-only",
  owningIssue: "P02-ISS-012",
  frameworkTarget: "Next.js 16",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type OrganizationWebApplicationBoundary = typeof organizationWebApplicationBoundary;
