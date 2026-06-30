# Phase 2 Database Migration Runbook

## Scope

This runbook covers local synthetic database operations implemented in P02-ISS-004.

- `pnpm db:migrate`
- `pnpm db:status`
- `pnpm db:seed`
- `pnpm db:reset`
- `pnpm db:rollback`

These commands are local-only and synthetic-only. Production reset or seed behavior is prohibited.

## Safety controls

- Commands refuse execution if `NODE_ENV` is `production`.
- Commands refuse execution if `NELYO_DEPLOYMENT_ENV` is `production`.
- Commands refuse execution when `NELYO_ALLOW_PRODUCTION_DB_COMMANDS=true`.
- Seed data is deterministic and explicitly synthetic.

## Local defaults

- Host: `127.0.0.1`
- Port: `55432`
- Database: `nelyohealth_local`
- User: `nelyohealth`
- Password: `localdev`

Overrides are supported through `NELYO_LOCAL_POSTGRES_*` variables.

## Standard workflow

1. Start local infrastructure.
2. Apply migrations.
3. Confirm migration status.
4. Seed synthetic data.
5. Run tests requiring seed data.
6. Reset synthetic data when needed.
7. Stop local infrastructure.

Example:

```bash
pnpm infra:start
pnpm db:migrate
pnpm db:status
pnpm db:seed
pnpm db:reset
pnpm infra:stop
```

## Rollback or compensating action

`pnpm db:rollback` rolls back the latest applied migration when a reviewed `.down.sql` migration exists.

Current migration behavior in P02-ISS-004:

- `0001_foundation_infrastructure.up.sql` enables PostGIS and creates synthetic foundation objects.
- `0001_foundation_infrastructure.down.sql` removes only the synthetic foundation objects and schema.
- PostGIS extension removal is intentionally not performed by down migration to avoid unsafe global dependency breaks.

Compensating action expectation:

- If rollback cannot safely reverse shared extension state, use a documented compensating action and re-apply migration with `pnpm db:migrate`.

## Evidence expectations

- Migration apply evidence (`pnpm db:migrate`).
- Migration status evidence (`pnpm db:status`).
- Deterministic seed/reset evidence (`pnpm db:seed`, `pnpm db:reset`).
- Rollback evidence (`pnpm db:rollback` plus re-apply if required).
- Integration test evidence (`tests/integration/database-cli.spec.ts`) where Docker/Postgres are available.
