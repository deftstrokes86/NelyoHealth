# P02-ISS-018 Phase 2 Exit-Gate Rehearsal and Rollback Evidence Execution Plan

## Objective

Execute `P02-ISS-018 - Phase 2 exit-gate rehearsal and rollback evidence` exactly as defined in `docs/engineering/phase-2-issue-backlog.md`.

Rehearse each Phase 2 exit gate, capture deterministic evidence, and record rollback proof for application artifact and migration strategy in non-production scope.

## Existing context

- Phase 0: PHASE-0-CONDITIONAL-PASS.
- Phase 1: PHASE-1-CONDITIONAL-PASS.
- P02-PLAN-001: ACCEPTED.
- P02-ISS-001 through P02-ISS-016 are completed or accepted.
- P02-ISS-017 is partial with workflow and runbook artifacts recorded; controlled deployment and promotion run evidence remains pending.
- P02-ISS-018 is the current backlog issue.
- Pilot launch remains PILOT-NO-GO.
- Repository-changing Git and GitHub writes remain human-only; owner-requested workflow dispatch and rerun are allowed.

The repository already contains the local infrastructure harness, migration foundation, queue and DLQ behavior, signed URL adapter, observability correlation flow, and browser-harness matrix. This issue consolidates exit-gate rehearsal and rollback evidence across those foundations.

## Scope

- Define the complete rehearsal sequence for P02-EG-001 through P02-EG-009.
- Capture development deploy and staging promotion controlled evidence after human-gated workflow execution.
- Capture migration safety and rollback or compensating-action evidence.
- Capture queue and DLQ behavior evidence under deterministic synthetic test conditions.
- Capture signed URL upload/download/expiry evidence.
- Capture observability request-to-worker correlation evidence.
- Capture browser harness and local route-inspection evidence, including privacy and accessibility checks.
- Record governance and status updates required to close Phase 2 exit gates.

## Non-goals

- No production deployment.
- No production data access, copy, or mutation.
- No live partner/provider operations.
- No new cloud provider or IaC selection work.
- No expansion of clinical, payment, emergency, pharmacy, or laboratory runtime scope.
- No Codex repository mutation or GitHub settings mutation.

## Source documents

- `AGENTS.md`
- `docs/AGENTS.md`
- `docs/engineering/phase-2-issue-backlog.md`
- `docs/STATUS.md`
- `docs/governance/phase-2-requirements-traceability.md`
- `docs/engineering/phase-2-environment-strategy.md`
- `docs/engineering/environment-and-deployment-baseline.md`
- `docs/runbooks/development-deploy-and-staging-promotion.md`
- `docs/governance/decision-register.md`
- `docs/governance/change-log.md`

## Locked rules

- Production data must never be copied downward.
- Exit-gate rehearsal uses synthetic data and non-production environments only.
- Human merge authority and human GitHub operation boundaries remain in force.
- Protected provider details remain server-filtered under locked disclosure rules.
- No production deploy or cloud mutation by Codex.

## Files affected

Created:

- `docs/exec-plans/P02-ISS-018-phase-2-exit-gate-rehearsal-and-rollback-evidence.md`

Updated:

- `docs/STATUS.md`
- `docs/governance/phase-2-requirements-traceability.md`
- `docs/governance/decision-register.md`
- `docs/governance/change-log.md`

## Dependency changes

No dependencies are installed or changed by P02-ISS-018 planning.

The issue reuses existing approved tooling and workflows to gather exit-gate evidence.

## Architecture impact

- Converts existing Phase 2 foundation artifacts into a gate-closure evidence sequence.
- Preserves provider-neutral adapter boundaries while proving deploy and promotion flow behavior.
- Adds explicit rollback-proof expectations before Phase 2 completion claims.

## Data-model impact

None for this execution-plan step. Evidence capture may exercise existing migration paths but does not require new schema design.

## API impact

None for this execution-plan step. Existing API and worker surfaces are exercised for evidence only.

## UI impact

None for this execution-plan step. Existing web and mobile shells are validated through browser harness and route-inspection evidence.

## Privacy and security

- Evidence artifacts must be synthetic-only.
- Logs, traces, reports, screenshots, videos, and summaries must not contain PHI, secrets, or protected provider details.
- Exit-gate evidence must preserve least-privilege and no-direct-database-editing rules.

## Browser scenarios

Rehearsal must include deterministic and interactive validation for implemented user-facing surfaces:

- Per-app Playwright project execution and artifact retention checks.
- Local route inspection and console/network failure reporting.
- Accessibility smoke checks and reduced-motion-safe validation.

## Tests

Issue-specific evidence targets:

- Full verification suite execution.
- Browser harness matrix execution.
- Development deployment and staging promotion workflow evidence.
- Migration safety and rollback evidence.
- Queue retry and DLQ evidence.
- Signed URL upload/download/expiry evidence.
- Observability request-to-worker correlation evidence.

## Milestones

1. Confirm readiness and pending evidence from P02-ISS-017.
2. Run and record controlled development deploy evidence.
3. Run and record controlled staging promotion evidence.
4. Rehearse migration safety and rollback/compensation evidence.
5. Rehearse queue/DLQ, signed URL, and observability gate evidence.
6. Run browser harness and local route-inspection evidence capture.
7. Update traceability, status, and governance records for gate outcomes.

## Validation commands

Required commands for planning and documentation updates:

```bash
git status --short
git diff --check
```

Implementation-stage validation commands are defined by existing runbooks and package scripts and will be recorded with run evidence.

## Rollback

Documentation rollback:

- Revert this execution-plan file and related governance/status updates if the issue is rejected.

Operational rehearsal rollback (non-production only):

- Redeploy previous development/staging candidate artifact when needed.
- Apply documented migration rollback or compensating action.
- Preserve synthetic evidence and incident notes for governance review.

## Risks

- P02-ISS-017 controlled run evidence remains pending and can block full ISS-018 closure.
- Exit-gate evidence may reveal missing automation or runbook steps that require targeted remediations.
- Overstating gate completion without run artifacts would violate governance rules.

## Decisions

Decisions are recorded in:

- `docs/governance/decision-register.md`
- `docs/governance/phase-2-requirements-traceability.md`
- `docs/governance/change-log.md`

## Completion evidence

- P02-ISS-018 execution plan recorded.
- Exit-gate rehearsal and rollback evidence sequence defined.
- Governance/status records updated to make ISS-018 the active implementation step.
