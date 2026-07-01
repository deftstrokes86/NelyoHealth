# GitHub Repository Controls

## Verified repository facts

| Fact | Evidence | Status |
|---|---|---|
| Remote | https://github.com/deftstrokes86/NelyoHealth.git | Verified from local git remote |
| Default local branch | main | Verified locally |
| GitHub API feature verification | gh unavailable in current environment | Not verified |
| Personal repository owner | deftstrokes86 from remote URL | Used for CODEOWNERS routing |
| GitHub organization | Deferred by explicit owner-approved Phase 1 map amendment | Not created |

## Controls implemented in repository

- CODEOWNERS routes repository-wide and sensitive paths to @deftstrokes86.
- Pull request template captures cross-domain impact, locked requirements, browser evidence, synthetic artifacts, rollback, and external approvals.
- Issue forms reject blank issues and warn against real or production data.
- Dependabot monitors npm and GitHub Actions ecosystems without auto-merge.
- Release-note category configuration is present and requires human review before publication.
- CI workflows use least-privilege contents: read permissions.
- External GitHub Actions are pinned to full commit SHAs.
- Release-readiness workflow is manual and read-only.
- Visual contract tests are included in Foundation CI.
- Manual Git and GitHub workflow is documented; Codex must not commit, push, create PRs, merge, tag, release, deploy, publish, or change settings. Codex may trigger or re-run GitHub Actions workflows when explicitly requested by the owner for controlled evidence runs.

## Required default-branch administration

These settings are required for `main` but are not claimed active until a repository administrator verifies them:

| Control | Required configuration | Status |
|---|---|---|
| Pull requests | Require pull request before merge | PENDING-REPOSITORY-ADMINISTRATION |
| Direct pushes | Restrict or block direct pushes to main | PENDING-REPOSITORY-ADMINISTRATION |
| Force pushes | Prohibit force pushes | PENDING-REPOSITORY-ADMINISTRATION |
| Branch deletion | Prohibit branch deletion | PENDING-REPOSITORY-ADMINISTRATION |
| Review count | Do not require a separate approval while there is only one verified human maintainer unless the owner chooses otherwise | PENDING-REPOSITORY-ADMINISTRATION |
| Code owners | Keep CODEOWNERS informative until an independent qualified reviewer exists; then require code-owner review | PENDING-REPOSITORY-ADMINISTRATION |
| Stale approvals | Dismiss stale approvals after relevant changes | PENDING-REPOSITORY-ADMINISTRATION |
| Conversations | Require conversation resolution before merge | PENDING-REPOSITORY-ADMINISTRATION |
| Status checks | Require Foundation CI, repository verification, visual contract tests, and release readiness | PENDING-REPOSITORY-ADMINISTRATION |
| Branch freshness | Require branch up to date or approved merge queue strategy | PENDING-REPOSITORY-ADMINISTRATION |
| Administrators | Include administrators unless approved emergency bypass exists | PENDING-REPOSITORY-ADMINISTRATION |
| Signed commits | Decide and record signed-commit requirement | PENDING-REPOSITORY-ADMINISTRATION |
| Linear history | Decide and record linear-history requirement | PENDING-REPOSITORY-ADMINISTRATION |
| Merge methods | Decide squash/rebase/merge policy | PENDING-REPOSITORY-ADMINISTRATION |
| Dependency Review | Enable if supported and add as required check | PENDING-ADMIN-VERIFICATION |
| Browser tests | Require deterministic Playwright checks where relevant | PENDING-REPOSITORY-ADMINISTRATION |
| Accessibility tests | Require accessibility smoke checks where relevant | PENDING-REPOSITORY-ADMINISTRATION |
| Design verification | Require design verification for design/content changes | PENDING-REPOSITORY-ADMINISTRATION |
| Secret scan | Require secret scan | PENDING-REPOSITORY-ADMINISTRATION |
| Dependabot | No automatic Dependabot merge | PENDING-REPOSITORY-ADMINISTRATION |
| Bypass roles | Define bypass roles and emergency bypass audit | PENDING-REPOSITORY-ADMINISTRATION |

## Required status checks

At minimum, branch protection should require formatting, linting, typecheck, unit tests, integration tests, deterministic browser tests, accessibility tests, visual contract tests, build, secret scan, community health, dependency policy, license policy, GitHub Actions pinning, Changesets policy, UI UX Pro Max integrity, and release-readiness checks.

Required checks block invalid changes from entering `main`; they do not enable auto-merge or automated release.

## Manual administration boundary

`docs/engineering/github-manual-ruleset-checklist.md` records the human-owned setup steps and required evidence fields. Codex may read settings when authenticated read-only access already exists, may trigger or re-run workflows when explicitly requested by the owner, and must not mutate GitHub repository settings or claim branch protection is active without evidence.

## Official source basis

Sources checked on 2026-06-25: GitHub CODEOWNERS docs, issue-template docs, pull-request-template docs, Dependabot options reference, Dependency Review docs, workflow permissions syntax, rulesets/branch protection docs, automatic release-note docs, and GitHub Actions security hardening guidance for full-SHA action pinning.
