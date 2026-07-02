export const adminShellDescriptor = {
  appId: "admin-web",
  issue: "P02-ISS-012",
  phase5Issue: "P05-ISS-001",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type AdminShellDescriptor = typeof adminShellDescriptor;

export const adminShellNavigation = [
  "Operations",
  "Audit",
  "Security",
  "Configuration",
  "Incidents"
] as const;

export const adminShellStateScaffolds = [
  {
    key: "loading",
    title: "Loading",
    message: "Show deterministic control-plane loading while policy context is evaluated.",
    stateTone: "info"
  },
  {
    key: "empty",
    title: "Empty",
    message: "Show explicit empty-audit messaging when no records match filters.",
    stateTone: "success"
  },
  {
    key: "error",
    title: "Error",
    message: "Show rollback-safe error state with no sensitive detail leakage.",
    stateTone: "danger"
  },
  {
    key: "unauthorized",
    title: "Unauthorized",
    message: "Fail closed when privileged administrative authorization is absent.",
    stateTone: "warning"
  },
  {
    key: "offline",
    title: "Offline",
    message: "Show clearly bounded offline operations with deferred synchronization notice.",
    stateTone: "warning"
  },
  {
    key: "reduced-motion",
    title: "Reduced motion",
    message: "Respect reduced-motion preference while preserving admin alert salience.",
    stateTone: "info"
  }
] as const;

export type AdminShellStateScaffold = (typeof adminShellStateScaffolds)[number];

export function createAdminShellApiClient<TClient>(
  baseUrl: string,
  factory: (resolvedBaseUrl: string) => TClient
): TClient {
  return factory(baseUrl);
}
