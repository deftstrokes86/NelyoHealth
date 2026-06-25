export const providerWebApplicationBoundary = {
  id: "provider-web",
  packageName: "@nelyohealth/provider-web",
  kind: "application",
  status: "boundary-only",
  owningIssue: "P02-ISS-012",
  frameworkTarget: "Next.js 16",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type ProviderWebApplicationBoundary = typeof providerWebApplicationBoundary;
