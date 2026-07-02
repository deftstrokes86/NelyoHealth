# P03 Phase 3 Kickoff Checklist

## Purpose

Provide a single, execution-ready checklist to begin Phase 3 immediately after Phase 2 control closure.

## Scope guardrails

- Keep web as the first-class delivery target for initial Phase 3 increments.
- Preserve a clean path for mobile reuse of shared foundations (domain, config, api-client, observability, testing factories).
- Keep locked product invariants and disclosure/privacy controls unchanged.
- Continue synthetic-only validation and no production PHI in analytics/session replay.

## Kickoff checklist

1. Confirm Phase 2 closure evidence package is complete.
- Verify development and staging workflow evidence links remain valid.
- Verify branch protection and required-check configuration remain active on `main`.
- Verify dependency/security controls remain enabled.

2. Lock Phase 3 kickoff scope statement.
- Write a one-page Phase 3 kickoff scope note in the active execution issue.
- Explicitly list in-scope, out-of-scope, and deferred items.
- Include a web-first delivery order and mobile-forward compatibility constraints.

3. Define first Phase 3 execution issue.
- Create `P03-ISS-001` as the first implementation issue.
- Include objective, acceptance criteria, non-goals, dependencies, rollback plan, and evidence plan.
- Link required docs and locked requirements that must remain unchanged.

4. Baseline repository health before Phase 3 coding.
- Run:

```bash
pnpm repository:verify
pnpm actions:verify
pnpm deps:verify
pnpm release:check
```

- Record pass/fail with timestamp in the issue body.

5. Reconfirm architecture and dependency boundaries.
- Keep modular-monolith package boundaries enforced.
- Keep vendor-specific logic inside platform adapters.
- Do not add major frameworks or dependencies without ADR/governance approval.

6. Prepare Phase 3 planning artifacts.
- Create Phase 3 execution plan file when `P03-ISS-001` is opened.
- Add/update governance traceability rows for new Phase 3 items.
- Add change-log entry for kickoff start and first issue opening.

7. Prepare test evidence expectations up front.
- Define required test layers for the first issue (unit, integration, browser/a11y where applicable).
- Ensure synthetic test data and privacy checks are included.
- Define evidence artifacts that must be captured before closure.

8. Open implementation runway.
- Confirm first task owner and reviewer path.
- Confirm branch naming convention and PR template usage.
- Confirm required status check gating on pull requests.

## Exit criteria for kickoff complete

- `P03-ISS-001` exists with approved scope and acceptance criteria.
- Phase 3 execution plan is created and linked.
- Governance status and change log reflect kickoff start.
- Baseline verification commands are executed and recorded.
- Team can start implementation without unresolved control blockers.
