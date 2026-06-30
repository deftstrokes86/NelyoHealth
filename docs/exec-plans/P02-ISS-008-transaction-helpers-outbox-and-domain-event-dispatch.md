# P02-ISS-008 Transaction Helpers, Outbox, and Domain Event Dispatch

## Status

COMPLETED with deterministic synthetic test evidence.

## Objective

Add transaction helper foundations, transactional outbox scaffolding, and domain-event dispatch skeleton behavior with explicit retry and dead-letter semantics.

## Scope delivered

- Added transaction helper primitives with commit/rollback orchestration.
- Added transactional outbox domain-event envelope and external-call policy enforcement.
- Added outbox dispatch workflow with retry and dead-letter transitions.
- Added migration `0002_transactional_outbox` for local synthetic database schema alignment.
- Added deterministic tests for transaction commit/rollback, outbox insert/dispatch, and no external calls inside transactions.

## Files

- packages/database/src/transaction-outbox.ts
- packages/database/src/index.ts
- packages/database/migrations/0002_transactional_outbox.up.sql
- packages/database/migrations/0002_transactional_outbox.down.sql
- tests/unit/database-transaction-outbox.spec.ts
- tests/integration/database-outbox-dispatch.spec.ts
- packages/database/README.md
- docs/engineering/phase-2-database-migration-runbook.md

## Validation

```bash
pnpm vitest run tests/unit/database-transaction-outbox.spec.ts
pnpm vitest run tests/integration/database-outbox-dispatch.spec.ts
pnpm --filter @nelyohealth/database typecheck
pnpm --filter @nelyohealth/database build
```

Expected evidence:

- transaction helper commits and rolls back deterministically;
- outbox events insert through transaction context;
- dispatch marks events dispatched/retried/dead-lettered based on policy;
- external calls are blocked while transaction is active.

## Rollback

- Stop any outbox dispatcher process.
- Revert ISS-008 code files and docs.
- Roll back `0002_transactional_outbox` or reset local synthetic database.
