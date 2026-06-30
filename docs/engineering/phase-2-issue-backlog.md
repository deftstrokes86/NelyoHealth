# Phase 2 Issue Backlog

## Status

This backlog is the authoritative P02-PLAN-001 decomposition. It defines future implementation issues only. No issue is started by this document.

## Issue format

Each implementation issue must include:

- Required reads from this plan and relevant governance docs.
- Exact dependency pins or ADR evidence before dependency changes.
- Files expected to change.
- Tests and browser evidence expected.
- Rollback plan.
- Confirmation that pilot remains PILOT-NO-GO.
- Confirmation that Codex performed no Git or GitHub writes.

## Ordered backlog

### P02-ISS-001 - Phase 2 ADR and dependency decision pack

Objective: Record ADRs for app frameworks, database access/migrations, Redis/queue/cache, object storage, IaC/cloud provider path, observability/error reporting, and exact dependency pins.

Expected files: ADRs, decision register, dependency register, risk register, package policy updates if dependency classes are approved.

Tests/evidence: package metadata checks, license checks, ADR review checklist, no install unless authorized.

Rollback: revert ADR proposal before implementation; no runtime rollback because no app code should exist.

Blocks: all later issues.

### P02-ISS-002 - Workspace topology and package boundaries

Objective: Create `apps/` and approved shared packages with nested `AGENTS.md` guidance and no feature implementation.

Expected files: workspace manifests, empty package/app scaffolds, nested instructions, build/lint/typecheck wiring.

Tests/evidence: format, lint, typecheck, package policy, repository verify.

Rollback: remove newly created empty scaffolds and package references if validation fails before merge.

Depends on: P02-ISS-001.

### P02-ISS-003 - Local infrastructure harness

Objective: Add local dependency orchestration for Postgres/PostGIS, Redis-compatible service, object storage/emulator, and observability local support.

Expected files: local container workflow files only after ADR, docs, local scripts.

Tests/evidence: start/stop, healthchecks, port conflict behavior, no real secrets.

Rollback: stop services, remove local containers/volumes created by the harness, revert config.

Depends on: P02-ISS-001.

### P02-ISS-004 - Database and migration foundation

Objective: Implement operational `pnpm db:migrate` and `pnpm db:seed` with synthetic-only reset/seed and safe migration conventions.

Expected files: database package, migration tooling config, initial infrastructure-only migration if approved, seed/reset scripts, migration runbook.

Tests/evidence: migration apply/status, reset/seed, rollback/compensating-action evidence, integration tests.

Rollback: documented down migration or compensating action; reset local synthetic database.

Depends on: P02-ISS-001, P02-ISS-003.

### P02-ISS-005 - NestJS API skeleton and backend request conventions

Objective: Create API skeleton with health/readiness, request/correlation IDs, standard errors, idempotency middleware, and module boundaries.

Expected files: `apps/api`, backend packages, tests, docs.

Tests/evidence: unit/integration/API health tests, typecheck, lint, request ID propagation test.

Rollback: revert API package and workspace wiring.

Depends on: P02-ISS-002, P02-ISS-004.

### P02-ISS-006 - OpenAPI generation and typed client contract

Objective: Generate OpenAPI from API and typed client package for frontend use.

Expected files: OpenAPI generation scripts, `packages/api-client`, contract tests.

Tests/evidence: OpenAPI generation, typed client generation, contract drift test, no protected fields in skeleton contract.

Rollback: remove generated client and generation scripts.

Depends on: P02-ISS-005.

### P02-ISS-007 - Worker queue foundation, retries, and DLQ

Objective: Create worker skeleton with queue abstraction, deterministic test job, retry policy, and DLQ behavior.

Expected files: `apps/worker`, queue adapter package, job envelope definitions, tests.

Tests/evidence: enqueue/process/retry/DLQ test, correlation ID propagation, worker health.

Rollback: pause worker, drain/remove synthetic queue data, revert worker package.

Depends on: P02-ISS-003, P02-ISS-005.

### P02-ISS-008 - Transaction helpers, outbox, and domain event dispatch

Objective: Add database transaction helper, transactional outbox, and domain event dispatcher skeleton.

Expected files: backend data package, outbox migration if approved, outbox dispatcher, tests.

Tests/evidence: transaction commit/rollback tests, outbox insert/dispatch test, no external call inside transaction.

Rollback: stop dispatcher, reverse local outbox migration or reset synthetic database.

Depends on: P02-ISS-004, P02-ISS-005, P02-ISS-007.

### P02-ISS-009 - Object storage signed URL adapter

Objective: Implement object-storage port and local adapter able to issue signed upload/download URLs for synthetic documents.

Expected files: storage adapter package, API endpoint for synthetic signed URL harness, tests.

Tests/evidence: signed upload, signed download, expiry behavior, cleanup, no real document data.

Rollback: delete synthetic objects, revoke/expire URL through config, revert adapter.

Depends on: P02-ISS-003, P02-ISS-005.

### P02-ISS-010 - Email, SMS, push, and feature flag adapter shells

Objective: Add provider-neutral ports and local fake adapters for communications and feature flags.

Expected files: adapter interfaces, local fake implementations, OpenFeature local provider if approved.

Tests/evidence: fake send/evaluate tests, no live vendor calls, no secrets.

Rollback: disable adapters by config and revert package changes.

Depends on: P02-ISS-005.

### P02-ISS-011 - Observability foundation across API and worker

Objective: Connect logs, traces, and metrics across one API request that enqueues and processes a worker job.

Expected files: observability package, API/worker instrumentation, local exporter config, tests.

Tests/evidence: request-to-worker correlation evidence, safe log payload scan, metric emission.

Rollback: disable exporter by config; preserve local logs for diagnosis.

Depends on: P02-ISS-005, P02-ISS-007.

### P02-ISS-012 - Next.js web application shells

Objective: Create patient, provider, organization, and admin Next.js shells with shared design foundation and typed client wiring.

Expected files: four `apps/*-web` directories, route shells, tests.

Tests/evidence: build, typecheck, Playwright smoke, accessibility smoke, no protected data in routes.

Rollback: revert web app packages and workspace references.

Depends on: P02-ISS-002, P02-ISS-006.

### P02-ISS-013 - Expo or React Native mobile shell

Objective: Create empty mobile shell only, with no native feature parity claim.

Expected files: `apps/mobile`, minimal shell, lint/typecheck/build or Expo validation command.

Tests/evidence: typecheck, smoke render where supported, no push/provider integration beyond stubs.

Rollback: revert mobile app package and workspace references.

Depends on: P02-ISS-002.

Status: completed with empty Expo shell runtime, synthetic-only UI surface, and validation evidence.

### P02-ISS-014 - Phase 2 browser harness expansion

Objective: Implement per-app Chromium projects, auth storage states, synthetic builders, DB reset/seed, API helpers, page objects, console/network assertions, privacy checks, traces, screenshots, videos, a11y, sharding, retries, and artifact retention.

Expected files: Playwright config updates, tests, fixtures, browser docs.

Tests/evidence: browser suite passing locally and in CI, Codex local inspection evidence.

Rollback: disable new project matrix by config while preserving existing Phase 1 smoke tests.

Depends on: P02-ISS-004, P02-ISS-006, P02-ISS-007, P02-ISS-009, P02-ISS-012, P02-ISS-013.

Status: completed with per-app Chromium projects, synthetic auth-state generation, privacy assertions, and accessibility smoke evidence.

### P02-ISS-015 - Environment and secret strategy implementation

Objective: Add typed environment config, local example placeholders, secret reference model, and readiness validation.

Expected files: config package, docs, tests.

Tests/evidence: missing-config failure tests, no secret scan findings, readiness redaction tests.

Rollback: revert config package and app wiring.

Depends on: P02-ISS-001, P02-ISS-003, P02-ISS-011.

### P02-ISS-016 - IaC provider selection and deployment contract

Objective: Select IaC tool and cloud/deployment target with human approval, then create provider-neutral deployment contract or approved IaC skeleton.

Expected files: ADR, infra docs, optional IaC skeleton if authorized.

Tests/evidence: format/validate/plan-only checks where safe, no apply unless explicitly authorized by human process.

Rollback: no live resources should exist unless later authorized; revert IaC files and ADR proposal if rejected.

Depends on: P02-ISS-001 and human cloud decision.

### P02-ISS-017 - Development deploy and staging promotion path

Objective: Implement human-merge-to-development deployment and version promotion to staging after P02-ISS-016 approval.

Expected files: deployment workflow/config, release docs, staging promotion runbook.

Tests/evidence: dev deployment after human merge, staging promotion dry run or controlled evidence, migration gate.

Rollback: redeploy previous artifact, run documented migration rollback/compensation, record evidence.

Depends on: P02-ISS-015, P02-ISS-016.

### P02-ISS-018 - Phase 2 exit-gate rehearsal and rollback evidence

Objective: Rehearse all Phase 2 exit gates and record completion evidence.

Expected files: gate review, completion report, updated status/registers.

Tests/evidence: full verification suite, browser harness, local route inspection, development deployment, staging promotion, migration safety, queue/DLQ, signed URL, observability correlation.

Rollback: exercise rollback runbook for app artifact and migration strategy in non-production.

Depends on: P02-ISS-014, P02-ISS-017.

## Blocked or approval-gated issue starts

- P02-ISS-003 and later dependency implementation require P02-ISS-001 decisions.
- P02-ISS-004 requires database migration owner and tool ADR.
- P02-ISS-016 requires human cloud/provider decision.
- P02-ISS-017 cannot start until P02-ISS-016 is approved.
- P02-ISS-018 cannot claim Phase 2 completion if any exit gate lacks evidence.

