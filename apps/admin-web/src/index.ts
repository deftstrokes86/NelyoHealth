export const adminWebApplicationBoundary = {
  id: "admin-web",
  packageName: "@nelyohealth/admin-web",
  kind: "application",
  status: "boundary-only",
  owningIssue: "P02-ISS-012",
  frameworkTarget: "Next.js 16",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type AdminWebApplicationBoundary = typeof adminWebApplicationBoundary;
