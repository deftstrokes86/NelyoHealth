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

## KL-002 — operational writes not gated by an authorization decision (M6.3b → M6.4)

**Status:** Identified in M6.3b (item-2 audit; count corrected from 16 to **17** during the M6.4
Phase-1 classification recount). **M6.4 in progress.** Gated + tested so far (the two reference patterns):
- **appointment** (4): `openAvailabilitySlot` org-internal; `reschedule`/`cancel`/`transition-status`
  patient-subject, the last with the ADR-0012 state-machine multi-path exclusion.
- **prescription** (2): `dispensePrescription`/`cancelPrescription` derived-authority — TOCTOU-safe
  (conditional claim/cancel, stale-state audited) + the revocation-asymmetry both-halves test.
- **laboratory** (2): `recordLabResult`/`cancelLabOrder` derived-authority — a conditional
  `transitionLabOrderStatusIf` guard (TOCTOU) + stale-state audit + the both-halves asymmetry test.
- **messaging** (2): `markMessageAsRead` self-scoped (thread-principal check, NON-ENUMERATING — a
  non-participant and an unknown message id deny identically, both audited) + `closeMessageThread`
  derived-authority with NO consent chain (capability + a thread-participant check).

**All four decision-kind machineries are now proven in code. 7 writes remain**, each a mechanical
application of a proven pattern: consultation `scheduleConsultation` / `addConsultationParticipant` /
`completeConsultation` / `cancelConsultation` + medical-record `openMedicalRecord` /
`voidMedicalRecordEntry` (patient-subject, like appointment); document `archiveDocument`
(derived-authority no-consent, like closeMessageThread).

**Root cause.** M5 gated only each resource's *primary* write + reads; secondary lifecycle actions were
shipped with audit attribution but without a decision.

**Impact.** Reachable only server-side today (no HTTP surface for these yet). The exposure becomes live
when these actions are routed. The M6.4 classification (patient-subject / derived-authority /
org-internal / self-scoped) determines the correct decision per write.
