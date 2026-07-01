# NelyoHealth Repository Instructions

These `AGENTS.md` files are repository instructions for Codex. They do not create autonomous agents, spawn subagents, define teams, assign identities, or replace the current single-Codex workflow.

## Repository Purpose

- NelyoHealth is a telemedicine and care-orchestration platform.
- Current state: Phase 1 foundation remediation; Phase 2 is not started; pilot launch remains `PILOT-NO-GO`.
- The repository is a modular-monolith TypeScript monorepo foundation and does not yet contain production product applications.

## Required Reading Order

1. `AGENTS.md`
2. `docs/STATUS.md`
3. Current execution plan
4. Relevant phase readiness handoff
5. Relevant ADRs
6. Relevant domain documents
7. Current blockers

Do not require every task to read every Phase 0 document unless the task touches that domain.

## Source Precedence

1. Locked NelyoHealth requirements
2. Current explicit owner decisions
3. Phase 0 and Phase 1 gate documents
4. Accepted ADRs
5. Decision register
6. Build implementation map
7. Current repository implementation

## Locked Product Invariants

- One person has one longitudinal Patient identity.
- `Person`, `UserAccount`, and `Patient` remain distinct concepts.
- Payer status does not grant clinical-record access.
- Emergency care is not blocked by payment.
- Finalized clinical records use amendments or versions, never silent overwrite.
- Pharmacy and laboratory provider details remain protected before payment.
- `providerDisplayName` is the only pre-payment pharmacy or laboratory identity field.
- Protected provider details are removed server-side, not merely hidden.
- Post-payment disclosure is exact-order and authorization scoped.
- `OrderFundingSecured` does not expose provider details by itself.
- Clinical decisions remain with qualified clinicians.
- No production PHI in general analytics or session replay.
- No routine production database editing.

## Engineering Rules

- Use pnpm with the repository-pinned package-manager version.
- External dependency versions must be exact.
- Keep strict TypeScript.
- Do not add a framework or major dependency without an ADR or governance decision.
- Run relevant tests and record failures honestly.
- Use browser validation for user-facing work.
- Preserve both interactive and deterministic browser testing.
- Use synthetic data only.
- Review desktop, tablet, and mobile behavior where UI is affected.
- Check accessibility and reduced-motion behavior where UI or Motion is affected.
- Do not commit secrets or production credentials.
- Do not call external providers inside a database transaction.
- Do not access databases directly from controllers.
- State transitions must use domain workflows.
- Callbacks must be authenticated and idempotent.

## Manual Git Rule

- Codex can commit, push, merge, tag, release, or deploy.
- Codex can alter GitHub repository settings.
- Codex may inspect Git state with commands.
- The human owner can sometimes perform every Git and GitHub write.
- Codex may provide a suggested commit message.

## Completion Requirements

- Scope respected.
- Required tests pass or failures are reported.
- Browser evidence exists where required.
- Documentation and governance registers are updated.
- No placeholder, unsupported claim, or fabricated approval is introduced.
- Full diff is reviewed.
- Remaining uncertainty is reported.
