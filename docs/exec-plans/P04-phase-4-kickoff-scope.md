# P04 Phase 4 Kickoff Scope

## Objective

Start Phase 4 with a tightly bounded, evidence-first authorization and audit foundation scope that preserves locked product invariants and payer-clinical separation.

## Phase title

Phase 4: Authorization, consent, guardianship, and audit.

## Kickoff scope statement

Phase 4 starts with policy-contract and enforcement scaffold work only. The first increment defines authorization policy inputs and deterministic decision contracts, plus append-only audit intent scaffolds and browser failure-path evidence for revoked consent, revoked relationship, stale session, and wrong-tenant attempts.

The kickoff remains web-first while preserving mobile-forward compatibility through shared package boundaries and contract-driven interfaces.

## In-scope for kickoff

- Define Phase 4 first execution issue (`P04-ISS-001`) with evidence-first acceptance criteria.
- Preserve separation of `Person`, `UserAccount`, `Patient`, relationship, consent, and payer context.
- Add policy-evaluation contracts that include actor, role, tenant, patient, relationship, purpose, consent, encounter, and emergency context inputs.
- Add deterministic decision scaffolds for allow, deny, challenge, and break-glass-reason-required states.
- Add append-only audit intent scaffolds for sensitive authorization decisions.
- Add browser test expectations for immediate access loss after consent or relationship revocation.
- Keep synthetic-only test and artifact policy.

## Explicit out-of-scope for kickoff

- No production cryptography, token broker, or external IAM rollout.
- No production break-glass workflow activation.
- No production database migration that introduces final authorization schema.
- No production legal/clinical approval claims.
- No pilot activation change (pilot remains no-go).

## Deferred items (Phase 4 later increments)

- Full relationship-policy matrix coverage for every actor and care context.
- Full consent lifecycle UI/UX implementation across all shells.
- Break-glass notification and post-event review workflow runtime integration.
- Comprehensive endpoint-level enforcement for all API surfaces.
- Production-grade immutable audit storage and retention controls.

## Evidence-first acceptance for kickoff

Kickoff is complete when all of the following are true:

1. `P04-ISS-001` execution issue plan exists in `docs/exec-plans/`.
2. Acceptance criteria include deterministic unit/integration and browser evidence.
3. Non-goals and rollback strategy are explicitly documented.
4. Source documents and locked rules are enumerated.
5. STATUS and change-log are updated to point to `P04-ISS-001` as the next execution step.

## Locked rules carried forward

- One person has one longitudinal patient identity.
- Payer role never implies clinical-record access.
- Provider disclosure protections and order-scoped authorization remain unchanged.
- Emergency escalation remains independent of payment and routine booking flow.
- Finalized clinical records are amended/versioned, never silently overwritten.
- Synthetic-only test data and artifact safety remain mandatory.

## Initial validation commands

```bash
git status --short
git diff --check
node ./node_modules/@playwright/test/cli.js test --config playwright.step5.config.ts
```

## Next action

Execute `P04-ISS-001` with policy-contract scaffolds, audit-intent scaffolds, and fail-closed browser evidence.
