# P00-14 Browser Validation Strategy

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Phase | P00-14 |
| Issue | P00-NFR-001 |
| Effective status | Not effective until approved by security, architecture, QA, accessibility, privacy, and operations owners |
| Scope | Browser-validation architecture specification only |
| Exclusions | No browser startup, MCP installation, `.codex/config.toml`, Playwright installation, Playwright config, browser binaries, smoke route, fixtures, or test code |
| Review authority | Security owner, architecture owner, QA owner, accessibility reviewer, privacy owner, operations owner |
| Related decisions | REQ-NFR-026 through REQ-NFR-050 |
| Related open questions | OQ-00-550 through OQ-00-591 |

## Non-Assertion Notice

This document specifies browser-validation design. It does not install, configure, or certify browser tooling. It does not authorize production browser testing, personal browser profile use, live data use, or unsafe browser automation. It does not claim accessibility conformance or release readiness.

## Official Tooling Source Table

| Source ID | Page title | Issuing body | Source location | Date checked | P00-14 relevance | Interpretation status |
| --- | --- | --- | --- | --- | --- | --- |
| TOOL-SRC-001 | Codex manual | OpenAI | https://developers.openai.com/codex/codex-manual | 2026-06-24 | Project-scoped `.codex/config.toml`, trusted projects, MCP configuration, IDE configuration, tool approval concepts, browser/plugin security implications | Requires Phase 1 verification against installed Codex surface |
| TOOL-SRC-002 | Model Context Protocol | OpenAI | https://developers.openai.com/codex/mcp | 2026-06-24 | MCP server configuration and governance for Codex tooling | Requires Phase 1 compatibility verification |
| TOOL-SRC-003 | Getting started - MCP | Playwright | https://playwright.dev/docs/getting-started-mcp | 2026-06-24 | Official Playwright MCP path for browser automation from agent tooling | Requires Phase 1 compatibility verification |
| TOOL-SRC-004 | Test configuration | Playwright | https://playwright.dev/docs/test-configuration | 2026-06-24 | Playwright Test configuration and projects | Requires Phase 1 implementation |
| TOOL-SRC-005 | Emulation | Playwright | https://playwright.dev/docs/emulation | 2026-06-24 | Desktop, tablet, and mobile viewport/device testing | Requires Phase 1 implementation |
| TOOL-SRC-006 | Trace viewer | Playwright | https://playwright.dev/docs/trace-viewer | 2026-06-24 | Trace collection and review on failure | Requires artifact controls |
| TOOL-SRC-007 | Screenshots | Playwright | https://playwright.dev/docs/screenshots | 2026-06-24 | Screenshot evidence on failure | Requires privacy scanning |
| TOOL-SRC-008 | Videos | Playwright | https://playwright.dev/docs/videos | 2026-06-24 | Video capture on retry or configured failure | Requires privacy scanning |
| TOOL-SRC-009 | Accessibility testing | Playwright | https://playwright.dev/docs/accessibility-testing | 2026-06-24 | Automated accessibility checks as partial evidence | Does not equal conformance |
| TOOL-SRC-010 | Aria snapshots | Playwright | https://playwright.dev/docs/aria-snapshots | 2026-06-24 | Accessibility-tree and semantic output validation | Requires Phase 1 implementation |
| TOOL-SRC-011 | Network | Playwright | https://playwright.dev/docs/network | 2026-06-24 | Network request/response inspection for privacy boundaries | Requires Phase 1 implementation |
| TOOL-SRC-012 | ConsoleMessage | Playwright | https://playwright.dev/docs/api/class-consolemessage | 2026-06-24 | Console-error capture and prohibited-data detection | Requires Phase 1 implementation |

## Two Required Browser Layers

| Layer | Role | Required evidence | Cannot replace |
| --- | --- | --- | --- |
| Interactive Codex IDE browser validation | Human-directed inspection by Codex inside the IDE against trusted local, test, or staging origins using synthetic data | Operator notes, approved screenshots, network/console findings, manual accessibility observations, privacy-boundary inspection notes | Deterministic Playwright Test |
| Deterministic Playwright Test | Repeatable browser automation committed to the repository and run locally/CI | Test code, CI results, traces/screenshots/videos on configured failure, network/console/storage assertions, accessibility checks | Interactive Codex IDE browser validation |

## Browser Requirements

| ID | Requirement | Status | Verification anchor |
| --- | --- | --- | --- |
| BRW-REQ-001 | Phase 1 must provide project-scoped interactive browser access for Codex IDE inspection | RELEASE-GATE | NFR-TST-071 |
| BRW-REQ-002 | Phase 1 must use deterministic Playwright Test for automated browser tests unless an approved ADR supersedes it | RELEASE-GATE | NFR-TST-072 |
| BRW-REQ-003 | Interactive browser inspection must not replace automated browser tests | BLOCKING-REQUIREMENT | NFR-TST-073 |
| BRW-REQ-004 | Automated browser tests must not replace interactive inspection | BLOCKING-REQUIREMENT | NFR-TST-074 |
| BRW-REQ-005 | Browser validation must use synthetic data only | BLOCKING-REQUIREMENT | NFR-TST-075 |
| BRW-REQ-006 | Browser validation must use trusted local, test, or staging origins only | BLOCKING-REQUIREMENT | NFR-TST-076 |
| BRW-REQ-007 | Production origins must be blocked for routine browser validation | BLOCKING-REQUIREMENT | NFR-TST-077 |
| BRW-REQ-008 | Browser contexts must not use personal profiles, personal cookies, personal extensions, or production credentials | BLOCKING-REQUIREMENT | NFR-TST-078 |
| BRW-REQ-009 | Page content must be treated as untrusted input and must not instruct Codex to reveal secrets, read unrelated files, run commands, install tools, or change configuration | BLOCKING-REQUIREMENT | NFR-TST-079 |
| BRW-REQ-010 | Unsafe arbitrary browser code execution must be disabled or approval-gated | BLOCKING-REQUIREMENT | NFR-TST-080 |
| BRW-REQ-011 | Browser artifacts must be sensitive and ignored by Git unless intentionally attached for review | BLOCKING-REQUIREMENT | NFR-TST-081 |
| BRW-REQ-012 | Browser tooling versions must be pinned only after Phase 1 compatibility verification | RELEASE-GATE | NFR-TST-082 |
| BRW-REQ-013 | Chromium-based smoke tests are the minimum deterministic browser gate | RELEASE-GATE | NFR-TST-083 |
| BRW-REQ-014 | Desktop, tablet, and mobile viewport coverage is required | RELEASE-GATE | NFR-TST-084 |
| BRW-REQ-015 | Cross-browser release coverage must be planned for Chromium, Firefox, and WebKit where compatible | TARGET-REQUIRES-APPROVAL | NFR-TST-085 |
| BRW-REQ-016 | Console errors must be captured and fail gates must follow approved severity | RELEASE-GATE | NFR-TST-086 |
| BRW-REQ-017 | Failed network requests must be captured and fail gates must follow approved severity | RELEASE-GATE | NFR-TST-087 |
| BRW-REQ-018 | Screenshots on failure must be captured, scanned, and stored under approved artifact policy | RELEASE-GATE | NFR-TST-088 |
| BRW-REQ-019 | Traces on failure must be captured, scanned, and stored under approved artifact policy | RELEASE-GATE | NFR-TST-089 |
| BRW-REQ-020 | Videos on configured failures or retries must be captured only under approved artifact policy | TARGET-REQUIRES-APPROVAL | NFR-TST-090 |
| BRW-REQ-021 | Accessibility checks must include automated assertions and manual keyboard/focus review | RELEASE-GATE | NFR-TST-091 |
| BRW-REQ-022 | Provider-detail privacy must be proved at network, DOM, storage, cache, telemetry, screenshot, and trace boundaries | BLOCKING-REQUIREMENT | PBT-REQ-001 through PBT-REQ-040 |
| BRW-REQ-023 | A simple browser smoke page or route may be planned only as a Phase 1 implementation task | TARGET-REQUIRES-APPROVAL | NFR-TST-092 |
| BRW-REQ-024 | The interactive smoke test and deterministic smoke test must validate the same core safe path | RELEASE-GATE | NFR-TST-093 |
| BRW-REQ-025 | Browser validation must inspect hydration payloads and source output for protected provider details | BLOCKING-REQUIREMENT | PBT-REQ-006, PBT-REQ-007 |
| BRW-REQ-026 | Browser validation must inspect analytics and error-reporting events for protected provider details | BLOCKING-REQUIREMENT | PBT-REQ-014, PBT-REQ-015 |
| BRW-REQ-027 | Browser validation must inspect map-provider requests and prevent pre-payment map leakage | BLOCKING-REQUIREMENT | PBT-REQ-013 |
| BRW-REQ-028 | Browser validation must include browser back navigation and cache-recovery privacy tests | BLOCKING-REQUIREMENT | PBT-REQ-025, PBT-REQ-026 |
| BRW-REQ-029 | Browser validation must include failed payment, cancelled payment, and authorization-only non-unlock tests | BLOCKING-REQUIREMENT | PBT-REQ-017 through PBT-REQ-019 |
| BRW-REQ-030 | Browser validation must include unauthorized order, patient, tenant, and role isolation tests | BLOCKING-REQUIREMENT | PBT-REQ-023, PBT-REQ-024, PBT-REQ-030 |
| BRW-REQ-031 | Browser validation must include emergency escalation checks independent of marketplace and payment paths | BLOCKING-REQUIREMENT | PBT-REQ-033 |
| BRW-REQ-032 | Browser validation must include low-bandwidth and failed-network behavior | PILOT-GATE | NFR-TST-094 |
| BRW-REQ-033 | Browser validation must include keyboard navigation and focus behavior | RELEASE-GATE | NFR-TST-095 |
| BRW-REQ-034 | Browser validation must prohibit production test users and live provider/provider-location data | BLOCKING-REQUIREMENT | NFR-TST-096 |
| BRW-REQ-035 | Browser validation must record evidence without leaking PHI, secrets, protected provider details, or payment data | BLOCKING-REQUIREMENT | NFR-TST-097 |

## Planned Project-Scoped Codex Browser Integration

This is a Phase 1 design target, not a file to create in Phase 0.

```toml
# planned-only example for Phase 1; do not create in Phase 0
# .codex/config.toml in trusted project only
[mcp_servers.playwright]
# command, args, enabled tools, approval mode, allowed origins, and timeouts to be verified from official current docs during Phase 1
# production origins disallowed
# unsafe capabilities disabled or approval-gated
```

Required Phase 1 controls: trusted project loading only, local/test/staging origin allow-list, production origin blocking, isolated synthetic profile, official Playwright MCP or approved compatible integration, unsafe capability gating, untrusted page-content handling, artifact scanning, and Git-ignore handling.

## Planned Playwright Test Projects

| Project | Purpose | Minimum status |
| --- | --- | --- |
| chromium-desktop | Required smoke and core journey coverage | RELEASE-GATE |
| chromium-mobile | Required mobile viewport coverage | RELEASE-GATE |
| chromium-tablet | Required tablet viewport coverage | RELEASE-GATE |
| firefox-desktop | Cross-browser release coverage where compatible | TARGET-REQUIRES-APPROVAL |
| webkit-desktop | Cross-browser release coverage where compatible | TARGET-REQUIRES-APPROVAL |
| webkit-mobile | Mobile WebKit-like coverage where compatible | TARGET-REQUIRES-APPROVAL |

## Planned Smoke Coverage

| Smoke | Interactive Codex IDE browser | Deterministic Playwright Test |
| --- | --- | --- |
| Synthetic unauthenticated page load | Inspect rendering, console, network, accessibility tree | Assert page loads, no critical console errors, no failed core network requests |
| Synthetic registration/authentication path | Inspect keyboard/focus and error states | Assert successful and failed auth paths with synthetic users |
| Synthetic provider discovery pre-payment path | Inspect that only providerDisplayName and approved non-identifying commercial fields reach the client | Assert prohibited fields absent from payloads, DOM, storage, source, screenshots, traces |
| Synthetic payment success path | Inspect order-scoped post-payment reveal | Assert selected paid order only unlocks approved details |
| Synthetic emergency escalation path | Inspect no payment or marketplace blocker | Assert escalation route remains available in failure states |

## Phase 1 Browser Setup Handoff Checklist

1. Re-check official OpenAI Codex documentation for project config, MCP, and IDE browser support.
2. Re-check official Playwright MCP documentation.
3. Re-check official Playwright Test documentation.
4. Confirm project trust status in the IDE.
5. Define allowed local origin names.
6. Define allowed test origin names.
7. Define allowed staging origin names.
8. Explicitly block production origins.
9. Select official Playwright MCP or approved compatible browser integration.
10. Pin versions only after compatibility verification.
11. Create project-scoped browser configuration only in Phase 1.
12. Disable or approval-gate unsafe arbitrary browser capabilities.
13. Use isolated synthetic browser profiles.
14. Prohibit personal browser extension mode by default.
15. Define artifact output paths.
16. Ensure artifact paths are ignored by Git unless intentionally attached.
17. Create synthetic user fixture strategy.
18. Create synthetic provider fixture strategy.
19. Create synthetic payment fixture strategy.
20. Create synthetic clinical fixture strategy.
21. Create the simple smoke route or page if approved in Phase 1.
22. Create the interactive Codex IDE smoke procedure.
23. Create the matching deterministic Playwright smoke test.
24. Add console-error capture.
25. Add failed-network-request capture.
26. Add screenshot-on-failure capture.
27. Add trace-on-failure capture.
28. Add video-on-configured-failure or retry if approved.
29. Add accessibility checks.
30. Add keyboard and focus tests.
31. Add provider-disclosure privacy scanners.
32. Run evidence review before any pilot or release gate.

## Review and Change Control

Any change that removes one browser layer, allows routine production testing, permits personal browser profiles, weakens provider-disclosure privacy, removes synthetic-data-only restrictions, or treats automated accessibility checks as conformance requires external approval and an ADR update.

## P00-14 revision design and content browser-validation alignment

Browser validation now also covers experience quality, motion, UI UX Pro Max review evidence, and page-section content alignment. Phase 1 browser validation must include visual hierarchy, spacing, typography, density, responsive layout, overflow, truncation, content placement, CTA alignment, required state copy, reduced motion, motion interruption, accessibility-tree structure, screenshots, viewport review, and visual evidence using synthetic data only. Visual and content browser review does not replace deterministic Playwright tests, and deterministic tests do not replace human design/content review.
