# P02-ISS-004 Database and Migration Foundation Execution Plan

## Objective

Implement operational Phase 2 local synthetic database commands and migration conventions:

- `pnpm db:migrate`
- `pnpm db:status`
- `pnpm db:seed`
- `pnpm db:reset`
- `pnpm db:rollback`

## Scope implemented

- Added `@nelyohealth/database` package with ADR-approved dependency pins.
- Added reviewed SQL migration artifacts under `packages/database/migrations/`.
- Added in-package database CLI under `packages/database/scripts/db-cli.mjs`.
- Replaced root db command scripts with operational Phase 2 behavior.
- Added deterministic synthetic seed/reset flow and metadata migration tracking.
- Added rollback command and documented compensating action behavior.
- Added ISS-004 unit and integration tests.
- Updated status, topology, governance blockers, and runbook docs.

## Safety controls

- Commands refuse execution in production-declared environments.
- Commands reject `NELYO_ALLOW_PRODUCTION_DB_COMMANDS=true`.
- Seed data is deterministic and explicitly synthetic-only.
- No real patient/provider/clinical/payment data is seeded.

## Validation evidence

Validated on 2026-06-30:

- `pnpm infra:start` passed.
- `pnpm db:migrate` passed.
- `pnpm db:status` passed.
- `pnpm db:seed` passed.
- `pnpm db:reset` passed.
- `pnpm db:rollback` passed after down migration safety correction.
- `pnpm exec vitest run tests/unit/database-foundation.spec.ts` passed.
- `NELYO_RUN_DB_INTEGRATION=1 pnpm exec vitest run tests/integration/database-cli.spec.ts` passed.
- `pnpm infra:stop` passed.

## Rollback/compensating action note

The initial rollback attempt failed when dropping the global PostGIS extension. The down migration was corrected to remove only synthetic foundation objects and schema. This is now the approved compensating-action posture for local synthetic rollback safety.

## Out of scope

- No API controller/database wiring.
- No outbox/transaction helper implementation (P02-ISS-008).
- No production database operations.
- No Git or GitHub write.
