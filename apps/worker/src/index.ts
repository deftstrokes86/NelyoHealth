export const workerApplicationBoundary = {
  id: "worker",
  packageName: "@nelyohealth/worker",
  kind: "application",
  status: "queue-foundation-implemented",
  owningIssue: "P02-ISS-007",
  frameworkTarget: "Node/Nest-compatible worker",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type WorkerApplicationBoundary = typeof workerApplicationBoundary;

export {
  assertSafeSyntheticEnvelope,
  type WorkerDeadLetterEntry,
  type WorkerJobEnvelope,
  type WorkerJobSafeContext,
  type WorkerQueueHealthSnapshot,
  type WorkerQueuePort,
  type WorkerQueueProcessResult,
  type WorkerQueueProcessor,
  WorkerQueueRuntime
} from "./worker-runtime.js";

export {
  buildDeterministicJobEnvelope,
  createDeterministicJobProcessor,
  type DeterministicJobAuditEntry,
  type DeterministicSyntheticJobPayload
} from "./deterministic-job.js";
