export const patientShellDescriptor = {
  appId: "patient-web",
  issue: "P02-ISS-012",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type PatientShellDescriptor = typeof patientShellDescriptor;

export function createPatientShellApiClient<TClient>(
  baseUrl: string,
  factory: (resolvedBaseUrl: string) => TClient
): TClient {
  return factory(baseUrl);
}
