# Performance Requirements

## Document Control

| Field | Value |
|---|---|
| Document title | Performance Requirements |
| Codex prompt ID | P00-14 |
| Complete Breakdown work package | P00-17 |
| Issue ID | P00-NFR-001 |
| Owner role | Architecture Lead + Performance Owner + QA Lead |
| Status | DRAFT-PENDING-SECURITY-ARCHITECTURE-QA-ACCESSIBILITY-PRIVACY-AND-OPERATIONS-APPROVAL |
| Review state | PROPOSED; NOT EFFECTIVE UNTIL APPROVED |
| Effective date | NOT EFFECTIVE UNTIL APPROVED |
| Version | 0.1 |
| Required reviewers | Architecture Lead; QA Lead; Product Owner; Clinical Safety Lead; Privacy/DPO; Security Lead; Operations Lead |
| Approval authority | Architecture + Product + QA + Operations owners |
| Related decisions | REQ-NFR-001 through REQ-NFR-050 |
| Related open questions | OQ-00-492 through OQ-00-591 |
| Change control | Numeric budgets, profiles, and release gates require approval. |

This document defines implementation requirements, not completed controls. No browser tooling has been installed in Phase 0. No security certification is implied. No accessibility conformance claim is implied. No availability or performance commitment is effective until approved. Numeric targets remain approval-controlled.

## Performance Principles

Performance is measured by user-critical journeys. Privacy and security controls are not removed to improve speed. Emergency and clinical workflows have priority. Low-end devices and constrained networks are included. Numeric budgets require approval. Averages alone are insufficient; tail latency must be observed. Performance failures must not create duplicate actions.

## Performance Requirements Matrix

| Requirement ID | Journey or endpoint class | Metric | Measurement method | Network profile | Device profile | Data volume | Target status | Degraded behavior | Owner | Test | Pilot gate |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PERF-NFR-001 | Browser shell | LCP, INP, CLS, TTFB, long tasks, memory growth | Playwright/performance tooling later | Approved profiles pending | Desktop/mobile/tablet | Baseline required | TARGET-REQUIRES-APPROVAL | Accessible loading/failure state | Performance Owner | NFR-TST-053 | RELEASE-GATE |
| PERF-NFR-002 | Route payloads | JS bundle, route payload, hydration payload, image size, font behavior, network requests | Bundle and browser measurement | Approved profiles pending | Low-end included | Baseline required | TARGET-REQUIRES-APPROVAL | Do not cache protected data for speed | Architecture | NFR-TST-054 | RELEASE-GATE |
| PERF-NFR-003 | Registration/login/recovery | Journey duration and error rate | Browser journey measurement | Low bandwidth included | Mobile/desktop | Synthetic users | TARGET-REQUIRES-APPROVAL | Safe retry without duplicate account | QA | NFR-TST-055 | PILOT-GATE |
| PERF-NFR-004 | Patient onboarding/intake | Completion, draft preservation, upload progress | Browser + API measurement | Intermittent | Mobile/tablet/desktop | Large history question | TARGET-REQUIRES-APPROVAL | Autosave/recovery, no silent loss | Product + Clinical | NFR-TST-056 | PILOT-GATE |
| PERF-NFR-005 | Appointment search/booking | Search, slot hold, booking response | API/browser/load later | Normal/slow | Mobile/desktop | Concurrent final slot | TARGET-REQUIRES-APPROVAL | Idempotent duplicate prevention | Scheduling Owner | NFR-TST-057 | PILOT-GATE |
| PERF-NFR-006 | Payment initialization/return | Verification and return latency | API/browser measurement | Slow/interrupted | Mobile/desktop | Duplicate submit/callback | TARGET-REQUIRES-APPROVAL | No false success; no unlock | Finance + QA | NFR-TST-058 | PILOT-GATE |
| PERF-NFR-007 | Consultation waiting/video/audio | Join, degradation, fallback | Browser/media checks | Slow/intermittent | Mobile/desktop | Baseline required | TARGET-REQUIRES-APPROVAL | Audio/text fallback, reschedule path | Clinical + Ops | NFR-TST-059 | PILOT-GATE |
| PERF-NFR-008 | Pharmacy/lab matching | Server-side 4 km search, controlled expansion, matching latency | API measurement | Normal/slow | Any | Candidate scale pending | TARGET-REQUIRES-APPROVAL | No client candidate dump; no protected prefetch | Marketplace Owner | NFR-TST-060 | PILOT-GATE |
| PERF-NFR-009 | Provider-detail retrieval | Exact-order retrieval latency | API/browser measurement | Slow | Mobile/desktop | Authorized order | TARGET-REQUIRES-APPROVAL | Deny/retry safely; no stale reveal | Security + Marketplace | NFR-TST-061 | PILOT-GATE |
| PERF-NFR-010 | Result/referral display | Render and API response | Browser/API | Slow | Mobile/desktop | Large result/history | TARGET-REQUIRES-APPROVAL | Accessible loading and retry | Clinical | NFR-TST-062 | PILOT-GATE |
| PERF-NFR-011 | Emergency escalation screen | Load and action response | Browser/API | Degraded | Mobile first | Baseline required | TARGET-REQUIRES-APPROVAL | Minimal emergency guidance without nonessential deps | Clinical + Ops | NFR-TST-063 | PILOT-GATE |
| PERF-NFR-012 | Admin/support queues | Queue load, filter/search, action latency | Browser/API | Normal | Desktop | Backlog profiles pending | TARGET-REQUIRES-APPROVAL | Prioritize safety-critical work | Operations | NFR-TST-064 | RELEASE-GATE |
| PERF-NFR-013 | Backend API | API, database, external dependency latency | API instrumentation | N/A | N/A | Baseline required | TARGET-REQUIRES-APPROVAL | Degraded status and retry | Architecture | NFR-TST-065 | RELEASE-GATE |
| PERF-NFR-014 | Queues/jobs/events | Queue wait, job execution, propagation, read-model staleness | Queue metrics | N/A | N/A | Backlog pending | TARGET-REQUIRES-APPROVAL | Owner queue, no silent closure | Operations | NFR-TST-066 | RELEASE-GATE |
| PERF-NFR-015 | Authorization/audit | Authorization decision, audit write | API/instrumentation | N/A | N/A | Baseline required | TARGET-REQUIRES-APPROVAL | Deny on uncertainty; preserve audit intent | Security | NFR-TST-067 | PILOT-GATE |

## Matching Performance and Privacy

Provider matching remains server-side. Performance optimization must not send full candidates, coordinates, distances, branch IDs, contact details, map data, internal identifiers, alternative provider details, or protected metadata to the browser before authorization. No client-side distance calculation, speculative map call, protected-detail prefetch, or alternative-provider coordinates are allowed.

## Low-Bandwidth Profiles

Phase 1+ must define slow-connected, high-latency, intermittent, packet-loss-question, upload interruption, video degradation, offline transition, reconnect, mobile data, low-memory device, and backgrounded-mobile-browser profiles. Exact network values remain approval-controlled.

## Concurrency and Load

Future tests cover concurrent appointment booking, final slot, concurrent stock reservation, last-unit inventory, duplicate payment submit, duplicate webhook, provider-detail retrieval, result release, critical-result acknowledgment, notification burst, support backlog, audit write, DSR export, and provider payout batch.

## Performance Budget Schema

Budget fields: metric, route/service, device, network, percentile, target, maximum, measurement tool, owner, approval, and breach response. Numeric values are `TARGET-REQUIRES-APPROVAL`.

