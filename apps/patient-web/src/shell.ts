export const patientShellDescriptor = {
  appId: "patient-web",
  issue: "P02-ISS-012",
  phase5Issue: "P05-ISS-001",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type PatientShellDescriptor = typeof patientShellDescriptor;

export const patientShellNavigation = [
  "Overview",
  "Appointments",
  "Care timeline",
  "Billing",
  "Settings"
] as const;

export const patientShellStateScaffolds = [
  {
    key: "loading",
    title: "Loading",
    message: "Show predictable loading placeholders while shell context initializes.",
    stateTone: "info"
  },
  {
    key: "empty",
    title: "Empty",
    message: "Show clear empty-state guidance when no records are available.",
    stateTone: "success"
  },
  {
    key: "error",
    title: "Error",
    message: "Show safe retry messaging when shell data fetch fails.",
    stateTone: "danger"
  },
  {
    key: "unauthorized",
    title: "Unauthorized",
    message: "Fail closed when access scope is missing or revoked.",
    stateTone: "warning"
  },
  {
    key: "offline",
    title: "Offline",
    message: "Preserve draft-safe behavior when connectivity is unavailable.",
    stateTone: "warning"
  },
  {
    key: "reduced-motion",
    title: "Reduced motion",
    message: "Respect reduced-motion preference while preserving readable shell transitions.",
    stateTone: "info"
  }
] as const;

export type PatientShellStateScaffold = (typeof patientShellStateScaffolds)[number];

export function createPatientShellApiClient<TClient>(
  baseUrl: string,
  factory: (resolvedBaseUrl: string) => TClient
): TClient {
  return factory(baseUrl);
}
