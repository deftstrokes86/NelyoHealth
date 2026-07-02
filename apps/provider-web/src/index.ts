export {
  createProviderShellApiClient,
  providerShellDescriptor,
  providerShellNavigation,
  providerShellStateScaffolds
} from "./shell.js";
export type { ProviderShellDescriptor, ProviderShellStateScaffold } from "./shell.js";

export const providerWebApplicationBoundary = {
  id: "provider-web",
  packageName: "@nelyohealth/provider-web",
  kind: "application",
  status: "shell-runtime",
  owningIssue: "P02-ISS-012",
  frameworkTarget: "Next.js 16",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type ProviderWebApplicationBoundary = typeof providerWebApplicationBoundary;
