export const providerShellDescriptor = {
  appId: "provider-web",
  issue: "P02-ISS-012",
  phase5Issue: "P05-ISS-001",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type ProviderShellDescriptor = typeof providerShellDescriptor;

export const providerShellNavigation = [
  "Queue",
  "Encounters",
  "Prescriptions",
  "Diagnostics",
  "Configuration"
] as const;

export const providerShellStateScaffolds = [
  {
    key: "loading",
    title: "Loading",
    message: "Show deterministic queue-loading placeholders while context is resolving.",
    stateTone: "info"
  },
  {
    key: "empty",
    title: "Empty",
    message: "Show explicit empty-care-queue guidance with no hidden assumptions.",
    stateTone: "success"
  },
  {
    key: "error",
    title: "Error",
    message: "Show retry-safe error state without exposing protected provider details.",
    stateTone: "danger"
  },
  {
    key: "unauthorized",
    title: "Unauthorized",
    message: "Fail closed when practitioner scope, tenant, or consent requirements are not met.",
    stateTone: "warning"
  },
  {
    key: "offline",
    title: "Offline",
    message: "Show explicit offline treatment-state messaging and recoverable actions.",
    stateTone: "warning"
  },
  {
    key: "reduced-motion",
    title: "Reduced motion",
    message: "Disable nonessential motion while preserving focus and clinical readability.",
    stateTone: "info"
  }
] as const;

export type ProviderShellStateScaffold = (typeof providerShellStateScaffolds)[number];

export function createProviderShellApiClient<TClient>(
  baseUrl: string,
  factory: (resolvedBaseUrl: string) => TClient
): TClient {
  return factory(baseUrl);
}
