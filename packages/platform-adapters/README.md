# @nelyohealth/platform-adapters

Provider-neutral ports and adapter implementations for platform integration boundaries.

## Public API

- Exports `platformAdaptersPackageBoundary` for P02-ISS-002 topology validation.
- Exports queue job-envelope contracts and `SyntheticQueueAdapter` for deterministic ISS-007 retry and DLQ behavior.
- Exports object-storage signed URL contracts and `S3SignedUrlObjectStorageAdapter` for ISS-009 synthetic upload/download URL grants and cleanup.
- Keeps queue payloads synthetic-safe by policy; no PHI, protected provider details, payment credentials, or secrets.

Additional live provider adapters (object storage, communications, feature flags, observability) remain future Phase 2 work.
