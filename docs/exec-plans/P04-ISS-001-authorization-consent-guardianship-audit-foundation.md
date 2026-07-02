# P04-ISS-001 Authorization, Consent, Guardianship, and Audit Foundation

## Objective

Execute the first Phase 4 issue as an evidence-first foundation for authorization and audit policy scaffolding, without claiming production-grade enforcement.

## Existing context

- Phase 0: PHASE-0-CONDITIONAL-PASS with locked invariants preserved.
- Phase 1: PHASE-1-CONDITIONAL-PASS.
- Phase 2: Completed with controlled workflow evidence.
- Phase 3: Step 1 through Step 6 completed with synthetic cross-viewport evidence.
- Phase 4 kickoff scope: started by `docs/exec-plans/P04-phase-4-kickoff-scope.md`.
- Pilot launch remains PILOT-NO-GO.
- Repository-changing Git and GitHub writes remain human-only.

## Scope

- Define provider-neutral policy input contracts for authorization decisions.
- Add deterministic policy decision scaffolds for allow, deny, challenge, and break-glass-reason-required outcomes.
- Add deterministic relationship and consent gating decision scaffolds.
- Add append-only audit intent scaffolds for sensitive decision events.
- Add route-level decision envelopes for policy evaluations where appropriate.
- Add deterministic tests for negative and revocation paths.
- Add browser failure-path evidence for revoked consent, revoked relationship, stale session, wrong-tenant, and manipulated identifier attempts.

## Non-goals

- No production RBAC/ABAC/ReBAC rollout across all endpoints.
- No production break-glass runtime activation.
- No production immutable audit-store implementation.
- No legal/clinical approval claims.
- No pilot scope activation changes.

## Source documents

- AGENTS.md
- docs/STATUS.md
- docs/governance/decision-register.md
- docs/governance/phase-3-requirements-traceability.md
- docs/exec-plans/P04-phase-4-kickoff-scope.md
- NelyoHealth_Build_Implementation_Map_for_Codex.md (Phase 4 section)
- docs/security/access-intent-matrix.md
- docs/privacy/consent-matrix.md
- docs/privacy/guardian-and-delegation-policy.md

## Locked rules

- Payer and sponsor access does not imply clinical access.
- Relationship and consent revocation must remove access immediately in policy outcomes.
- Break-glass is exceptional, reasoned, time-bound, and audited.
- No silent overwrite of finalized clinical records.
- Synthetic-only data and artifacts for all tests and browser validation.

## Files expected to be affected

Planned create/update targets:

- apps/api/src/authorization-policy.ts (new)
- apps/api/src/authorization-policy-handlers.ts (new)
- apps/api/src/authorization-policy.test.ts (new)
- apps/api/src/authorization-policy-handlers.test.ts (new)
- apps/api/src/runtime-routes.ts (update)
- apps/api/src/runtime-routes.test.ts (update)
- apps/api/src/index.ts (update)
- tests/e2e/phase4-authorization-revocation.spec.ts (new)
- tests/accessibility/phase4-authorization-revocation.a11y.spec.ts (new if UI route touched)
- docs/governance/phase-4-requirements-traceability.md (new)
- docs/STATUS.md (update)
- docs/governance/change-log.md (update)

Final file list may be reduced by implementation choices if acceptance criteria are still met.

## Dependency changes

No new dependency is authorized by default for P04-ISS-001.

If a dependency becomes necessary, exact version pinning plus governance review is required before adoption.

## Architecture impact

- Introduces a policy-contract layer for Phase 4 decisions.
- Preserves modular-monolith boundaries and provider-neutral adapter approach.
- Keeps enforcement scaffolds deterministic and test-first.

## Data-model impact

- No mandatory schema migration in this issue plan.
- Any provisional model contract must avoid implying final production persistence design.

## API impact

- Adds deterministic policy decision envelope surfaces for testable authorization and revocation behavior.
- Requires fail-closed responses for wrong-tenant and revoked contexts.

## UI and browser impact

- Browser validation must prove immediate access loss after consent/relationship revocation.
- Browser validation must include manipulated identifier and stale-session attempts.
- Desktop/tablet/mobile projects required where user-facing behavior is exercised.

## Privacy and security

- Access-denied responses must not leak protected metadata or record existence details.
- Audit-intent outputs must avoid PHI and secret material.
- Browser artifacts must remain synthetic and in ignored paths only.

## Acceptance criteria

1. Policy input and decision contracts exist with strict TypeScript typing.
2. Deterministic handler logic exists for:
- normal authorization decisions,
- consent-revoked denial,
- relationship-revoked denial,
- wrong-tenant denial,
- stale-session denial,
- break-glass-reason-required challenge.
3. Unit tests cover allow and fail-closed decision branches.
4. Runtime route-level envelope tests cover policy output tagging and reason codes.
5. Browser journey test validates immediate access loss after consent or relationship revocation.
6. Browser and accessibility validation evidence exists for supported viewport projects where applicable.
7. Governance documents are updated with evidence references and residual conditions.

## Validation commands

```bash
git status --short
git diff --check
node ./node_modules/@playwright/test/cli.js test --config playwright.step5.config.ts
```

Issue-specific test commands will be added once implementation files are created.

## Rollback

- Revert new policy scaffold files and related runtime route wiring.
- Revert test files and documentation updates.
- Preserve change-log evidence of attempted execution and reason for rollback.
- No production rollback actions apply because this issue is synthetic scaffold scope only.

## Risks

- Over-claiming production authorization readiness from scaffolds.
- Incomplete fail-closed coverage for edge contexts.
- Browser tests may pass while full endpoint enforcement remains deferred.
- Lockfile policy may block full repository-level verification in this environment.

## Decisions trail

- docs/governance/decision-register.md
- docs/governance/change-log.md
- docs/governance/phase-3-requirements-traceability.md
- docs/governance/phase-4-requirements-traceability.md (to be created during issue execution)

## Completion evidence

P04-ISS-001 closes only when acceptance criteria are met and traceability/status records are updated with exact command and artifact evidence.
