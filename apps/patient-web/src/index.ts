export const patientWebApplicationBoundary = {
  id: "patient-web",
  packageName: "@nelyohealth/patient-web",
  kind: "application",
  status: "boundary-only",
  owningIssue: "P02-ISS-012",
  frameworkTarget: "Next.js 16",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type PatientWebApplicationBoundary = typeof patientWebApplicationBoundary;
