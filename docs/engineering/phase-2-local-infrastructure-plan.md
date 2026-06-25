# Phase 2 Local Infrastructure Plan

## Purpose

Plan local infrastructure for the Phase 2 application skeleton. This document does not create Docker, database, migration, seed, or infrastructure files.

## Required local services

| Service | Local target | Notes |
|---|---|---|
| PostgreSQL | PostgreSQL 18.x | Latest approved minor at implementation time |
| PostGIS | PostGIS 3.6.x | Must match PostgreSQL 18 support |
| Redis-compatible service | Redis 8 or approved compatible alternative | License/commercial review required |
| Object storage | S3-compatible local service or approved emulator | Must support signed upload/download URL tests |
| Queue | BullMQ on Redis if approved, or pg-boss fallback | Must support enqueue, process, retry, DLQ evidence |
| OpenTelemetry collector/exporter | Local collector or console exporter | Must correlate API and worker traces/metrics/logs |
| Mail/SMS/push | Fake local adapters | No live delivery |
| Feature flags | OpenFeature in-memory/local provider | No vendor dashboard |

## Local workflow requirements

- Start dependencies with Docker Compose or an approved local container workflow.
- Use healthchecks for Postgres, Redis-compatible service, object storage, and collector.
- Provide deterministic reset and seed commands once P02-ISS-004 implements database ownership.
- Separate "start dependencies" from "start apps" so tests can choose shared local services or Testcontainers.
- Keep ports stable and documented.
- Keep all credentials synthetic and local-only.

## Database plan

P02-ISS-004 must:

- Select database access and migration tooling through ADR.
- Replace Phase 1 gated `pnpm db:migrate` and `pnpm db:seed` failures with operational Phase 2 behavior.
- Implement a migration safety checklist.
- Include migration status checks and rollback or compensating-action documentation.
- Provide synthetic seed and reset flows for browser harness.
- Avoid direct controller database access.

## Queue plan

P02-ISS-007 must:

- Define queue names and job envelope.
- Carry correlation IDs and safe context.
- Provide retry and DLQ policies.
- Include a deterministic test job for exit-gate evidence.
- Keep vendor-specific queue code in adapter packages.

## Object storage plan

P02-ISS-009 must:

- Define `ObjectStoragePort` with signed upload and download operations.
- Keep S3, MinIO, LocalStack, or cloud SDK types out of domain and API DTOs.
- Use synthetic documents only.
- Include signed URL expiry tests.
- Include cleanup of synthetic objects after tests.

## Observability plan

P02-ISS-011 must:

- Instrument API ingress, worker processing, queue enqueue/dequeue, and object storage adapter calls.
- Emit logs with request ID and correlation ID.
- Emit traces and metrics through OpenTelemetry-compatible setup.
- Avoid protected provider detail, PHI, payment credentials, auth secrets, and raw payloads in telemetry.

## Local acceptance checks

The final Phase 2 local gate must demonstrate:

- Postgres/PostGIS readiness.
- Migration apply and status check.
- Deterministic synthetic seed and reset.
- API health/readiness.
- Worker queue enqueue, process, retry, DLQ.
- Signed URL upload with synthetic document.
- Browser harness starts apps, signs in synthetically, navigates, and retains failure traces.
- Codex/browser inspection reports console and failed-network status for local routes.

