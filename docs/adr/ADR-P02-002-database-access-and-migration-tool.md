# ADR-P02-002: Database Access and Migration Tool

## Status

ACCEPTED-FOR-PHASE-2-DATABASE-FOUNDATION; IMPLEMENTATION-PENDING-P02-ISS-004

## Date

2026-06-25

## Decision owners

Platform/data owner and engineering/architecture owner. Security, privacy, clinical, finance, and operations owners retain approval authority for domain data and production operations.

## Context

Phase 2 requires PostgreSQL, PostGIS, safe migrations, transaction helpers, synthetic seed/reset behavior, and later transactional outbox support. P02-ISS-001 does not own database implementation.

ADR-0005 requires a modular monolith, context-owned data, no private-table dependencies across modules, no direct controller database access, and no external provider calls inside local database transactions.

## Decision

Phase 2 will use:

- PostgreSQL 18.4 as the database target.
- PostGIS 3.6.4 for geospatial capability when later schemas require extensions.
- Drizzle ORM for TypeScript SQL access.
- Drizzle Kit for generated SQL migration files and migration execution conventions.
- node-postgres (`pg`) as the PostgreSQL driver.

Exact future package pins are:

| Package | Version | Purpose |
|---|---:|---|
| `drizzle-orm` | 0.45.2 | Typed SQL access |
| `drizzle-kit` | 0.31.10 | Migration generation and migration CLI |
| `pg` | 8.22.0 | PostgreSQL driver |
| `@types/pg` | 8.20.0 | Type declarations if needed |

## Database implementation rules

- P02-ISS-004 owns operational `pnpm db:migrate` and `pnpm db:seed`.
- P02-ISS-001 creates no schema, migration, seed, reset command, database package, database container, or connection config.
- Migrations must be reviewable SQL artifacts or generated artifacts checked into the later database package according to the P02-ISS-004 plan.
- Migration commands must refuse production reset/seed behavior.
- Synthetic seed data must be deterministic and explicitly synthetic.
- PostGIS extension ownership must be explicit in migrations and rollout/rollback documentation.
- Domain modules must not query another module's private tables.
- Transaction helpers and outbox behavior are later P02-ISS-008 work.

## Alternatives considered

| Alternative | Decision |
|---|---|
| Prisma | Deferred because generated client/binary lifecycle and abstraction weight are higher than needed for the Phase 2 skeleton. |
| Kysely-only | Deferred because the migration story would need additional selected tooling. |
| Raw `pg` everywhere | Rejected because it increases duplication and weakens typed query conventions. |
| ORM-generated runtime schema push | Rejected for governed migrations; Phase 2 needs reviewable migration behavior. |

## Consequences

- P02-ISS-004 can implement migration commands against Drizzle/pg without reselecting tooling.
- SQL remains visible enough for migration safety review and PostGIS extension control.
- Later schema work must keep bounded-context ownership explicit.

## Security and privacy implications

- No production database editing is approved.
- No real patient, provider, clinical, payment, facility, or credential data is allowed in seeds or tests.
- Database errors and migration logs must not leak connection secrets or sensitive row data.

## Implementation implications

Implementation is pending P02-ISS-004. This ADR creates no database code or artifacts.

## Test implications

P02-ISS-004 must add migration apply/status evidence, rollback or compensating-action documentation, deterministic seed/reset evidence, failure-path tests, and configuration validation.

## Review triggers

Review before database package creation, migration command implementation, production-like database connectivity, PostGIS extension changes, migration tool upgrade, direct SQL helper creation, or any schema affecting clinical/payment/provider data.

## Supersession rule

This ADR may be superseded only by a later ADR that preserves migration safety, synthetic-only lower environments, modular-monolith data ownership, and no routine production database editing.
