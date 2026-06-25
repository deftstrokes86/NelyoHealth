# Phase 1 Requirements Traceability

| Requirement | Source | Implementation | Test | Evidence | Decision | Risk | Dependency | Blocker | Status | Owner | Phase 2 implication |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Reproducible toolchain | P01-FND-001 | package.json, .node-version, pnpm-lock.yaml | pnpm install --frozen-lockfile | repository:verify | DEC-P01-FND-003-001 | RSK-P01-FND-003-004 | None | None | SATISFIED | Engineering | Phase 2 must preserve pins |
| pnpm workspace | P01-FND-001 | pnpm-workspace.yaml | package-policy | deps:policy | DEC-P01-FND-003-011 | None | None | None | SATISFIED | Engineering | Add packages through workspace only |
| Turborepo | P01-FND-001 | turbo.json | build | repository:verify | Existing Phase 1 decision | None | None | None | SATISFIED | Engineering | Keep deterministic tasks |
| Strict TypeScript | P01-FND-001 | tsconfig.base.json | typecheck | repository:verify | Existing Phase 1 decision | None | None | None | SATISFIED | Engineering | Phase 2 code must typecheck |
| Formatting | P01-FND-001 | Prettier config | format:check | repository:verify | Existing Phase 1 decision | None | None | None | SATISFIED | Engineering | Required in CI |
| Linting | P01-FND-001 | eslint.config.mjs | lint | repository:verify | Existing Phase 1 decision | None | None | None | SATISFIED | Engineering | Required in CI |
| Unit tests | P01-FND-001 | tests/unit | test | repository:verify | Existing Phase 1 decision | None | None | None | SATISFIED | Engineering | Add per package |
| Integration tests | P01-FND-001 | tests/integration | test:integration | repository:verify | Existing Phase 1 decision | None | None | None | SATISFIED | Engineering | Add bounded integrations |
| Playwright Test | P00-14/P01-FND-001 | playwright.config.ts, tests/e2e | test:browser | 10 browser tests passed | ADR-0003 | None | None | None | SATISFIED | QA/Engineering | Required for UI work |
| Accessibility smoke testing | P00-14/P01-FND-001 | tests/accessibility | test:a11y | 2 accessibility tests passed | ADR-0003 | None | None | None | SATISFIED | Accessibility | Expand in Phase 2 UI work |
| Interactive browser fallback | P01-FND-001R | Playwright CLI scripts | browser:cli commands | Existing accepted evidence | Existing Phase 1 decision | None | None | None | SATISFIED | QA/Engineering | Remains verified fallback |
| Project-scoped Playwright MCP blocker | P01-FND-001R | docs/engineering/browser-cli-fallback.md | Blocker tracking | STATUS | Existing Phase 1 decision | RSK-P01-FND-003-001 | DEP-P01-FND-003-001 | BLK-P01-FND-003-001 | NONBLOCKING-TRACKED | Engineering | Do not block Phase 2 |
| Synthetic-data rule | Locked requirement | docs, PR template, issue forms | secret scan/browser tests | repository:verify | DEC-P01-FND-003-003 | Phase 0 risks | None | None | SATISFIED | Privacy/Security | Preserve in Phase 2 |
| Browser artifact controls | P01-FND-001 | .gitignore, docs | secret scan | repository:verify | Existing Phase 1 decision | None | None | None | SATISFIED | QA/Security | Keep ignored artifacts |
| CI | P01-FND-001/P01-FND-003 | .github/workflows/ci.yml | actions:verify | pinned actions pass | DEC-P01-FND-003-009 | RSK-P01-FND-003-001 | DEP-P01-FND-003-001 | BLK-P01-FND-003-001 | SATISFIED-FILE; ADMIN-PENDING | Repository admin | Enable required checks |
| Secret scanning | P01-FND-001 | tools/checks/basic-secret-scan.mjs | secret:scan | repository:verify | Existing Phase 1 decision | None | None | None | SATISFIED | Security | Expand as needed |
| Design tokens | P01-FND-002 | packages/design-tokens | tokens:check | design:verify | ADR-0004 | None | None | None | SATISFIED | Design/Engineering | Extend governed tokens |
| Contrast validation | P01-FND-002 | design-token tests | tokens:check | design:verify | ADR-0004 | None | None | None | SATISFIED | Accessibility | Preserve contrast checks |
| Content registry | P01-FND-002 | packages/content-registry | content:validate | design:verify | ADR-0004 | None | None | None | SATISFIED | Content | Phase 2 content uses registry |
| Content release policy | P01-FND-002 | content registry release policy | unit tests | design:verify | ADR-0004 | None | None | None | SATISFIED | Content | No unapproved clinical copy |
| Motion and reduced motion | P01-FND-002 | packages/ui-foundation motion | ui:test, browser | design:verify | ADR-0004 | None | None | None | SATISFIED | Design/Accessibility | Preserve reduced motion |
| Sensitive-content boundary | P01-FND-002 | ui-foundation boundary | ui:test | design:verify | ADR-0004 | None | None | None | SATISFIED | Privacy/Engineering | Required for protected content |
| UI UX Pro Max vendoring | P01-FND-002 | .agents skill, tools/vendor metadata | uiux:check | release:check | DEC-P01-FND-003-005 | RSK-P01-FND-003-003 | DEP-P01-FND-003-005 | BLK-P01-FND-003-003 | SATISFIED-FILE; REVIEW-REQUIRED | Legal/Engineering | Advisory only |
| Repository-local skill | P01-FND-002 | .agents/skills/ui-ux-pro-max | uiux:check | release:check | DEC-P01-FND-003-005 | RSK-P01-FND-003-003 | DEP-P01-FND-003-005 | BLK-P01-FND-003-003 | SATISFIED | Engineering | No auto-update |
| Contribution governance | P01-FND-003 | CONTRIBUTING.md | community:verify | release:check | DEC-P01-FND-003-006 | None | None | None | SATISFIED | Repository owner | Use for Phase 2 PRs |
| Pull-request template | P01-FND-003 | .github/pull_request_template.md | community:verify | release:check | DEC-P01-FND-003-007 | None | None | None | SATISFIED | Repository owner | Required evidence model |
| Issue forms | P01-FND-003 | .github/ISSUE_TEMPLATE | community:verify | release:check | DEC-P01-FND-003-008 | None | None | None | SATISFIED | Repository owner | Sensitive-data safe intake |
| Code ownership | P01-FND-003 | .github/CODEOWNERS | community:verify | status/diff | DEC-P01-FND-003-003 | RSK-P01-FND-003-001 | DEP-P01-FND-003-002 | BLK-P01-FND-003-001 | FILE-SATISFIED; ENFORCEMENT-PENDING | Repository admin | Enable code-owner review |
| Dependabot | P01-FND-003 | .github/dependabot.yml | community:verify | release:check | DEC-P01-FND-003-010 | None | None | None | SATISFIED | Repository admin | Updates require review |
| Dependency policy | P01-FND-003 | config/dependency-policy.json | deps:policy | repository:verify | DEC-P01-FND-003-011 | None | None | None | SATISFIED | Security/Engineering | Govern Phase 2 deps |
| Licence inventory | P01-FND-003 | dependency-license-policy, inventory | deps:licenses | warnings recorded | DEC-P01-FND-003-012 | RSK-P01-FND-003-003 | DEP-P01-FND-003-005 | BLK-P01-FND-003-003 | SATISFIED-WITH-REVIEW-WARNINGS | Legal/Commercial | Legal review before release |
| Action pinning | P01-FND-003 | github-actions-pinning check | actions:verify | repository:verify | DEC-P01-FND-003-009 | None | None | None | SATISFIED | Security/Engineering | All new actions pinned |
| Changesets | P01-FND-003 | .changeset config, @changesets/cli | changeset:status | repository:verify | DEC-P01-FND-003-015 | None | None | None | SATISFIED | Release owner | No publish path |
| Release readiness | P01-FND-003 | release-readiness workflow/check | release:check | repository:verify | DEC-P01-FND-003-018 | RSK-P01-FND-003-001 | DEP-P01-FND-003-001 | BLK-P01-FND-003-001 | SATISFIED-FILE; ADMIN-PENDING | Release owner | Read-only gate |
| Phase 2 handoff | P01-FND-003 | phase-2-readiness-handoff.md | document review | file exists | DEC-P01-FND-003-020 | Phase 0 risks | Phase 0 blockers | Phase 0 blockers | SATISFIED | Execution owner | Start only by orchestration |
