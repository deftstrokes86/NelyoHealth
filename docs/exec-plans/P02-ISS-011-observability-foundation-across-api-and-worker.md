# P02-ISS-011 Observability Foundation Across API and Worker

## Status

COMPLETED with deterministic synthetic test evidence.

## Objective

Connect logs, traces, and metrics across one API request that enqueues and processes a worker job using safe synthetic observability payloads.

## Scope delivered

- Implemented observability foundation package with in-memory telemetry recorder.
- Added trace-context creation, span lifecycle events, log events, and metric events.
- Added telemetry attribute redaction safeguards for secret-like and protected fragments.
- Added API observability probe endpoint that runs API-to-worker synthetic flow with retry behavior.
- Captured correlated telemetry across API and worker processing in one probe response.
- Added deterministic unit/integration tests for observability coverage.
- Regenerated OpenAPI and typed client artifacts for new endpoint.

## Files

- packages/observability/src/telemetry-foundation.ts
- packages/observability/src/index.ts
- packages/observability/README.md
- apps/api/src/nest/observability/observability.service.ts
- apps/api/src/nest/observability/observability.controller.ts
- apps/api/src/nest/observability/observability.module.ts
- apps/api/src/nest/app.module.ts
- apps/api/src/nest/openapi-generate.spec.ts
- apps/api/src/nest/openapi-drift.spec.ts
- tests/unit/observability-foundation.spec.ts
- tests/integration/api-observability-correlation.spec.ts
- packages/api-client/openapi/openapi.json
- packages/api-client/src/generated/openapi-types.ts
- packages/api-client/src/generated/client.ts

## Validation

```bash
pnpm --filter @nelyohealth/observability build
pnpm vitest run tests/unit/observability-foundation.spec.ts
pnpm vitest run tests/integration/api-observability-correlation.spec.ts
pnpm openapi:generate
pnpm --filter @nelyohealth/api exec vitest run src/nest/openapi-drift.spec.ts
pnpm api-client:generate
pnpm vitest run tests/integration/api-nest-runtime.spec.ts
```

Expected evidence:

- shared correlation/trace context exists across API and worker events;
- logs, spans, and metrics are emitted for one request lifecycle;
- retry path produces deterministic metric progression;
- secret-like and protected telemetry attributes are redacted.

## Rollback

- Revert ISS-011 observability package, API module, and tests.
- Disable observability probe route.
- Preserve logs/traces captured in local artifacts for diagnosis if needed.
