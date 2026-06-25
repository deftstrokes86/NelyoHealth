# @nelyohealth/worker

Boundary-only workspace for the future background worker.

## Public API

- Exports `workerApplicationBoundary` for P02-ISS-002 topology validation.
- Contains no jobs, queue clients, retries, DLQ behavior, outbox dispatch, observability wiring, containers, or live provider integrations.

Runtime implementation belongs to P02-ISS-007.
