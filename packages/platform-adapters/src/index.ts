export const platformAdaptersPackageBoundary = {
  id: "platform-adapters",
  packageName: "@nelyohealth/platform-adapters",
  kind: "shared-package",
  status: "phase-2-foundation-plus-phase-3-sso-adapter-scaffold",
  owningIssue: "P02-ISS-007/P02-ISS-009/P02-ISS-010/P02-ISS-011/P03-ISS-004",
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

export {
  assertSafeSyntheticStorageKey,
  assertSignedUrlExpiry,
  type ObjectStorageCleanupResult,
  type ObjectStoragePort,
  type ObjectStorageSignedUrlGrant,
  type ObjectStorageSignedUrlRequest,
  type SignedUrlOperation
} from "./storage/object-storage-port.js";

export {
  S3SignedUrlObjectStorageAdapter,
  type S3SignedUrlAdapterConfig
} from "./storage/s3-signed-url.adapter.js";

export {
  assertSafeCommunicationMessage,
  type CommunicationChannel,
  type CommunicationDispatchReceipt,
  type CommunicationMessage,
  type CommunicationSafeContext,
  type CommunicationsPort
} from "./communications/communications-port.js";

export { FakeCommunicationsAdapter } from "./communications/fake-communications.adapter.js";

export {
  assertSafeFeatureFlagKey,
  type FeatureFlagContext,
  type FeatureFlagEvaluation,
  type FeatureFlagPort,
  type FeatureFlagValue
} from "./feature-flags/feature-flag-port.js";

export {
  LocalFeatureFlagAdapter,
  type LocalFeatureFlagAdapterConfig
} from "./feature-flags/local-feature-flag.adapter.js";

export {
  assertSafeEnterpriseTenantId,
  assertSafeExternalSubject,
  type EnterpriseIdentityProtocol,
  type EnterpriseIdentityAuthenticationStartRequest,
  type EnterpriseIdentityAuthenticationStartResult,
  type EnterpriseIdentityAuthenticationCompleteRequest,
  type EnterpriseIdentityAuthenticationCompleteResult,
  type JitProvisioningRequest,
  type JitProvisioningResult,
  type ScimUserUpsertRequest,
  type ScimUserUpsertResult,
  type WorkforceRosterRecord,
  type WorkforceRosterImportRequest,
  type WorkforceRosterImportResult,
  type EnterpriseIdentityPort
} from "./sso/enterprise-identity-port.js";

export { InMemoryEnterpriseIdentityAdapter } from "./sso/in-memory-enterprise-identity.adapter.js";
