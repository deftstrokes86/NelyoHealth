# @nelyohealth/platform-adapters

Provider-neutral ports and adapter implementations for platform integration boundaries.

## Public API

- Exports `platformAdaptersPackageBoundary` for P02-ISS-002 topology validation.
- Exports queue job-envelope contracts and `SyntheticQueueAdapter` for deterministic ISS-007 retry and DLQ behavior.
- Exports object-storage signed URL contracts and `S3SignedUrlObjectStorageAdapter` for ISS-009 synthetic upload/download URL grants and cleanup.
- Exports communication ports and `FakeCommunicationsAdapter` for synthetic email/SMS/push dispatch harnesses.
- Exports feature-flag ports and `LocalFeatureFlagAdapter` for deterministic local flag evaluation.
- Exports enterprise identity/SSO ports for OIDC and SAML authentication flows, JIT provisioning, SCIM upsert, and workforce roster import.
- Exports `InMemoryEnterpriseIdentityAdapter` for deterministic Step 4 local and test scaffolding.
- Keeps queue payloads synthetic-safe by policy; no PHI, protected provider details, payment credentials, or secrets.

Additional live provider adapters (identity provider, object storage, communications, feature flags, observability) remain future implementation work.
