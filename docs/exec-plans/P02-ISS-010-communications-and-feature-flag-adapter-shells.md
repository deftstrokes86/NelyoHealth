# P02-ISS-010 Email, SMS, Push, and Feature Flag Adapter Shells

## Status

COMPLETED with deterministic synthetic unit-test evidence.

## Objective

Add provider-neutral communications and feature-flag ports with local fake adapter shells. No live vendor integrations are included.

## Scope delivered

- Added communication port contracts for email, SMS, and push dispatch.
- Added fake communications adapter that queues synthetic messages locally.
- Added feature-flag port contracts.
- Added local feature-flag adapter with deterministic override/default evaluation behavior.
- Added safety guards to reject secret-like communication template data and invalid feature-flag keys.
- Added focused synthetic unit tests for fake dispatch and flag evaluation behavior.

## Files

- packages/platform-adapters/src/communications/communications-port.ts
- packages/platform-adapters/src/communications/fake-communications.adapter.ts
- packages/platform-adapters/src/feature-flags/feature-flag-port.ts
- packages/platform-adapters/src/feature-flags/local-feature-flag.adapter.ts
- packages/platform-adapters/src/index.ts
- packages/platform-adapters/README.md
- tests/unit/communications-and-feature-flag-adapters.spec.ts

## Validation

```bash
pnpm --filter @nelyohealth/platform-adapters typecheck
pnpm vitest run tests/unit/communications-and-feature-flag-adapters.spec.ts
```

Expected evidence:

- fake email/SMS/push dispatch produces accepted local receipts;
- no live vendor calls are present;
- feature flags evaluate with deterministic override/default behavior;
- unsafe secret-like content is rejected by adapter safety guards.

## Rollback

- Revert ISS-010 adapter and test files.
- Disable communication and feature-flag shell usage in runtime wiring.
- Keep vendor integrations unconfigured.
