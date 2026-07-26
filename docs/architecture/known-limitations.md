# Known Limitations

A standing register of accepted, documented limitations an auditor / DPO / security reviewer should
know about. Each entry records scope, affected period, root cause, and current status. Add to this file
rather than leaving a limitation in a milestone report.

---

## KL-001 — Denied access attempts were not audited (M5 → M6.3b)

**Status:** Root cause fixed in M6.3b (`resolveDecideAndAuditAccess`). The historical gap is
**permanent and unreconstructable**.

**Scope.** Every resource that used decide-before-load / decide-before-write across the M5 arc
(patient-profile, appointment, consultation, medical-record, prescription, laboratory, messaging,
document) and care-circle (M6.1). A *denied* authorization decision returned a decision draft to the
caller but persisted **nothing** — only *committed* (allowed) actions wrote an audit event via the
transactional command.

**Affected period.** From when the first M5 resource shipped through the M6.3b fix — i.e. all denied
access attempts recorded in that window do not exist in the audit trail.

**Root cause.** The PDP produced an `authorization-policy-decision` audit *intent*, but no code path
persisted it on a deny; audit persistence was wired only into `runTransactionalCommand`, which runs
only when an action commits.

**Reconstructability.** **None.** There is no log, event, or secondary signal that recorded the actor,
subject, resource, or reason of a denial. The window is permanently dark; denied attempts in that
period cannot be enumerated after the fact.

**Remediation.** M6.3b added `resolveDecideAndAuditAccess`, a decide-and-audit wrapper that persists an
append-only authorization audit event on **any non-allow**, adopted by all M5 resources + care-circle.
Patient-profile create/update carry their own M6.3 deny/dedup audits. From M6.3b forward, denied access
attempts are auditable.

**Residual.** The 16 ungated operational writes (see KL-002) do not yet reach a decision at all, so
their denials are still unrecorded until M6.4 gates them.

---

## KL-002 — operational writes not gated by an authorization decision (M6.3b → M6.4) — CLOSED

**Status: CLOSED in M6.4** (2026-07-26). All **17** operational writes (count corrected from 16 during
the M6.4 Phase-1 classification recount) are now gated by a right-sized authorization decision per
ADR-0012's four decision kinds — authz decided BEFORE artifact/transition validity, every non-allow
audited with an honest category, and TOCTOU-safe conditional transitions wherever a state machine
applies. Retained here for the historical record; no longer an open limitation.

**Final coverage (all 17):**
- **appointment** (4): `openAvailabilitySlot` org-internal; `reschedule`/`cancel` patient-subject;
  `transition-status` patient-subject + state machine with the multi-path exclusion of `cancelled`.
- **prescription** (2) + **laboratory** (2): derived-authority (consent-bearing) — TOCTOU-safe
  conditional transitions + the both-halves revocation asymmetry.
- **messaging** (2): `markMessageAsRead` self-scoped (non-enumerating); `closeMessageThread`
  derived-authority (no consent chain, participant check).
- **consultation** (4): `schedule`/`add-participant`/`complete`/`cancel` patient-subject (state
  machines on complete/cancel).
- **medical-record** (2): `openMedicalRecord`/`voidMedicalRecordEntry` patient-subject.
- **document** (1): `archiveDocument` derived-authority (no consent chain, ownership check).

**Root cause (historical).** M5 gated only each resource's *primary* write + reads; secondary lifecycle
actions were shipped with audit attribution but without a decision. Fixed across M6.4.
