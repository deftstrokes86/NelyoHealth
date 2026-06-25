# Phase 2 Application Topology

## Purpose

Define the future Phase 2 workspace layout and ownership boundaries before any application code exists.

## Future workspace layout

```text
apps/
  api/
  worker/
  patient-web/
  provider-web/
  organization-web/
  admin-web/
  mobile/
packages/
  api-client/
  config/
  domain/
  observability/
  platform-adapters/
  testing-factories/
```

The package list is a planning target. P02-PLAN-001 does not create these paths.

## P02-ISS-002 implementation state

P02-ISS-002 creates the approved workspace paths as private, boundary-only
packages. It does not create runtime apps, framework configuration, routes,
database access, queue workers, object storage, observability wiring, auth,
clinical, payment, provider matching, production infrastructure, or pilot
behavior.

| Workspace | Package name | Boundary API | Runtime owner |
|---|---|---|---|
| `apps/api` | `@nelyohealth/api` | `apiApplicationBoundary` | P02-ISS-005 |
| `apps/worker` | `@nelyohealth/worker` | `workerApplicationBoundary` | P02-ISS-007 |
| `apps/patient-web` | `@nelyohealth/patient-web` | `patientWebApplicationBoundary` | P02-ISS-012 |
| `apps/provider-web` | `@nelyohealth/provider-web` | `providerWebApplicationBoundary` | P02-ISS-012 |
| `apps/organization-web` | `@nelyohealth/organization-web` | `organizationWebApplicationBoundary` | P02-ISS-012 |
| `apps/admin-web` | `@nelyohealth/admin-web` | `adminWebApplicationBoundary` | P02-ISS-012 |
| `apps/mobile` | `@nelyohealth/mobile` | `mobileApplicationBoundary` | P02-ISS-013 |
| `packages/api-client` | `@nelyohealth/api-client` | `apiClientPackageBoundary` | P02-ISS-006 |
| `packages/config` | `@nelyohealth/config` | `configPackageBoundary` | P02-ISS-015 |
| `packages/domain` | `@nelyohealth/domain` | `domainPackageBoundary` | P02-ISS-005 and later bounded-context issues |
| `packages/observability` | `@nelyohealth/observability` | `observabilityPackageBoundary` | P02-ISS-011 |
| `packages/platform-adapters` | `@nelyohealth/platform-adapters` | `platformAdaptersPackageBoundary` | P02-ISS-009 through P02-ISS-011 |
| `packages/testing-factories` | `@nelyohealth/testing-factories` | `testingFactoriesPackageBoundary` | P02-ISS-014 |

All P02-ISS-002 package manifests remain dependency-free except for existing
workspace tooling inherited from the root install. Later issues must install
framework or runtime dependencies only in their authorized scope.

## Application responsibilities

| App | Framework target | Responsibility | Explicit exclusions |
|---|---|---|---|
| apps/api | NestJS | REST API skeleton, health/readiness, request conventions, OpenAPI generation, module boundaries | Auth, clinical, payment, marketplace, pharmacy, lab, provider matching |
| apps/worker | Node/Nest-compatible worker | Queue processing, retries, DLQ, outbox dispatch, observability propagation | Live provider integrations, clinical automation |
| apps/patient-web | Next.js | Empty routed patient shell with synthetic sign-in harness only | Real patient account, clinical records, payments |
| apps/provider-web | Next.js | Empty routed provider shell with synthetic sign-in harness only | Practitioner credentialing, encounter workflow |
| apps/organization-web | Next.js | Empty routed organization shell with synthetic sign-in harness only | Employer/HMO benefits, claims |
| apps/admin-web | Next.js | Empty routed admin shell with synthetic sign-in harness only | Support access to real data or operational admin actions |
| apps/mobile | Expo or React Native | Empty mobile shell only | Native feature parity, push integration beyond adapter stub |

## Backend module rules

- The API remains one deployable modular monolith.
- Module boundaries must reflect existing architecture docs and ADR-0005.
- Domain modules may communicate through explicit interfaces, application services, domain events, or outbox records.
- No module may query another module's private tables.
- No controller may access the database directly.
- External calls must not run inside database transactions.
- Vendor SDKs must live under adapter packages or app-level infrastructure wiring, not domain packages.
- API DTOs must not expose internal provider identifiers, branch metadata, protected provider details, secrets, or implementation IDs.

## Shared package intent

| Package | Intent | Constraints |
|---|---|---|
| packages/api-client | Generated typed client from OpenAPI output | Generated artifacts only; no hand-authored domain logic |
| packages/config | Environment schema and typed config access | No real secrets committed; no production values |
| packages/domain | Shared domain primitives and error types | No vendor SDK imports; no persistence code |
| packages/observability | OpenTelemetry setup helpers, request IDs, logger context | Exporter selection through adapter/config only |
| packages/platform-adapters | Storage, queue, feature flag, email/SMS/push, error-reporting ports and adapters | Adapter-only vendor dependency boundary |
| packages/testing-factories | Synthetic data builders and route fixtures | Synthetic data only; no real patient/provider/clinical/payment data |

## API conventions

- REST routes use stable versioning conventions approved in P02-ISS-001.
- OpenAPI generation is required in CI before typed client generation.
- Standard errors include code, message, correlationId, and safe details only.
- Idempotency-key middleware is required for unsafe methods and future payment/order-like operations.
- Health endpoint reports process liveness.
- Readiness endpoint reports dependency readiness without leaking secrets.
- Request IDs and correlation IDs are accepted from trusted internal headers or generated at ingress.

## Worker conventions

- Jobs must carry correlation ID, request ID where available, synthetic actor context for tests, idempotency key when relevant, attempt count, and safe payload metadata.
- Retry policy must be explicit per job type.
- DLQ entries must preserve safe failure diagnostics and correlation IDs.
- Worker logs, metrics, and traces must connect back to originating API request for exit-gate evidence.

## Future nested instructions

When `apps/` is created, P02-ISS-002 must add nested `AGENTS.md` files for app-specific constraints:

- `apps/AGENTS.md`: no real data, no product features beyond authorized issue scope.
- `apps/api/AGENTS.md`: backend boundary, transaction, adapter, and OpenAPI rules.
- `apps/worker/AGENTS.md`: queue, retry, DLQ, outbox, and observability rules.
- `apps/*-web/AGENTS.md`: browser, privacy, accessibility, and synthetic auth rules.
- `apps/mobile/AGENTS.md`: empty-shell and no native feature parity rule.

## Path drift normalization

The P02 prompt referenced `docs/engineering/design-token-foundation.md` and `docs/engineering/content-registry-foundation.md`. The accepted repository paths are:

- `docs/engineering/design-tokens.md`
- `docs/engineering/content-registry.md`

Phase 2 planning uses the accepted repository paths and records this as documentation path normalization, not a source change.
