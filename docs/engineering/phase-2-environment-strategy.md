# Phase 2 Environment Strategy

## Purpose

Define how Phase 2 handles local, ephemeral PR, development, staging, production, and partner sandbox boundaries before any environment is provisioned.

## Environment matrix

| Environment | Phase 2 status | Data policy | Owner | Automation boundary |
|---|---|---|---|---|
| Local | Implement in Phase 2 | Synthetic data only | Engineering/QA | Local commands may start services and reset data |
| Ephemeral PR | Plan and implement only after CI/deployment ADR | Synthetic generated data only | Engineering/QA | Must be created from reviewed PR workflow; no production data |
| Development | Implement Phase 2 deploy target after human merge to main | Synthetic or approved non-production fixtures only | Platform owner | Automatic deployment after human merge only |
| Staging | Implement promotable target | Synthetic or approved staging fixtures only | Platform/release owner | Promotion from versioned artifact; no production copy |
| Production | Planning boundary only in Phase 2 | No production data use in Phase 2 | Operations/security | No provisioning or deploy by Codex |
| Partner sandbox | Planning boundary only unless explicitly authorized later | Synthetic partner-like data only | Partner/operations owner | No live partner integration in Phase 2 |

## Data movement rules

- Production data must never be copied downward.
- Synthetic builders are the default for local, PR, development, staging, and partner sandbox testing.
- Any imported fixture must be reviewed as synthetic and non-sensitive before use.
- Browser artifacts, logs, traces, metrics, and screenshots are treated as sensitive until scanned.
- Auth storage states are synthetic test artifacts and must stay ignored.

## Promotion model

1. A human opens, reviews, and merges the PR to main.
2. The merge to main may trigger development deployment once P02-ISS-017 implements the workflow.
3. A staging promotion uses a versioned build artifact or immutable image reference.
4. Staging promotion requires migration plan, rollback plan, dependency readiness, and smoke/browser evidence.
5. Production promotion remains out of Phase 2 implementation scope.

## Secrets model

- No real secrets in Git, documentation examples, browser artifacts, or tests.
- Local examples use placeholder names only.
- Development/staging secrets are created manually by authorized humans or through approved secret-manager IaC after P02-ISS-016.
- Codex must not create, rotate, retrieve, or paste live secrets.
- Secret references must be environment scoped and typed through `packages/config` after P02-ISS-015.

## Configuration model

- Every app must fail fast on missing required configuration.
- Readiness checks must identify missing dependencies without printing secret values.
- Feature flags default to local/in-memory provider until an approved provider exists.
- Provider endpoints must be environment-specific and adapter-owned.

## Rollback model

| Area | Required Phase 2 rollback behavior |
|---|---|
| App deployment | Revert to previous known-good artifact for development/staging |
| Migration | Forward-safe migration where possible; documented down/compensating action when not |
| Queue | Pause workers, drain safe jobs, inspect DLQ, requeue only synthetic jobs during Phase 2 |
| Object storage | Delete synthetic test object and revoke/expire signed URL |
| Feature flags | Disable nonessential skeleton pathways through local flag provider |
| Observability | Keep telemetry exporter failure non-fatal for app readiness unless explicitly marked required |

## Environment exit criteria

- Local: one command path starts API, worker, web shells, mobile shell preview where applicable, and dependencies with deterministic seed/reset.
- Development: human-merged main deploys without Codex GitHub writes.
- Staging: a version can be promoted and smoke-tested.
- Production and partner sandbox: boundaries documented but no live creation unless later prompt explicitly authorizes it.

