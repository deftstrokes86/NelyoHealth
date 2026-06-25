# Supply Chain Inventory

## Inventory outputs

The dependency inventory command writes ignored artifacts under .artifacts/dependencies/:

- dependency-inventory.json
- dependency-inventory.md

These artifacts are local evidence. They are not legal approval and they do not authorize production use.

The inventory uses installed package and license metadata. Live package freshness is intentionally separated into `pnpm deps:outdated` because it depends on registry availability and must not block deterministic repository verification.

## Source verification

| Area | Official source checked | Access date | Use |
|---|---|---|---|
| GitHub CODEOWNERS | docs.github.com CODEOWNERS documentation | 2026-06-25 | Owner routing file placement and behavior |
| GitHub issue and PR templates | docs.github.com issue and pull-request template documentation | 2026-06-25 | Community health structure |
| Dependabot | docs.github.com Dependabot options reference | 2026-06-25 | npm and GitHub Actions update configuration |
| Dependency Review | docs.github.com dependency review documentation | 2026-06-25 | Activation marked pending feature verification |
| GitHub Actions security | docs.github.com security hardening guidance | 2026-06-25 | Full commit SHA action pinning |
| GitHub workflow permissions | docs.github.com workflow syntax | 2026-06-25 | Least-privilege contents: read workflows |
| pnpm audit/licenses/outdated/settings | pnpm.io CLI and settings documentation | 2026-06-25 | Dependency audit, license, outdated, and minimumReleaseAge controls |
| Changesets | Changesets official docs and npm registry metadata | 2026-06-25 | Private package versioning and CLI pin |

## Runtime observation

Local validation runs may warn that the host uses Node v25.8.1 while the repository pins Node 24.18.0. That warning is not an approval to change the pinned runtime.
