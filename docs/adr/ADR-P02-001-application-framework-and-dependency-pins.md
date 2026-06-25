# ADR-P02-001: Application Framework and Dependency Pins

## Status

ACCEPTED-FOR-PHASE-2-FOUNDATION; IMPLEMENTATION-PENDING

## Date

2026-06-25

## Decision owners

Engineering/architecture owner. Product, privacy, security, QA, accessibility, and domain owners retain approval authority for product behavior.

## Context

Phase 2 must create a deployable application skeleton with a NestJS API, worker, Next.js web app shells, and an empty Expo or React Native mobile shell. P02-ISS-001 is the dependency decision gate and does not create application code.

The repository already pins Node 24.18.0, pnpm 11.9.0, TypeScript 6.0.3, React 19.2.7, React DOM 19.2.7, strict TypeScript, exact dependency specifiers, deterministic browser checks, and manual Git/GitHub governance.

## Decision

Phase 2 will use:

- NestJS 11 for `apps/api` and API-adjacent testing.
- Next.js 16 for `apps/patient-web`, `apps/provider-web`, `apps/organization-web`, and `apps/admin-web`.
- Expo SDK 56 with React Native 0.85.3 for the empty `apps/mobile` shell.
- OpenAPI generated from NestJS with `@nestjs/swagger`.
- `openapi-typescript` and `openapi-fetch` for a lightweight typed frontend client.

Exact future package pins are recorded in `docs/engineering/phase-2-dependency-decision-pack.md`. Later issues must recheck metadata immediately before installing.

## Approved future pins

| Area | Package | Version |
|---|---|---:|
| Web | `next` | 16.2.9 |
| Web peers | `react`, `react-dom` | 19.2.7 |
| API | `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `@nestjs/testing` | 11.1.27 |
| API peers | `reflect-metadata`, `rxjs` | 0.2.2, 7.8.2 |
| OpenAPI | `@nestjs/swagger` | 11.4.4 |
| Typed client | `openapi-typescript`, `openapi-fetch` | 7.13.0, 0.17.0 |
| Mobile shell | `expo`, `react-native` | 56.0.12, 0.85.3 |

## Alternatives considered

| Alternative | Decision |
|---|---|
| Unstructured Express API | Rejected because Phase 2 topology requires NestJS and modular boundaries. |
| Fastify-first API | Deferred; NestJS Express default is lower-risk for skeleton and OpenAPI setup. |
| Vite-only web shells | Rejected because Phase 2 topology requires Next.js shells. |
| Raw React Native first | Deferred; Expo empty shell reduces Phase 2 native setup scope. |
| React Native 0.86 under Expo SDK 56 | Deferred because Expo SDK 56 documentation targets the React Native 0.85 line. |
| Rich SDK generator before API skeleton | Deferred; lightweight OpenAPI types and fetch client are enough for shell wiring. |

## Consequences

- P02-ISS-002 can create workspace package boundaries without selecting frameworks again.
- P02-ISS-005 must keep NestJS controllers out of direct database access.
- P02-ISS-006 must generate OpenAPI and typed clients without protected provider fields.
- P02-ISS-012 must keep web shells empty and synthetic until later authorized product work.
- P02-ISS-013 must not claim native feature parity.

## Security and privacy implications

- Frameworks do not approve auth, identity, clinical, payment, provider-detail disclosure, or real data behavior.
- API DTOs and browser shells must not expose protected provider details, secrets, PHI, real provider data, or payment credentials.
- Vendor and framework-specific types must not become domain model types.

## Implementation implications

Implementation is pending later issues. This ADR creates no `apps/`, no framework configuration, no routes, no OpenAPI artifact, no mobile shell, and no package installation.

## Test implications

Later issues must add framework-specific unit, integration, contract, browser, accessibility, and generated-file drift tests as assigned by the backlog.

## Review triggers

Review this ADR before any framework upgrade, package install, app scaffold, route implementation, OpenAPI generator replacement, mobile-shell expansion, auth implementation, or production deployment.

## Supersession rule

This ADR may be superseded only by a later ADR that preserves Phase 2 topology, locked requirements, adapter boundaries, synthetic-data rules, and human-only Git/GitHub governance.
