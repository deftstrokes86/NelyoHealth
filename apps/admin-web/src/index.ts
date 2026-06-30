export { createAdminShellApiClient, adminShellDescriptor } from "./shell.js";
export type { AdminShellDescriptor } from "./shell.js";

export const adminWebApplicationBoundary = {
  id: "admin-web",
  packageName: "@nelyohealth/admin-web",
  kind: "application",
  status: "shell-runtime",
  owningIssue: "P02-ISS-012",
  frameworkTarget: "Next.js 16",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type AdminWebApplicationBoundary = typeof adminWebApplicationBoundary;
