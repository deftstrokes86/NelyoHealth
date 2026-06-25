# ADR-P02-004: Object Storage Signed URL Adapter

## Status

ACCEPTED-FOR-PORT-AND-SDK; LOCAL-EMULATOR-REVIEW-REQUIRED; IMPLEMENTATION-PENDING

## Date

2026-06-25

## Decision owners

Platform/data owner, engineering/security owner, and privacy owner. Legal/commercial review remains required before relying on LocalStack or MinIO in commercial CI/development workflows.

## Context

Phase 2 requires object storage with signed upload/download URL support for synthetic documents. Domain code must not depend on cloud/vendor SDK types.

The technology evaluation identified S3-compatible semantics as the safest contract but left local emulator selection approval-required because MinIO and LocalStack have different licence/account considerations.

## Decision

Phase 2 object storage code will expose a repository-owned `ObjectStoragePort` and keep S3/AWS/LocalStack/MinIO types inside adapters only.

The default signed URL implementation will use AWS SDK for JavaScript v3 packages behind the adapter:

| Package | Version | Purpose |
|---|---:|---|
| `@aws-sdk/client-s3` | 3.1075.0 | S3-compatible object operations behind adapter |
| `@aws-sdk/s3-request-presigner` | 3.1075.0 | Signed upload/download URL generation behind adapter |

Local emulator selection is not fully approved by P02-ISS-001:

- LocalStack is a candidate for S3-compatible local testing, but current LocalStack licensing docs require review for commercial-use subscriptions and CI tokens.
- MinIO is a candidate S3-compatible store, but current MinIO repository evidence identifies AGPLv3 licensing, requiring legal/commercial review.
- `@testcontainers/localstack` 12.0.3 is conditionally approved only if LocalStack use is approved by P02-ISS-003/P02-ISS-009.

## Required storage rules

- Storage keys must be synthetic and deterministic in lower environments.
- Signed URLs must expire.
- Upload/download tests must use synthetic documents only.
- Adapter responses must not expose provider details, real patient data, clinical records, payment credentials, or secrets.
- Domain, API contracts, and browser state must not contain AWS SDK, LocalStack, or MinIO types.
- Cleanup of synthetic objects is required in P02-ISS-009.

## Alternatives considered

| Alternative | Decision |
|---|---|
| Direct AWS SDK types in domain/API contracts | Rejected; violates adapter boundary. |
| MinIO JavaScript SDK as app-facing contract | Rejected as default; would bind app code to a local product and AGPLv3 review remains. |
| LocalStack as unconditional local/CI emulator | Deferred until commercial/licence and CI-token posture is approved. |
| In-memory fake only | Deferred for unit tests only; Phase 2 signed URL exit gate needs a real-enough object store path. |

## Consequences

- P02-ISS-009 can implement a stable object-storage port and S3-compatible adapter without reselecting SDK packages.
- P02-ISS-003/P02-ISS-009 must resolve local emulator posture before local signed URL evidence can be claimed.
- Production object storage provider remains deferred to cloud/provider and privacy/security review.

## Security and privacy implications

- Signed URLs are bearer capabilities and must be short-lived, scoped, logged safely, and never committed.
- Browser tests and traces must not contain real documents or production buckets.
- Object keys and metadata must not encode PHI, provider identities, clinical diagnoses, payment data, or secrets.

## Implementation implications

Implementation is pending P02-ISS-003 and P02-ISS-009. This ADR creates no storage adapter code, bucket, emulator, container, or signed URL route.

## Test implications

P02-ISS-009 must test signed upload, signed download, expiry behavior, cleanup, no real data, and no provider-detail leakage in browser/network artifacts.

## Review triggers

Review before emulator selection, object storage provider selection, AWS SDK major/minor upgrade, signed URL policy change, document metadata expansion, malware scanning selection, or production object storage use.

## Supersession rule

This ADR may be superseded only by a later ADR that preserves adapter boundaries, signed URL scoping, synthetic-only lower environments, and no production data copied downward.

