# P02-ISS-007 Worker Queue Foundation, Retries, and DLQ

## Status

COMPLETED with deterministic synthetic evidence.

## Objective

Create the worker queue foundation with explicit queue envelope contracts, deterministic retry behavior, dead-letter handling, idempotent enqueue semantics, and correlation propagation evidence.

## Scope delivered

- Added queue-envelope contracts and a deterministic queue adapter in the platform-adapters package.
- Added worker runtime orchestration with synthetic-envelope safety checks.
- Added deterministic synthetic job helpers for repeatable retry and failure behavior.
- Added integration evidence for enqueue, process, retry, DLQ, idempotency, correlation propagation, and worker health snapshots.
- Added unit evidence for synthetic envelope safety guardrails.

## Files

- packages/platform-adapters/src/queue/queue-envelope.ts
- packages/platform-adapters/src/queue/synthetic-queue.adapter.ts
- packages/platform-adapters/src/index.ts
- apps/worker/src/worker-runtime.ts
- apps/worker/src/deterministic-job.ts
- apps/worker/src/index.ts
- tests/integration/worker-queue-runtime.spec.ts
- tests/unit/worker-queue-foundation.spec.ts
- apps/worker/README.md
- packages/platform-adapters/README.md
- apps/worker/AGENTS.md

## Validation

Run the focused evidence commands:

```bash
pnpm test -- tests/unit/worker-queue-foundation.spec.ts
pnpm test:integration -- tests/integration/worker-queue-runtime.spec.ts
```

Expected evidence:

- deterministic retry transitions from processing failure to completion within max attempts;
- terminal failures move to DLQ;
- duplicate idempotency key for same job type deduplicates enqueue;
- correlation ID is retained across attempts;
- worker health snapshot counters reflect queue activity.

## Rollback

- Revert worker and platform-adapter ISS-007 files.
- Drain synthetic queue state from runtime tests.
- Restore worker boundary-only exports and docs if queue foundation must be deferred.
