# P02-ISS-001 Phase 2 ADR and Dependency Decision Pack Execution Plan

## Objective

Execute `P02-ISS-001 - Phase 2 ADR and dependency decision pack` exactly as defined in `docs/engineering/phase-2-issue-backlog.md`.

Record Phase 2 architecture decisions and exact dependency pins for app frameworks, database access and migrations, Redis-compatible queue/cache, object storage signed URLs, IaC/cloud path, observability/error reporting, and related adapter boundaries.

## Existing context

- Phase 0: PHASE-0-CONDITIONAL-PASS.
- Phase 1: PHASE-1-CONDITIONAL-PASS.
- P02-PLAN-001: ACCEPTED by the execution prompt for this issue.
- P02-ISS-001 may begin.
- P02-ISS-002 remains NOT STARTED.
- Phase 3 remains NOT STARTED.
- Pilot launch remains PILOT-NO-GO.
- Manual Git and GitHub writes remain human-only.

The repository contains Phase 1 foundation tooling, browser validation, design/content foundations, repository governance checks, and Phase 2 planning docs. It does not contain product apps, database schemas, migrations, infrastructure implementation, deployment workflows, or production features.

## Scope

- Create ADRs required by `docs/engineering/phase-2-technology-evaluation.md`.
- Record exact future dependency pins without installing them.
- Record primary-source evidence, package metadata evidence, licence posture, runtime compatibility, Windows/CI compatibility, lifecycle-script review notes, and security/privacy implications.
- Update ADR index and governance registers.
- Update Phase 2 traceability so vendor-specific adapter boundary work is credited to this issue.
- Preserve all existing locked requirements.

## Non-goals

- No `apps/` directory.
- No package installation or package.json dependency addition.
- No lockfile mutation except if validation tooling changes it unexpectedly.
- No database schema, migration, seed, reset, or database container.
- No Docker Compose, Terraform/OpenTofu/Pulumi implementation, or cloud configuration.
- No API, worker, web, mobile, auth, payment, clinical, pharmacy, lab, provider matching, or pilot capability.
- No production deployment, production data, production secrets, package publication, tag, release, PR, commit, or push.

## Source documents

- `AGENTS.md`
- `docs/AGENTS.md`
- `.agent/PLANS.md`
- `docs/exec-plans/P02-platform-and-infrastructure-foundation.md`
- `docs/engineering/phase-2-issue-backlog.md`
- `docs/governance/phase-2-requirements-traceability.md`
- `docs/engineering/phase-2-technology-evaluation.md`
- `docs/engineering/phase-2-application-topology.md`
- `docs/engineering/phase-2-environment-strategy.md`
- `docs/engineering/phase-2-local-infrastructure-plan.md`
- `docs/engineering/phase-2-browser-harness-plan.md`
- `docs/STATUS.md`
- `docs/governance/phase-2-readiness-handoff.md`
- `docs/governance/phase-1-completion-report.md`
- `docs/governance/decision-register.md`
- `docs/governance/open-questions.md`
- `docs/governance/assumptions-register.md`
- `docs/governance/risk-register.md`
- `docs/governance/dependency-register.md`
- `docs/governance/unresolved-blocker-register.md`
- `docs/governance/document-register.md`
- `docs/governance/change-log.md`
- `docs/adr/ADR-index.md`
- `docs/adr/ADR-0003-codex-browser-validation.md`
- `docs/adr/ADR-0005-modular-monolith-first.md`
- `docs/adr/ADR-0010-no-production-phi-in-product-analytics-or-session-replay.md`
- `docs/architecture/domain-boundaries.md`
- `docs/architecture/context-map.md`
- `docs/architecture/source-of-truth-matrix.md`
- `docs/architecture/event-catalogue-draft.md`
- `README.md`
- `CONTRIBUTING.md`
- `GOVERNANCE.md`
- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `tsconfig.base.json`
- `eslint.config.mjs`
- `.github/workflows/ci.yml`
- `playwright.config.ts`

## Locked rules

- Preserve one longitudinal Patient identity and distinct Person, UserAccount, and Patient concepts.
- Payer status does not grant clinical access.
- Emergency care is not blocked by payment.
- Finalized clinical records use amendments or versions.
- Provider details remain protected before payment; `providerDisplayName` is the only pre-payment provider identity field.
- Protected provider data is removed server-side before serialization.
- Post-payment disclosure is exact-order and authorization scoped.
- `OrderFundingSecured` does not expose provider details by itself.
- Clinical decisions remain with qualified clinicians.
- No production PHI in product analytics or session replay.
- No routine production database editing.
- Vendor SDK types remain behind adapters.
- Browser validation remains interactive plus deterministic, synthetic-only.
- Git and GitHub writes remain human-only.

## Files affected

Created:

- `docs/exec-plans/P02-ISS-001-phase-2-adr-and-dependency-decision-pack.md`
- `docs/engineering/phase-2-dependency-decision-pack.md`
- `docs/governance/p02-iss-001-adr-review-checklist.md`
- `docs/adr/ADR-P02-001-application-framework-and-dependency-pins.md`
- `docs/adr/ADR-P02-002-database-access-and-migration-tool.md`
- `docs/adr/ADR-P02-003-redis-compatible-cache-queue-and-worker-backplane.md`
- `docs/adr/ADR-P02-004-object-storage-signed-url-adapter.md`
- `docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md`
- `docs/adr/ADR-P02-006-observability-and-error-reporting-boundary.md`

Updated:

- `docs/STATUS.md`
- `docs/adr/ADR-index.md`
- `docs/governance/document-register.md`
- `docs/governance/decision-register.md`
- `docs/governance/change-log.md`
- `docs/governance/dependency-register.md`
- `docs/governance/open-questions.md`
- `docs/governance/unresolved-blocker-register.md`
- `docs/governance/risk-register.md`
- `docs/governance/phase-2-requirements-traceability.md`

## Dependency changes

No dependencies are installed or changed by P02-ISS-001.

The issue records future exact pins only. Later implementation issues must recheck package metadata before installing and must use exact versions.

## Architecture impact

- Confirms NestJS 11 for the API skeleton.
- Confirms Next.js 16 for the four web shells.
- Confirms Expo SDK 56 with React Native 0.85.3 for the empty mobile shell.
- Confirms Drizzle ORM and node-postgres for database access and SQL migration ownership.
- Confirms Valkey-compatible Redis protocol service with BullMQ/ioredis for local queue/cache foundation, while Redis OSS 8 remains legal/commercial review-required.
- Confirms S3-compatible object storage port with AWS SDK v3 presigning behind adapters; local emulator remains legal/commercial review-bound.
- Confirms OpenTofu as the preferred IaC path after human provider approval, with cloud provider still human-decision gated.
- Confirms OpenTelemetry and Pino for logs/traces/metrics boundary, with no error-reporting vendor selected.

## Data-model impact

None. No schema, migration, seed, fixture, reset command, domain table, or database artifact is created.

## API impact

None. No API route, DTO, controller, OpenAPI artifact, typed client, or application code is created.

## UI impact

None. No browser surface, route, app shell, component, visual baseline, or content surface is created.

## Privacy and security

- Vendor SDKs are restricted to adapter packages or app infrastructure wiring.
- Telemetry, logs, traces, metrics, browser artifacts, and error-reporting boundaries must exclude PHI, payment credentials, auth secrets, and protected provider details.
- Local/test/development/staging data remains synthetic only.
- Redis, object-storage, cloud/IaC, observability backend, and error-reporting vendors remain review-bound where legal/commercial/privacy decisions are unresolved.

## Browser scenarios

No browser surface changes in this issue. Deterministic and interactive browser validation are not applicable for P02-ISS-001.

P02-ISS-014 remains responsible for browser harness expansion.

## Tests

Issue-specific evidence:

- Runtime version checks.
- `npm view` package metadata checks without install.
- Official documentation/source review.
- ADR checklist.
- Repository validation.
- Diff/status review.

No unit, integration, contract, browser, accessibility, or visual tests are created because this issue creates docs and ADRs only.

## Milestones

1. Read repository, governance, architecture, and Phase 2 planning context.
2. Verify current package and tooling metadata without installation.
3. Create P02-ISS-001 execution plan.
4. Create ADRs and dependency decision pack.
5. Update ADR index and governance registers.
6. Run validation and review diff/status.
7. Report completion or blockers.

## Validation commands

Required commands for this issue:

```bash
git status --short
node -v
npm -v
npm exec --yes pnpm@11.9.0 -- -v
npm view <selected-package> version license engines scripts repository.url homepage time.modified --json
npm exec --yes pnpm@11.9.0 -- install
npm exec --yes pnpm@11.9.0 -- install --frozen-lockfile
npm exec --yes pnpm@11.9.0 -- format:check
npm exec --yes pnpm@11.9.0 -- lint
npm exec --yes pnpm@11.9.0 -- typecheck
npm exec --yes pnpm@11.9.0 -- test
npm exec --yes pnpm@11.9.0 -- test:integration
npm exec --yes pnpm@11.9.0 -- repository:verify
npm exec --yes pnpm@11.9.0 -- build
npm exec --yes pnpm@11.9.0 -- verify
npm exec --yes pnpm@11.9.0 -- secret:scan
npm exec --yes pnpm@11.9.0 -- deps:policy
npm exec --yes pnpm@11.9.0 -- deps:licenses
npm exec --yes pnpm@11.9.0 -- actions:verify
git diff --check
git status --short
git diff --stat
```

Browser, accessibility, visual, and design verification commands are not issue-specific because no browser/UI surface changes are made; `repository:verify` still runs the repository's current browser, accessibility, visual, and build gates.

## Rollback

Rollback is documentation-only:

- Remove P02-ISS-001 ADRs, dependency decision pack, ADR checklist, and execution plan.
- Revert related governance register rows and P02-REQ-023 traceability update.
- No runtime rollback, database rollback, container cleanup, object deletion, or deployment rollback is required because no runtime implementation exists.

## Risks

- Package versions may change before later implementation issues install them.
- Framework peer dependencies may require narrow later package additions.
- Local object-storage emulator licensing remains unresolved.
- Redis/Valkey/managed service choice may need production re-review.
- Broad observability instrumentation can leak sensitive data if not configured with redaction and allow-lists.
- Local host Node may differ from repository-pinned Node 24.18.0 during validation.

## Decisions

Decisions are recorded in:

- `docs/adr/ADR-P02-001-application-framework-and-dependency-pins.md`
- `docs/adr/ADR-P02-002-database-access-and-migration-tool.md`
- `docs/adr/ADR-P02-003-redis-compatible-cache-queue-and-worker-backplane.md`
- `docs/adr/ADR-P02-004-object-storage-signed-url-adapter.md`
- `docs/adr/ADR-P02-005-iac-cloud-provider-and-deployment-path.md`
- `docs/adr/ADR-P02-006-observability-and-error-reporting-boundary.md`
- `docs/engineering/phase-2-dependency-decision-pack.md`
- `docs/governance/decision-register.md`

## Completion evidence

- P02-ISS-001 ADRs created.
- Dependency decision pack created.
- ADR review checklist created.
- ADR index and governance registers updated.
- No dependencies installed.
- No apps, schema, migrations, Docker, IaC, CI deployment, or product code created.
- `npm exec --yes pnpm@11.9.0 -- install` passed and reported the workspace already up to date.
- `npm exec --yes pnpm@11.9.0 -- install --frozen-lockfile` passed and reported the workspace already up to date.
- `npm exec --yes pnpm@11.9.0 -- format:check`, `lint`, `typecheck`, `test`, `test:integration`, `build`, `secret:scan`, `deps:policy`, `deps:licenses`, and `actions:verify` passed.
- `npm exec --yes pnpm@11.9.0 -- repository:verify` passed.
- `npm exec --yes pnpm@11.9.0 -- verify` passed.
- `git diff --check` passed with only Git line-ending warnings.
- Local validation host reported Node v25.8.1 while the repository pin remains Node 24.18.0; this is recorded as a validation warning, not a dependency change.
