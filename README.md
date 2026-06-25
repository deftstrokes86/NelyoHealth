# NelyoHealth

NelyoHealth is in Phase 2 foundation work. The repository contains a reproducible TypeScript monorepo baseline, synthetic local browser smoke surfaces, deterministic Playwright browser checks, design-token/content/UI foundation packages, governed UI UX Pro Max advisory tooling, repository governance checks, and boundary-only Phase 2 app/package workspaces.

The Phase 2 app and package directories are scaffolds only. They implement no patient, provider, clinical, pharmacy, laboratory, payment, HMO, employer, family, guardian, sponsor, authentication, RBAC, ABAC, database, API, production infrastructure, production release, or pilot-launch feature.

## Status

- Phase 0 gate: PHASE-0-CONDITIONAL-PASS
- Phase 1 gate: PHASE-1-CONDITIONAL-PASS
- Phase 2 entry: PHASE-2-GO-WITH-CONDITIONS
- P02-ISS-001: ACCEPTED
- P02-ISS-002: completed pending orchestration acceptance
- Pilot launch: PILOT-NO-GO
- Production release: NOT APPROVED
- Current bounded task completed: P02-ISS-002, pending orchestration acceptance

## Prerequisites

Use Node.js 24.18.0 and pnpm 11.9.0.

```bash
npm exec --yes pnpm@11.9.0 -- install
pnpm install --frozen-lockfile
```

## Core verification

```bash
pnpm repository:verify
pnpm verify
```

## Quality commands

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm secret:scan
```

## Browser and accessibility commands

```bash
pnpm test:browser
pnpm test:a11y
pnpm test:visual
pnpm test:visual:update
pnpm test:browser:headed
pnpm test:browser:ui
pnpm ui:test:browser
pnpm ui:test:a11y
pnpm exec playwright install chromium
```

## Design foundation commands

```bash
pnpm tokens:build
pnpm tokens:check
pnpm content:validate
pnpm ui:build
pnpm ui:test
pnpm ui:preview
pnpm uiux:check
pnpm design:verify
```

## Repository governance commands

```bash
pnpm community:verify
pnpm actions:verify
pnpm deps:policy
pnpm deps:audit
pnpm deps:licenses
pnpm deps:inventory
pnpm deps:outdated
pnpm deps:verify
pnpm changeset:status
pnpm release:check
pnpm release:inventory
```

## Changesets

Changesets is configured for private-package versioning evidence only. It must not publish, tag, deploy, or create production releases during foundation work.

```bash
pnpm changeset
pnpm changeset:status
pnpm release:version
```

Run `pnpm release:version` only in an explicitly approved release task.

## Interactive browser CLI fallback

```bash
pnpm dev
pnpm browser:cli:open
pnpm browser:cli:close
pnpm browser:cli:cleanup
```

The fallback is restricted to synthetic local browser validation. Do not use production origins, personal browser profiles, extension mode, CDP attach to a personal browser, real data, or undocumented sandbox changes.

## Database command interfaces

```bash
pnpm db:migrate
pnpm db:seed
```

These commands are present but phase-gated. They intentionally exit nonzero in Phase 1, create no files or databases, and defer operational migration and seed behavior to Phase 2.

## Repository instructions and manual Git

Root and nested `AGENTS.md` files contain repository instructions only. They do not create autonomous agents, subagents, agent teams, or background orchestration. `.agent/PLANS.md` is an execution-plan convention for complex work.

Git and GitHub writes are human-only. Codex may inspect Git state, edit files, run validation, and suggest a commit message, but must not commit, push, merge, tag, release, deploy, publish packages, create pull requests, or change GitHub settings.

## GitHub repository controls

The repository contains CODEOWNERS, issue forms, a pull request template, Dependabot configuration, dependency-review configuration, release-note configuration, pinned CI workflows, and a read-only release-readiness workflow. Branch protection, rulesets, required status checks, code-owner enforcement, Dependency Review activation, and private vulnerability reporting require external repository-administrator verification.

## Synthetic-data rule

All local tests and browser checks use synthetic data only. Do not enter real patient, provider, clinical, financial, organization, production, or credential data into tests, tools, logs, screenshots, traces, reports, or issue content.

## No production use

This foundation is not deployable product software. It exists to prove repository governance, reproducible install, command execution, workspace boundaries, local browser interaction, deterministic browser testing, accessibility smoke checks, design foundations, dependency policy, release-readiness checks, and artifact hygiene.
