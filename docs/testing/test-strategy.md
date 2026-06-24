# P00-14 Test Strategy

## Document Control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Phase | P00-14 |
| Issue | P00-NFR-001 |
| Effective status | Not effective until approved by security, architecture, QA, accessibility, privacy, and operations owners |
| Scope | Documentation and testing-design only |
| Exclusions | No production code, dependency installation, browser binary installation, CI configuration, smoke route, fixture, or test implementation |
| Review authority | Security owner, architecture owner, QA owner, accessibility reviewer, privacy owner, operations owner, and clinical safety owner where clinical workflows are affected |
| Related decisions | REQ-NFR-001 through REQ-NFR-050 |
| Related open questions | OQ-00-492 through OQ-00-591 |

## Non-Assertion Notice

This strategy does not claim security certification, accessibility conformance, production readiness, availability commitment, performance commitment, or regulatory approval. Numeric thresholds, service levels, retention windows, recovery targets, and release gates remain approval-controlled.

## Quality Objectives

| ID | Objective | Required evidence | Status |
| --- | --- | --- | --- |
| TST-REQ-001 | Preserve one longitudinal patient identity across plans, employers, HMOs, sponsors, guardians, and family relationships | Identity and access tests spanning every relationship model | BLOCKING-REQUIREMENT |
| TST-REQ-002 | Prove payer status never grants clinical-record access | Authorization, relationship, and negative browser/API tests | BLOCKING-REQUIREMENT |
| TST-REQ-003 | Prove pre-payment pharmacy and laboratory provider disclosure is schema-level minimal disclosure, not visual hiding | API, HTML, DOM, network, storage, cache, telemetry, accessibility-tree, screenshot, and trace tests | BLOCKING-REQUIREMENT |
| TST-REQ-004 | Prove post-payment provider disclosure is tied to the selected authorized paid order only | State-machine, event, and order-scoped authorization tests | BLOCKING-REQUIREMENT |
| TST-REQ-005 | Prove payment failure, cancellation, incomplete authorization, refund, or another order cannot unlock provider details | Negative payment/disclosure tests | BLOCKING-REQUIREMENT |
| TST-REQ-006 | Prove emergency escalation is not blocked by payment, marketplace comparison, plan authorization, ordinary registration, or provider-detail obscuration | Emergency journey, workflow, and degraded-mode tests | BLOCKING-REQUIREMENT |
| TST-REQ-007 | Prove finalized clinical records are amended or versioned, never silently overwritten | Clinical-record lifecycle tests | BLOCKING-REQUIREMENT |
| TST-REQ-008 | Prove sponsor, employer, HMO, guardian, and delegated access is explicit and bounded | Role, tenant, relationship, consent, and delegation tests | BLOCKING-REQUIREMENT |
| TST-REQ-009 | Establish deterministic automated browser tests using Playwright Test | Phase 1 repository test suite and CI evidence | AUTOMATED-VERIFICATION-REQUIRED |
| TST-REQ-010 | Establish interactive Codex IDE browser validation as a separate inspection layer | Phase 1 operator checklist and evidence bundle | MANUAL-VERIFICATION-REQUIRED |
| TST-REQ-011 | Use synthetic data only for browser tests and test fixtures | Synthetic fixture inventory and production-origin blocking checks | BLOCKING-REQUIREMENT |
| TST-REQ-012 | Validate accessibility through automated checks and manual review | WCAG 2.2 AA target evidence and reviewer signoff | RELEASE-GATE |
| TST-REQ-013 | Validate low-bandwidth and constrained-device behavior | Network and viewport evidence | PILOT-GATE |
| TST-REQ-014 | Validate observability without leaking protected data | Logs, telemetry, analytics, error-reporting, traces, and artifact inspection | BLOCKING-REQUIREMENT |
| TST-REQ-015 | Treat browser and test artifacts as sensitive | Artifact retention, ignore, redaction, and scanner evidence | BLOCKING-REQUIREMENT |
| TST-REQ-016 | Cover registration, authentication, onboarding, family and guardian relationships, diaspora sponsorship, appointment booking, payment, consultation, pharmacy matching, and laboratory matching | Journey-to-test traceability | RELEASE-GATE |
| TST-REQ-017 | Cover failed payment, refunded payment, expired authorization, unauthorized order access, emergency escalation, role and tenant isolation, keyboard navigation, focus behavior, device layouts, failed network requests, console errors, and accessibility checks | Browser and integration test matrix | RELEASE-GATE |
| TST-REQ-018 | Use synthetic patients, payers, sponsors, guardians, clinicians, pharmacy operators, laboratory operators, HMO/employer administrators, support operators, and break-glass reviewers | Synthetic actor catalogue | BLOCKING-REQUIREMENT |
| TST-REQ-019 | Use synthetic providers with separate pre-payment display names and post-payment protected details | Provider-disclosure fixture design | BLOCKING-REQUIREMENT |
| TST-REQ-020 | Use sentinel values so accidental leakage is detectable in payloads, HTML, browser storage, logs, telemetry, screenshots, and traces | Privacy scanner design | BLOCKING-REQUIREMENT |
| TST-REQ-021 | Flaky tests must have owner, impact, repair path, and explicit quarantine approval where allowed | Flake register and gate record | RELEASE-GATE |
| TST-REQ-022 | Blocking privacy, payment-disclosure, emergency, clinical amendment, and payer-access tests must not be quarantined without external approval | Release-gate review | BLOCKING-REQUIREMENT |
| TST-REQ-023 | Retries may collect traces, screenshots, videos, console, and network evidence only under approved artifact controls | Artifact scanner and storage policy | BLOCKING-REQUIREMENT |
| TST-REQ-024 | A test failure caused by leaked protected provider detail, PHI, payment data, or secret is a privacy/security incident candidate until triaged | Incident triage evidence | BLOCKING-REQUIREMENT |

## Test Layers

| Layer | Purpose | Phase 0 output | Phase 1 or later implementation |
| --- | --- | --- | --- |
| Contract tests | Validate API, schema, event, and disclosure contracts before UI behavior | Contract scenarios and negative matrices | Implemented with services |
| Authorization tests | Prove subject, role, relationship, tenant, and order boundaries | Access scenarios | Implemented with service and browser tests |
| State-machine tests | Validate transitions, guards, idempotency, retries, timeout, reversal, and illegal transitions | Workflow invariants | Implemented with workflow code |
| Event tests | Validate authoritative event emission and consumption | Event evidence requirements | Implemented with event infrastructure |
| Unit tests | Validate deterministic business rules | Test categories | Implemented with application code |
| Integration tests | Validate dependency and module boundaries | Integration surfaces | Implemented as services emerge |
| API tests | Validate server-side behavior independent of browser rendering | API negative matrices | Implemented with synthetic accounts |
| Browser smoke tests | Validate basic availability and safe rendering | Smoke scenarios | Implemented with Playwright Test and interactive browser |
| End-to-end journey tests | Validate registration through follow-up journeys | Journey catalogue links | Implemented incrementally |
| Provider-disclosure privacy tests | Validate pre-payment non-disclosure and post-payment order-scoped release | Privacy boundary matrix | Implemented before provider marketplace release |
| Payment tests | Validate payment success, failure, cancellation, refund, settlement, claims, and unlock events | Payment/disclosure scenarios | Implemented with sandboxed payments |
| Clinical safety tests | Validate emergency, referral, critical-result, and amendment workflows | Safety scenarios | Implemented with synthetic clinical records |
| Accessibility tests | Validate keyboard, focus, screen-reader, contrast, forms, error handling, and disclosure boundaries | Accessibility matrix | Implemented with automated and manual review |
| Performance tests | Validate approved journey budgets once targets are approved | Budget schema | Implemented after target approval |
| Reliability tests | Validate retry, recovery, draft preservation, upload continuity, backup restoration, and degraded operation | Reliability requirements | Implemented after architecture selection |
| Security tests | Validate web app, session, upload, webhook, secret, dependency, and privileged-access controls | Security requirements | Implemented with selected stack |
| Privacy tests | Validate data minimization, logs, analytics, notifications, deep links, browser artifacts, and cache behavior | Privacy matrix | Implemented before real-user pilot |
| Observability tests | Validate errors, metrics, traces, and audit events without PHI or provider-location leakage | Telemetry constraints | Implemented with monitoring stack |
| Failure-injection tests | Validate dependency outage, network failure, timeout, and partial failure behavior | Failure classes | Implemented after architecture stabilizes |
| Backup and restore tests | Validate recovery evidence without inventing RTO/RPO commitments | Restore proof schema | Implemented when infrastructure exists |
| Manual exploratory review | Validate risks automation cannot prove | Review checklist | Conducted with synthetic data only |
| Release-gate review | Validate blocking requirements and approvals before release | Gate criteria | Conducted per release candidate |

## Environment Strategy

| Environment | Allowed data | Allowed purpose | Prohibited use |
| --- | --- | --- | --- |
| Local development | Synthetic only | Developer and Codex inspection | Production data, personal browser profile, production origin |
| Automated CI | Synthetic only | Deterministic test execution | Live clinical, payment, pharmacy, laboratory, or production identifiers |
| Test/staging | Synthetic or formally approved de-identified data only if later approved | Integrated validation | Production credentials or unapproved live provider data |
| Production | Real operational data | Runtime monitoring and approved support only | Routine browser testing, direct database editing, or synthetic mutation unless externally approved |

## CI Tier Design

| Tier | Purpose | Scope | Gate status |
| --- | --- | --- | --- |
| Local fast | Developer confidence before review | Unit, contract, selected browser smoke | MEASUREMENT-DEFINED |
| Pull request | Regression protection | Unit, integration, API, deterministic Chromium browser smoke, privacy boundary subset | RELEASE-GATE |
| Main branch | Broad regression | Full deterministic browser suite, privacy scanner, accessibility automation, telemetry checks | RELEASE-GATE |
| Nightly | Stress and breadth | Cross-browser, mobile/tablet/desktop, low-bandwidth, failure-injection, performance baselines | TARGET-REQUIRES-APPROVAL |
| Release candidate | Final evidence | Full suite plus manual interactive Codex IDE browser review and accessibility review | RELEASE-GATE |

## Future Non-Functional Test Identifier Catalogue

These identifiers reserve traceability anchors for future implementation. They do not create test code in Phase 0.

| Range | Scope |
| --- | --- |
| NFR-TST-001 to NFR-TST-020 | Security controls |
| NFR-TST-021 to NFR-TST-035 | Reliability controls |
| NFR-TST-036 to NFR-TST-052 | Accessibility controls |
| NFR-TST-053 to NFR-TST-070 | Performance controls |
| NFR-TST-071 to NFR-TST-097 | Browser validation controls |
| NFR-TST-098 to NFR-TST-140 | Provider-disclosure and privacy-boundary controls |
| NFR-TST-141 to NFR-TST-160 | Clinical-safety and emergency controls |
| NFR-TST-161 to NFR-TST-180 | Payments, ledger, claims, refund, and settlement controls |

## Exit Criteria

| Gate | Required evidence | Result if missing |
| --- | --- | --- |
| P00-14 completion | All P00-14 docs exist, link to source obligations, and remain documentation-only | P00-14 FAIL |
| Phase 1 browser setup | Project-scoped interactive browser access and deterministic Playwright Test suite are implemented with synthetic data only | Phase 1 browser gate FAIL |
| Provider marketplace release | Provider-disclosure negative tests pass across API, browser, storage, telemetry, artifacts, and cache | Release blocked |
| Clinical workflow release | Emergency, referral, critical result, signed-record amendment, and draft preservation tests pass | Release blocked |
| Accessibility release | Automated accessibility checks pass and manual review accepts the WCAG 2.2 AA target evidence | Release blocked or conditional release only with approved exception |
| Pilot release | Security, reliability, performance, privacy, browser, and operational gates have owners and approved evidence | Pilot blocked |

## Review and Change Control

Changes require updates to the decision register, open-question register where unresolved, document register, change log, and affected test matrices. No Phase 1 implementation work may treat this strategy as approved until the listed approval authorities accept it.
