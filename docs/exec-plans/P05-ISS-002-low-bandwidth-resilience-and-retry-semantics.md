# P05-ISS-002 Low-Bandwidth Resilience and Retry Semantics

## Objective

Execute the second Phase 5 increment by adding deterministic workflow-level low-bandwidth resilience, offline queue behavior, and retry semantics for patient workflow execution.

## Scope

- Add a deterministic resilience state machine for workflow execution states:
  - idle
  - loading
  - retry-pending
  - offline-queued
  - succeeded
  - failed
- Add deterministic retry/backoff behavior with bounded attempts and explicit terminal failure.
- Add connection-restore semantics that safely resume queued workflow actions.
- Add deeper integration tests that validate state transitions through degraded and offline conditions.
- Preserve privacy and fail-closed constraints while workflow execution is pending or failed.

## Non-goals

- No production service-worker or offline storage rollout.
- No final browser UX implementation for all low-bandwidth interaction patterns.
- No pilot activation or production-readiness claims.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/phase-5-requirements-traceability.md
- docs/exec-plans/P05-ISS-001-design-system-and-shell-foundation.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 5 section)

## Files implemented in this increment

- apps/patient-web/src/workflow-resilience.ts
- apps/patient-web/src/workflow-resilience.test.ts
- tests/integration/patient-workflow-resilience-runtime.spec.ts
- apps/patient-web/src/index.ts

## Acceptance criteria

1. Workflow resilience state machine exists with strict typing and deterministic transitions.
2. Retry semantics are bounded and produce deterministic next-retry timing.
3. Offline workflow submission queues safely and resumes on connection restore.
4. Integration coverage proves transition chains through degraded/offline/recovery and terminal-failure paths.
5. Governance traceability is updated with evidence and residual scope notes.

## Validation commands

```bash
node node_modules/vitest/vitest.mjs run apps/patient-web/src/workflow-resilience.test.ts tests/integration/patient-workflow-resilience-runtime.spec.ts
```

## Risks

- Over-claiming full low-bandwidth readiness from state-machine scaffolds alone.
- Browser-level low-bandwidth UX parity remains a later increment.

## Completion evidence

This increment is evidence-complete when targeted unit/integration tests pass and phase-level governance documents are updated.
