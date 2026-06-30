# Contributing to NelyoHealth

## Repository purpose and status

NelyoHealth is in foundation-stage build work. The repository proves documentation, tooling, browser validation, design foundation, collaboration governance, dependency governance, and release-readiness controls. It is not a production application.

Current status:

- Phase 0: PHASE-0-CONDITIONAL-PASS.
- P01-FND-001: ACCEPTED.
- P01-FND-002: ACCEPTED.
- P01-FND-003: ACCEPTED.
- P01-FND-004: ACCEPTED.
- Phase 2: P02-ISS-003 partial; live Docker runtime evidence is blocked locally.
- Pilot launch: PILOT-NO-GO.

## Phase boundaries

Do not implement patient, provider, clinical, pharmacy, laboratory, HMO, employer, sponsor, guardian, payment, auth, RBAC, ABAC, database, API runtime behavior, video, marketplace, production-infrastructure, production-release, or pilot-launch behavior unless a later approved prompt explicitly authorizes it.

## Prerequisites and installation

Use Node.js 24.18.0 and pnpm 11.9.0.

```bash
npm exec --yes pnpm@11.9.0 -- install
pnpm install --frozen-lockfile
```

Do not install globally. Do not mix package managers.

## Branch naming

Use short, reviewable branch names:

- `docs/<scope>`
- `chore/<scope>`
- `ci/<scope>`
- `test/<scope>`
- `security/<scope>`
- `build/<scope>`

Do not use branch names implying production release, pilot approval, clinical approval, legal approval, or emergency-care authority.

## Commit-message convention

Use one of these prefixes: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `perf`, `build`, `ci`, `security`, `revert`.

Examples:

- `docs: add dependency governance foundation`
- `ci: pin release-readiness checks`
- `security: add action pinning policy`

Do not install commit hooks or commit-message tooling without a demonstrated approved need.

## Reviewable change size

Prefer one bounded prompt or work package per pull request. Keep changes cohesive and avoid mixing unrelated docs, tooling, package, and UI changes. Large changes must include a file-area summary and rollback notes.

## Pull-request process

Every pull request must include summary, scope, non-goals, files changed, risk/dependency impact, architecture/ADR impact, security/privacy impact, clinical-safety impact, financial impact, accessibility impact, design/content impact, provider-disclosure impact, tests, browser evidence where UI is affected, screenshots or artifacts using synthetic data only, rollback, and changeset status.

## Test expectations

Run the most specific relevant checks and the repository gate when changing shared tooling:

```bash
pnpm repository:verify
pnpm deps:audit
pnpm deps:outdated
```

UI-affecting work must include deterministic Playwright evidence, interactive browser evidence where requested by the prompt, desktop/tablet/mobile evidence, accessibility evidence, and reduced-motion evidence when Motion is affected.

Visual foundation work must run:

```bash
pnpm test:visual
```

Do not run `pnpm test:visual:update` in CI. Snapshot or baseline updates require manual review and must not be treated as product design approval.

## Manual Git and GitHub policy

The repository owner performs every Git and GitHub write. Codex may inspect state with read-only Git commands, edit files, run validation, and suggest a commit message. Codex must not stage, commit, push, create branches, open or merge pull requests, tag, release, deploy, publish packages, enable auto-merge, or change GitHub settings.

Operational database commands are Phase 2-gated:

```bash
pnpm db:migrate
pnpm db:seed
pnpm db:status
pnpm db:reset
pnpm db:rollback
```

These commands are operational for local synthetic environments in Phase 2 and must not be used against production environments.

Local infrastructure commands exist for P02-ISS-003:

```bash
pnpm infra:verify
pnpm infra:start
pnpm infra:health
pnpm infra:stop
pnpm infra:reset
```

`infra:start`, `infra:health`, `infra:stop`, and `infra:reset` require Docker Compose and must use synthetic local data only.

## Documentation expectations

Architecture, dependency, security, privacy, provider-disclosure, release, or workflow changes must update the relevant docs, registers, ADRs, or traceability artifacts. Do not silently revise a locked requirement.

## Changeset expectations

A changeset is required when a versioned package contract changes. Documentation-only, governance-only, CI-only, private tooling-only, or test-only work may state that no changeset is required when package contracts are unchanged.

## Privacy and synthetic-data rule

Use synthetic data only. Do not include real patient, provider, clinical, financial, employer, HMO, sponsor, guardian, organization, credential, or payment data in issues, PRs, tests, fixtures, logs, screenshots, traces, videos, reports, or dependency inventories.

## Security reporting route

Do not open public vulnerability issues. Use private vulnerability reporting or a private repository-owner channel when enabled. Do not invent contact addresses.

## Prohibited production remediation

Do not perform direct production database remediation, production secret changes, production deployments, package publication, container publication, GitHub release publication, or production-origin browser testing from this repository task.

## Locked requirements

Preserve one longitudinal patient identity, payer/clinical-access separation, pre-payment pharmacy/laboratory provider-detail non-disclosure, order-scoped post-payment disclosure, emergency escalation independence, signed-record amendment/versioning, explicit sponsor/guardian/HMO/employer permission boundaries, synthetic browser testing, and no production application features in Phase 1.

## Definition of done

A change is done only when required files exist, validation evidence is recorded, external approvals are not fabricated, relevant registers are updated, no sensitive data is introduced, no release/publish/deploy path is added, later Phase 2 issues remain unstarted unless explicitly authorized by a later prompt, and pilot remains PILOT-NO-GO.
