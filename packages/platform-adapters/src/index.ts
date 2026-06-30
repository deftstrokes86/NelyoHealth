export const platformAdaptersPackageBoundary = {
  id: "platform-adapters",
  packageName: "@nelyohealth/platform-adapters",
  kind: "shared-package",
  status: "queue-foundation-implemented",
  owningIssue: "P02-ISS-007/P02-ISS-009/P02-ISS-010/P02-ISS-011",
  publicApi: "Provider-neutral platform ports and adapter boundary",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type PlatformAdaptersPackageBoundary = typeof platformAdaptersPackageBoundary;

export {
  buildQueueFingerprint,
  type QueueAdapter,
  type QueueDeadLetterEntry,
  type QueueEnqueueResult,
  type QueueHealthSnapshot,
  type QueueJobEnvelope,
  type QueueJobSafeContext,
  type QueueProcessResult,
  type QueueProcessor
} from "./queue/queue-envelope.js";

export { SyntheticQueueAdapter } from "./queue/synthetic-queue.adapter.js";
