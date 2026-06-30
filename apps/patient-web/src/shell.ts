import { createApiClient } from "@nelyohealth/api-client";

export const patientShellDescriptor = {
  appId: "patient-web",
  issue: "P02-ISS-012",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type PatientShellDescriptor = typeof patientShellDescriptor;

export function createPatientShellApiClient(baseUrl: string) {
  return createApiClient(baseUrl);
}
