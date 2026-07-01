# Manual Git and GitHub Workflow

## Owner Authority

The project owner retains exclusive control of repository-changing Git and GitHub actions:

- `git add`
- `git commit`
- `git push`
- Branch creation
- Pull-request creation
- Pull-request merging
- Tags
- GitHub releases
- Deployment
- Repository settings

Codex may inspect repository state with read-only commands and may suggest a commit message. Codex must not commit, push, merge, tag, release, deploy, alter GitHub settings, enable auto-merge, or publish packages.

## Workflow Dispatch Exception

Codex may execute GitHub Actions workflow-dispatch and workflow re-run operations only when explicitly requested by the project owner for controlled evidence or verification runs.

Allowed Codex GitHub workflow operations:

- Trigger `workflow_dispatch` runs.
- Re-run failed jobs or full workflow runs.
- Read workflow logs, summaries, and artifacts.

Forbidden Codex GitHub operations remain:

- Repository-content mutation through GitHub API writes.
- Pull-request creation or merge.
- Tag or release publication.
- Repository settings or ruleset mutation.

## Manual Operating Model

1. The project owner creates a local task branch.
2. Codex edits and validates the repository.
3. Codex reports the complete diff and suggests a commit message.
4. The project owner reviews the diff.
5. The project owner manually commits.
6. The project owner manually pushes the task branch.
7. The project owner manually opens a pull request where required.
8. GitHub CI runs.
9. GitHub blocks merge when required checks fail.
10. The project owner manually merges after checks pass.

Direct pushes to `main` do not satisfy the failed-check merge gate. The intended flow is branch push, manual pull request, checks, manual review, and manual merge.

## Prohibited Automation

- No automatic PR creation.
- No automatic merge.
- No automatic tag.
- No automatic GitHub release.
- No automatic package publication.
- No automatic deployment.
- No autonomous Git or release orchestration.

Workflow dispatch or re-run commands are permitted when explicitly requested by the human owner and when they do not mutate repository content or settings.

## Read-Only Inspection Allowed

Examples:

```bash
git status --short --branch
git diff
git log --oneline -n 5
git branch --show-current
git remote -v
git ls-files
```

## Personal Repository Decision

The current founder-owned personal GitHub repository is accepted for this founder-led build. Creating a GitHub organization is deferred until team growth, ownership transfer, production-governance requirements, or managed permissions justify it.
