# P02-ISS-005 NestJS API Skeleton and Request Conventions

## Objective

Implement the approved NestJS API skeleton with foundational runtime conventions:

- health endpoint
- readiness endpoint
- request/correlation ID propagation
- standardized API error envelopes
- idempotency middleware for unsafe requests

## Scope implemented

- Added NestJS skeleton modules and bootstrap files under `apps/api/src/nest/`.
- Added request-context middleware to accept or generate request/correlation IDs.
- Added idempotency middleware for duplicate unsafe request fingerprints.
- Added global exception filter producing standardized envelope shape.
- Added system controller routes: `/api/health`, `/api/ready`, `/api/idempotency/probe`.
- Added integration tests for health/readiness, request/correlation propagation, and idempotency checks.
- Updated API workspace docs and instructions.

## Validation evidence

Validated on 2026-06-30:

- `pnpm exec vitest run tests/integration/api-nest-runtime.spec.ts` passed (3 tests).
- New NestJS route bootstrap logs show mapped routes for `/api/health`, `/api/ready`, and `/api/idempotency/probe`.
- New files pass diagnostics checks.

## Known validation gap

- `pnpm --filter @nelyohealth/api typecheck` still fails because of pre-existing type errors in non-Nest legacy files already present in `apps/api/src` before this ISS-005 implementation.
- ISS-005 additions themselves report no diagnostics errors.

## Out of scope

- No OpenAPI generation (P02-ISS-006).
- No database controller wiring.
- No auth, payment, clinical, provider-matching, or production behavior.
- No Git or GitHub write.
