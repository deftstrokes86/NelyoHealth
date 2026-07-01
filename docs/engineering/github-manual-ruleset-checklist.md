# GitHub Manual Ruleset Checklist

This checklist is performed manually by the repository owner in GitHub settings. Codex does not execute settings changes, create commits, push branches, merge pull requests, or publish releases. Codex may trigger or re-run GitHub Actions workflows when explicitly requested for controlled verification.

The goal is to prevent invalid changes from entering `main`.

## Repository Evidence

| Field | Value |
|---|---|
| Repository | PENDING-MANUAL-EVIDENCE |
| Default branch | `main` |
| Date configured | PENDING-MANUAL-EVIDENCE |
| Configured by | PENDING-MANUAL-EVIDENCE |
| Rule name | PENDING-MANUAL-EVIDENCE |
| Required checks | PENDING-MANUAL-EVIDENCE |
| Force-push status | PENDING-MANUAL-EVIDENCE |
| Deletion status | PENDING-MANUAL-EVIDENCE |
| Pull-request requirement | PENDING-MANUAL-EVIDENCE |
| Conversation-resolution requirement | PENDING-MANUAL-EVIDENCE |
| Screenshot or settings evidence | PENDING-MANUAL-EVIDENCE |
| Verification PR | PENDING-MANUAL-EVIDENCE |
| Review date | PENDING-MANUAL-EVIDENCE |

Do not mark this checklist complete without evidence.

## Recommended Manual Rule for `main`

- Require a pull request before merging.
- Require current CI checks.
- Block force pushes.
- Block branch deletion.
- Require conversation resolution.
- Do not enable automatic merging.
- Do not require a separate approval while the repository has only one verified human maintainer unless the owner chooses otherwise.
- Keep CODEOWNERS informative until an independent reviewer exists.
- Add code-owner-review enforcement when another qualified reviewer becomes available.
- Preserve an audited emergency-administration process.

## Required Checks to Select

- Foundation CI
- Formatting
- Lint
- Typecheck
- Unit tests
- Integration tests
- Browser tests
- Accessibility tests
- Visual tests
- Build verification
- Secret scan
- Community health
- GitHub Actions pinning
- Dependency policy
- Dependency license policy
- Changesets policy
- UI UX Pro Max integrity
- Release readiness

If GitHub presents checks under job names instead of step names, select the current Foundation CI job and any separately configured required workflows.

## Verification

Create a temporary verification pull request manually and confirm:

- Failed checks block merge.
- Conversation resolution is required.
- Direct `main` push is prevented or restricted.
- Force pushes are blocked.
- Branch deletion is blocked.
- Auto-merge remains disabled.
