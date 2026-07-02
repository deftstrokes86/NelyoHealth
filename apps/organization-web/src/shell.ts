export const organizationShellDescriptor = {
  appId: "organization-web",
  issue: "P02-ISS-012",
  phase5Issue: "P05-ISS-001",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type OrganizationShellDescriptor = typeof organizationShellDescriptor;

export const organizationShellNavigation = [
  "Roster",
  "Coverage",
  "Claims",
  "Approvals",
  "Reports"
] as const;

export const organizationShellStateScaffolds = [
  {
    key: "loading",
    title: "Loading",
    message: "Show deterministic organization context loading before employer-plan actions.",
    stateTone: "info"
  },
  {
    key: "empty",
    title: "Empty",
    message: "Show safe empty-roster messaging for unassigned members.",
    stateTone: "success"
  },
  {
    key: "error",
    title: "Error",
    message: "Show non-leaking error state with clear retry guidance.",
    stateTone: "danger"
  },
  {
    key: "unauthorized",
    title: "Unauthorized",
    message: "Fail closed for missing sponsor or administrator scope.",
    stateTone: "warning"
  },
  {
    key: "offline",
    title: "Offline",
    message: "Show resilient offline-state instructions and deferred synchronization cues.",
    stateTone: "warning"
  },
  {
    key: "reduced-motion",
    title: "Reduced motion",
    message: "Respect reduced-motion preference while keeping approval flows understandable.",
    stateTone: "info"
  }
] as const;

export type OrganizationShellStateScaffold = (typeof organizationShellStateScaffolds)[number];

export function createOrganizationShellApiClient<TClient>(
  baseUrl: string,
  factory: (resolvedBaseUrl: string) => TClient
): TClient {
  return factory(baseUrl);
}
