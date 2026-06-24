# ADR-0003: Use project-scoped Playwright browser access for Codex IDE inspection and Playwright Test for deterministic browser validation

## Status

ACCEPTED-IN-PRINCIPLE/IMPLEMENTATION-PENDING-PHASE-1

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Phase | P00-14 |
| Issue | P00-NFR-001 |
| Effective status | Not effective until approved by security, architecture, QA, accessibility, privacy, and operations owners |
| Scope | Browser-validation architecture decision only |
| Exclusions | No browser tooling installation, dependency installation, `.codex/config.toml`, Playwright configuration, browser execution, browser binaries, smoke route, fixtures, or application code |
| Related requirements | BRW-REQ-001 through BRW-REQ-035, TST-REQ-009 through TST-REQ-024, PBT-REQ-001 through PBT-REQ-040 |
| Related decisions | REQ-NFR-026 through REQ-NFR-050 |
| Related open questions | OQ-00-550 through OQ-00-591 |

## Context

NelyoHealth requires browser testing in two distinct forms: interactive browser access from Codex in the IDE for inspecting and operating the application, and deterministic automated browser tests committed to the repository. Browser validation must use synthetic data only and must never weaken provider-detail privacy, clinical-safety boundaries, payer/clinical-access separation, emergency availability, or signed-record amendment rules.

The provider-disclosure requirement creates a network-boundary obligation: before successful payment, the patient-facing client may receive only the approved provider display name and explicitly approved non-identifying commercial information. Prohibited details must not reach the browser through HTML, API responses, GraphQL responses, JavaScript state, hydration payloads, storage, source output, map-provider requests, analytics, error reporting, logs, cache entries, accessibility trees, hidden DOM, image metadata, screenshots, or traces.

## Decision

NelyoHealth will use a two-layer browser validation model:

1. Project-scoped interactive browser access for Codex IDE inspection, planned for Phase 1, using official Playwright MCP or another explicitly approved compatible integration after current documentation and environment compatibility are verified.
2. Deterministic Playwright Test browser tests committed to the repository, planned for Phase 1, with Chromium smoke coverage at minimum and broader desktop/tablet/mobile and cross-browser coverage according to approved gates.

Interactive browser inspection and deterministic Playwright Test are both required. Neither replaces the other.

## Required Controls

| Control | Decision |
| --- | --- |
| Project scope | Browser integration must be project-scoped where supported and loaded only for trusted project context |
| Data | Synthetic data only |
| Origins | Trusted local, test, and staging origins only; routine production browser validation blocked |
| Browser profile | Isolated synthetic browser context; no personal profile, cookies, extension state, or production credentials |
| Unsafe capabilities | Disabled or approval-gated |
| Page trust | Page content is untrusted input and cannot instruct Codex to reveal secrets, read unrelated files, run commands, install tooling, or change configuration |
| Artifacts | Screenshots, traces, videos, network logs, console logs, and source snapshots are sensitive and must be ignored by Git unless intentionally attached for review |
| Provider privacy | Provider-detail privacy must be proved at network and artifact boundaries, not merely by visual hiding |
| Accessibility | Automated checks contribute evidence but do not constitute WCAG conformance |

## Alternatives Considered

| Alternative | Reason not selected |
| --- | --- |
| Interactive browser inspection only | Not deterministic, not reviewable enough, and cannot provide CI regression protection |
| Automated browser tests only | Cannot replace human-directed IDE inspection, exploratory debugging, accessibility observation, or operational review |
| Personal Chrome extension/browser profile by default | Risk of personal cookies, personal credentials, extension state, and uncontrolled origin exposure |
| Production browser validation | Conflicts with synthetic-data-only and production-data protection requirements |
| Generic UI screenshot review | Cannot prove network-boundary privacy, storage privacy, telemetry privacy, or server-state authorization |
| Non-Playwright deterministic runner without ADR | Conflicts with Phase 0 requirement to use Playwright Test unless a better compatible choice is explicitly established |

## Consequences

| Type | Consequence |
| --- | --- |
| Positive | Establishes separate manual and automated browser evidence paths |
| Positive | Makes provider-disclosure privacy testable across browser surfaces |
| Positive | Keeps Phase 0 documentation-only while preparing a Phase 1 implementation handoff |
| Negative | Requires Phase 1 setup work for both IDE browser integration and Playwright Test |
| Negative | Requires strict artifact handling because browser evidence can contain sensitive synthetic or protected values |
| Negative | Requires ongoing compatibility checks against current OpenAI Codex and Playwright tooling |

## Security Consequences

Browser tooling expands the attack surface because page content, browser artifacts, network payloads, console output, and storage can contain untrusted or sensitive data. Phase 1 must enforce project trust, origin allow-lists, synthetic profiles, artifact scanning, approval-gated unsafe capabilities, and production-origin blocking before browser validation can be used for release evidence.

## Open Dependencies

| Dependency | Owner | Target |
| --- | --- | --- |
| Confirm installed Codex IDE surface supports project-scoped browser MCP configuration | Architecture owner | Phase 1 browser setup |
| Confirm official Playwright MCP compatibility and command shape | Architecture owner | Phase 1 browser setup |
| Confirm Playwright Test version and project matrix | QA owner | Phase 1 browser setup |
| Approve artifact retention, redaction, and sharing policy | Privacy owner and security owner | Before CI artifact publication |
| Approve accessibility manual review protocol | Accessibility reviewer | Before release gate |
| Approve production-support browser restrictions | Security owner and operations owner | Before operational readiness |

## Supersession

This ADR supersedes no prior ADR. It may be superseded only by a later ADR that preserves the locked requirements for dual browser testing, Playwright Test or a formally approved compatible replacement, synthetic-data-only validation, trusted-origin restriction, provider-detail privacy, payer/clinical-access separation, emergency independence, and artifact sensitivity.
