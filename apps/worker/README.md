# @nelyohealth/worker

Background worker foundation with deterministic queue processing for Phase 2 ISS-007.

## Public API

- Exports `workerApplicationBoundary` with `queue-foundation-implemented` status.
- Exports `WorkerQueueRuntime` and queue-envelope safety checks.
- Exports deterministic synthetic job helpers used by test evidence.
- Retains synthetic-only data behavior and keeps feature implementation out of scope.

Outbox dispatch and broader observability wiring remain future work in P02-ISS-008 and P02-ISS-011.
