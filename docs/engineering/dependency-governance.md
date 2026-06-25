# Dependency Governance

## Request process

Every new dependency request must identify purpose, category, exact version, primary source, date checked, runtime requirement, security implication, licence classification, transitive impact, owner, rollback/removal path, and required domain reviews.

## Dependency categories

- Runtime dependency: requires architecture, security, privacy, and domain review when it affects clinical, payment, identity, analytics, infrastructure, or external services.
- Development dependency: requires engineering/security review and exact pinning.
- Workspace dependency: must use approved workspace protocol and remain private unless a future release decision changes it.
- Vendored third-party code: requires source, licence, commit, integrity evidence, update policy, and owner.
- GitHub Action: requires immutable SHA pinning and least-privilege permissions.
- Browser binary: must be used only for synthetic local/test/staging validation.
- Repository-local Codex skill: must remain advisory unless a prompt authorizes another use.

## Policy summary

- External package versions are exact.
- `latest`, wildcard ranges, unpinned Git sources, unpinned GitHub archive URLs, HTTP package sources, and mixed package managers are prohibited.
- Workspace packages remain private.
- publishConfig is forbidden during foundation work.
- install lifecycle scripts are forbidden during foundation work.
- pnpm minimumReleaseAge remains enabled, with explicit exclusions only for reviewed foundation dependencies.
- Automated dependency updates do not bypass human review.
- Unknown or ambiguous licences require review.
- UI UX Pro Max licence condition remains unresolved.

## Review dimensions

Dependency review must consider package health, maintainer activity, release history, transitive dependencies, install scripts, network behavior, supply-chain risk, security advisories, privacy behavior, clinical safety where relevant, finance/payment impact where relevant, vendor due diligence, and removal/rollback cost.

## Commands

```bash
pnpm deps:policy
pnpm deps:audit
pnpm deps:licenses
pnpm deps:inventory
pnpm deps:outdated
pnpm deps:verify
```

`deps:inventory` is deterministic and does not query live package freshness. `deps:outdated` performs the network-dependent freshness lookup separately and is informational unless a future approved policy changes that gate.

## Changesets dependency

| Tool | Version | Source | Runtime reason | Pinning decision |
|---|---|---|---|---|
| @changesets/cli | 2.31.0 | npm registry metadata and Changesets docs | Private-package version evidence and release-readiness workflow | Exact dev dependency |

## Licence classification

The licence policy is engineering evidence, not legal advice. Classifications are KNOWN-PERMISSIVE, REVIEW-REQUIRED, PROHIBITED-PENDING-LEGAL-APPROVAL, and UNKNOWN. Review-required warnings do not equal legal approval.

UI UX Pro Max remains a separately governed advisory-only vendored subset. Its upstream license ambiguity remains recorded for external review before broader redistribution or commercial reliance.

## Emergency security update

A security update may be expedited only when scope, version, advisory, tests, rollback, and owner are documented. It still must not auto-merge, publish, deploy, or bypass locked requirements.
