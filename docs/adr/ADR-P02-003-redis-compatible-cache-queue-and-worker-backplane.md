# ADR-P02-003: Redis-Compatible Cache, Queue, and Worker Backplane

## Status

ACCEPTED-FOR-PHASE-2-LOCAL-FOUNDATION; PRODUCTION-POSTURE-REVIEW-REQUIRED; IMPLEMENTATION-PENDING

## Date

2026-06-25

## Decision owners

Engineering/security owner and platform/operations owner. Legal/commercial review remains required for production Redis OSS 8 reliance or any managed provider contract.

## Context

Phase 2 requires a Redis-compatible cache/queue foundation, a worker, retries, DLQ behavior, and request/correlation ID propagation. The Phase 2 technology evaluation identified Redis OSS 8 license review risk and pg-boss as a fallback if Redis-compatible service use is rejected.

## Decision

Phase 2 local queue/cache work will use a Redis-compatible service boundary with Valkey 8.1.x as the preferred local service family, subject to P02-ISS-003 container/image verification.

Phase 2 worker queue code will use BullMQ behind a queue adapter and ioredis behind a Redis-compatible client adapter.

Exact future package pins are:

| Package | Version | Purpose |
|---|---:|---|
| `bullmq` | 5.79.1 | Queue, retry, worker, and DLQ foundation behind adapter |
| `ioredis` | 5.11.1 | Redis-compatible client behind adapter |
| `@testcontainers/redis` | 12.0.3 | Conditional integration-test support if needed |

Redis OSS 8 is not selected as the default service because Redis 8 uses a tri-license that includes RSALv2, SSPLv1, and AGPLv3. Redis OSS 8 may be reconsidered only after legal/commercial review.

pg-boss remains the fallback if P02-ISS-003 or P02-ISS-007 proves BullMQ/Valkey compatibility or operations risk unacceptable.

## Required queue rules

- Queue vendor/client types must stay in adapter packages or worker infrastructure wiring.
- Domain events and commands must use domain-neutral envelopes.
- Jobs must carry correlation ID and safe context.
- Retries and DLQ policies must be explicit per job type.
- Queue payloads must not contain PHI, raw clinical documents, auth secrets, payment credentials, or protected provider details.
- BullMQ production guidance on no arbitrary eviction must be reflected in local and future managed-service configuration.

## Alternatives considered

| Alternative | Decision |
|---|---|
| Redis OSS 8 default | Rejected as default pending legal/commercial review of tri-license posture. |
| Managed Redis-like service now | Deferred until cloud/provider selection. |
| pg-boss primary | Deferred as fallback because Phase 2 requires Redis-compatible cache/queue planning and BullMQ gives richer retry/DLQ primitives. |
| Direct BullMQ types in domain code | Rejected; adapter boundary required. |

## Consequences

- P02-ISS-003 can implement a local Redis-compatible service using a reviewed Valkey image/version.
- P02-ISS-007 can implement queue/worker behavior through a repository-owned adapter.
- Production queue/cache provider remains unresolved until cloud/provider and commercial review.

## Security and privacy implications

- Queue payloads are sensitive artifacts and must be minimized.
- Failed jobs and DLQ entries must not store raw payloads that include PHI, payment credentials, provider-location data, or secrets.
- Local and CI Redis-compatible credentials must be synthetic.

## Implementation implications

Implementation is pending P02-ISS-003 and P02-ISS-007. This ADR creates no container, queue, cache, job, worker, or package installation.

## Test implications

P02-ISS-007 must prove enqueue, process, retry, DLQ, idempotency, correlation propagation, and failure-path behavior with synthetic jobs.

## Review triggers

Review before Redis OSS 8 use, managed queue/cache provider selection, BullMQ major upgrade, ioredis replacement, Valkey image change, production cache/queue deployment, or job payload class expansion.

## Supersession rule

This ADR may be superseded only by a later ADR that preserves adapter isolation, retry/DLQ evidence, idempotency, synthetic-only tests, and licence/commercial review boundaries.

