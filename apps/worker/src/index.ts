export const workerApplicationBoundary = {
  id: "worker",
  packageName: "@nelyohealth/worker",
  kind: "application",
  status: "boundary-only",
  owningIssue: "P02-ISS-007",
  frameworkTarget: "Node/Nest-compatible worker",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type WorkerApplicationBoundary = typeof workerApplicationBoundary;
