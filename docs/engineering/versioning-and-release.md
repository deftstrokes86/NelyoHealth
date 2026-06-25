# Versioning and Release Readiness

## Purpose

P01-FND-003 adds read-only release readiness and private-package versioning controls. It does not publish packages, tag commits, create GitHub releases, deploy infrastructure, or launch a pilot.

## Changesets configuration

| Setting | Value | Reason |
|---|---|---|
| baseBranch | main | Matches local default branch and origin/main |
| privatePackages.version | true | Allows private package version evidence |
| privatePackages.tag | false | Avoids private package git tags during foundation work |
| commit | false | Keeps commits under human/orchestrator control |
| access | restricted | Prevents public publish posture |

## Commands

```bash
pnpm changeset
pnpm changeset:status
pnpm release:check
pnpm release:inventory
```

Run only in an explicit release task:

```bash
pnpm release:version
```

## Release-readiness workflow

.github/workflows/release-readiness.yml is manually triggered and read-only. It performs install, browser dependency setup, repository verification, dependency audit, outdated reporting, and inventory generation. It contains no publish, deploy, release, tag, or artifact-upload command.
