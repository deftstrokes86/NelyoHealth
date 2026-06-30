# P01-FND-001 Toolchain

## Document Control

| Field | Value |
|---|---|
| Status | IMPLEMENTED-PENDING-ORCHESTRATION-ACCEPTANCE |
| Phase | P01-FND-001 |
| Owner | Engineering / Architecture |
| Date checked | 2026-06-25 |
| Scope | Repository, toolchain, CI, deterministic browser, accessibility smoke, and Codex browser foundation |

This document records development tooling selected for the bounded Phase 1 foundation. It does not approve product features, clinical workflows, production infrastructure, provider integrations, payment integrations, or live data use.

## Official-source verification

| Area | Official source checked | Evidence used |
|---|---|---|
| OpenAI Codex project configuration | OpenAI Codex manual, project `.codex/config.toml`, MCP, and in-app browser sections | Project config requires trusted project; MCP tables use `[mcp_servers.<name>]`; in-app browser is for local unauthenticated pages and treats page content as untrusted. |
| Microsoft Playwright MCP | `@playwright/mcp` npm package and Microsoft Playwright MCP repository/package metadata | Version `0.0.76` selected; package requires Node `>=18`. |
| Playwright Test | Playwright documentation and npm package metadata | Version `1.61.1` selected; package requires Node `>=18`. |
| Playwright browser installation | Playwright browser installation documentation | Chromium is installed for the first deterministic smoke gate. |
| Playwright configuration | Playwright Test configuration documentation | Local web server, Chromium projects, traces, screenshots, videos, and local reports are configured. |
| Playwright accessibility testing | Playwright accessibility testing documentation and `@axe-core/playwright` metadata | `@axe-core/playwright` version `4.12.1` selected for automated smoke checks. |
| pnpm workspaces | pnpm workspace documentation and package metadata | `pnpm-workspace.yaml` defines future `apps`, `packages`, and `tools` workspaces. |
| Turborepo | Turborepo configuration documentation and package metadata | Version `2.10.0` selected for repository task orchestration. |
| Node.js release lines | Node.js official release index | Node `24.18.0` Krypton LTS selected. |
| TypeScript | TypeScript TSConfig documentation and package metadata | Version `6.0.3` selected with strict settings. |
| ESLint | ESLint flat configuration documentation and package metadata | ESLint `10.5.0`, `@eslint/js` `10.0.1`, and `typescript-eslint` `8.62.0` selected. |
| Prettier | Prettier installation/configuration documentation and package metadata | Version `3.8.4` selected. |
| Vitest | Vitest guide and package metadata | Version `4.1.9` selected for foundation unit and integration tests. |

## Installed tool versions

| Tool | Exact version | Runtime requirement | Needed for | Prod/dev | Pinning mechanism | Upgrade review requirement |
|---|---:|---|---|---|---|---|
| Node.js | 24.18.0 | Official LTS runtime | Consistent local and CI runtime | Development/CI | `.node-version`; `package.json` engines; CI setup-node | Architecture approval and CI proof |
| pnpm | 11.9.0 | Node `>=22.13` | Reproducible workspace install and lockfile | Development/CI | `packageManager`, engines, CI action input | Architecture approval and frozen-lockfile proof |
| Turborepo | 2.10.0 | Node-compatible package metadata | Root task orchestration | Development/CI | exact devDependency | Architecture review |
| TypeScript | 6.0.3 | Node-compatible package metadata | Strict type checking | Development/CI | exact devDependency | Architecture review and typecheck proof |
| ESLint | 10.5.0 | Node `^20.19.0 || ^22.13.0 || >=24` | Static analysis | Development/CI | exact devDependency | Engineering/security review |
| @eslint/js | 10.0.1 | Node `^20.19.0 || ^22.13.0 || >=24` | ESLint base rules | Development/CI | exact devDependency | Engineering review |
| typescript-eslint | 8.62.0 | Node `^18.18.0 || ^20.9.0 || >=21.1.0` | TypeScript ESLint rules | Development/CI | exact devDependency | Engineering review |
| Prettier | 3.8.4 | Node `>=14` | Formatting | Development/CI | exact devDependency | Engineering review |
| Vitest | 4.1.9 | Node `^20.0.0 || ^22.0.0 || >=24.0.0` | Foundation unit/integration tests | Development/CI | exact devDependency | QA/engineering review |
| @playwright/test | 1.61.1 | Node `>=18` | Deterministic browser tests | Development/CI | exact devDependency + lockfile | QA/architecture/security review |
| @axe-core/playwright | 4.12.1 | Playwright-compatible | Accessibility smoke checks | Development/CI | exact devDependency + lockfile | Accessibility/QA review |
| @playwright/mcp | 0.0.76 | Node `>=18` | Codex IDE interactive browser integration | Development only | exact `.codex/config.toml` package spec | Architecture/security review |
| @types/node | 24.13.2 | Type declarations | TypeScript Node types | Development/CI | exact devDependency | Engineering review |
| globals | 17.7.0 | ESLint config support | Browser and Node globals | Development/CI | exact devDependency | Engineering review |

## Deferred tooling

- Next.js, NestJS, React, Motion, UI UX Pro Max, Prisma, database clients, authentication SDKs, payment SDKs, provider SDKs, and infrastructure SDKs are intentionally not installed in P01-FND-001.
- Database migration and seed commands are operational through the Phase 2 database foundation (`pnpm db:migrate`, `pnpm db:seed`, `pnpm db:status`, `pnpm db:reset`, `pnpm db:rollback`) for local synthetic environments.
- Firefox and WebKit browser matrices are deferred until the browser-matrix expansion task.
- Advanced secret-scanning vendor selection is deferred to a later security task; this issue includes only a deterministic basic pattern guard.