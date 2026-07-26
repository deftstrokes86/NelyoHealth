# ADR-0012: Derived-authority writes, operational-write decision kinds, and the multi-path gate-equivalence invariant

## Status

ACCEPTED (roadmap M6.4 — Operational Write Authorization). Directed by Chief Architect review.

## Date

2026-07-26

## Context

M6.3b's item-2 audit found **17 operational (secondary/lifecycle) writes** that ran the transactional
command with actor attribution but **no authorization decision**. M6.4 closes them. Phase-1
classification (Chief-Architect-approved, zero reclassifications) established that the 17 are **not
homogeneous** — forcing all through the patient-consent pipeline would be as wrong as branching the
evaluator was for CREATE (ADR-0011). Four decision kinds apply.

## Decision — four operational-write decision kinds

1. **Patient-subject** (9 writes: reschedule/cancel/transition-status appointment; schedule/add-
   participant/complete/cancel consultation; open-record/void-entry). The action acts on a patient's
   care/data. Load the artifact for its `patientRef`, then decide through the **full composed pipeline**
   (`resolveDecideAndAuditAccess`, consent + ReBAC + break-glass) BEFORE any write — identical to M6.3.

2. **Derived-authority** (6 writes: dispense/cancel prescription; record-result/cancel lab order;
   close message-thread; archive document). The actor's standing flows from an **existing authorized
   artifact** (the prescription, order, thread, document) that was itself created under a patient-
   subject or gated decision. The decision **validates actor capability + workspace** (RBAC rule +
   tenant + active session) and the **artifact's existence/state** (the state machine, below). It does
   **NOT re-evaluate patient consent** — the consent chain is INHERITED from the artifact.

   **Consent-chain inheritance applies only where the artifact carries one.** A prescription and a lab
   order are consent-bearing clinical artifacts, so their derived writes inherit that chain. A message
   thread (authority = participation) and a document (authority = ownership) are **not** consent-bearing
   — their derived writes are capability + artifact-state only. An inherited-consent check MUST NOT be
   fabricated against an artifact that has no chain, nor silently skipped without this documentation.

   **TOCTOU-safety is mandatory.** "Validate artifact state, then write" is a race — a prescription can
   be cancelled between the `issued` check and the dispense commit. The state validation MUST be
   **atomic with the write**: a conditional transition (`UPDATE … SET state = next WHERE id = $1 AND
   state = expected`), with **zero affected rows → deny with a distinct `stale-artifact-state` reason
   code** and no state change. Never check-then-act across separate statements.

3. **Org-internal, no patient subject** (1 write: `openAvailabilitySlot`). No patient is involved
   (provider availability). Capability + workspace only (ADR-0011-style). Consent is not an input.

4. **Self-scoped** (1 write: `markMessageAsRead`). The actor acts on something addressed to them.
   Verify actor == the resource's owner/recipient (M6.1 `listMyWards` precedent). No composed pipeline.

Kinds 2 and 3 share one decision function (capability + workspace, RBAC + tenant + session + purpose,
no consent) — `evaluateCapabilityWorkspaceAuthorization`, generalized from ADR-0011's create decision.
Kind 2 additionally runs the artifact state machine.

## The revocation asymmetry (derived-authority) — DICTATED

Consent revocation blocks **new** authorizations; it does **NOT abort completion of an act already
validly authorized by the artifact**. A validly-issued prescription remains dispensable; a result for
a validly-consented lab order remains recordable. **Suppressing a clinical result mid-flight because
consent was withdrawn is a patient-safety failure, not a privacy win.** The mechanism to STOP a derived
action is the **artifact's own state machine** (the prescriber cancels the prescription; the orderer
cancels the order) — never the consent check.

What revocation *does* affect: **subsequent reads** of the produced artifact flow through the normal
pipeline and will deny. So the asymmetry is: **write-to-complete is allowed; read-thereafter is
consent-gated.** (Test: revoke consent → `recordLabResult` still succeeds → a later org read of that
result denies.)

## The multi-path gate-equivalence invariant — DICTATED

**Any state reachable through more than one command must carry identical authorization on every path.**
Otherwise the lighter-gated path is a bypass with the same effect. Enforcement, preferred form: a
generic transition command **excludes states owned by a dedicated command**. Concretely,
`transitionAppointmentStatus` must make `cancelled` **unreachable** (it is owned by the patient-subject
`cancelAppointment`); reaching it via the generic transition is rejected with a distinct reason code
and audited. Where exclusion is impossible, the gates on every path must be provably identical. Every
state machine ships a test asserting the excluded transitions are rejected.

## State machines (kind 2 + lifecycle kind 1)

Lifecycle writes validate the transition against an explicit state machine, not just the actor. An
invalid transition is rejected with a **distinct reason code** and audited — it is an
authorization/validity failure, not a silent no-op. The dedicated-command exclusions (above) are part
of each machine's definition.

### Rejection-category taxonomy (M6.4 review clarification) — two distinct causes

A non-allow on a state-machine write has one of two causes, and the audit category MUST reflect which:

- **`rejected-invalid-transition`** — a **deterministic** failure: the artifact's CURRENT (loaded)
  state does not permit the requested transition per the state machine. Detected by a **pre-check on
  the loaded state**, before the write. The caller asked for something the machine never allows from
  here (e.g. completing a cancelled consultation). Caller error; reproducible.

- **`denied-stale-artifact-state`** — a **concurrency** failure: the pre-check passed, but the atomic
  **conditional write** (`UPDATE … WHERE status = <expected source>`) affected **zero rows** because
  the state changed between load and commit. A valid request that lost a race. Non-deterministic.

**Implementation rule:** a state-machine lifecycle write does BOTH — a pre-check on the loaded state
(emits `rejected-invalid-transition`) AND a conditional guard on the write (emits
`denied-stale-artifact-state` on zero rows). One cannot substitute for the other: the pre-check gives
the honest deterministic category and a fast path; the conditional guard is the TOCTOU-safety net.
Applied to appointment `transition-status`, consultation `complete`/`cancel`, medical-record
`void-entry`.

For **derived-authority** writes without a separate lifecycle machine (prescription dispense/cancel,
lab record/cancel, document archive), the conditional guard is the sole state check; its zero-row
failure is `denied-stale-artifact-state` (the race is the security concern). Document's already-archived
result is a benign **idempotency** outcome (`rejected-already-archived`), not a denial — it is neither
of the two categories above.

## Invariants preserved

Default-deny (unmapped capability denies); no-PHI in events/audit; atomic state/outbox/audit; the
generalized deny-audit (M6.3b) fires on every non-allow across all four kinds; context isolation;
append-only auditability. The consent invariant is NOT weakened: derived-authority does not bypass
consent — it inherits an already-granted chain and never touches the consent store on the write path,
while reads stay fully consent-gated.

## Alternatives considered

- **All 17 through the full consent pipeline.** Rejected: clinically wrong (blocks mid-flight
  completion of validly-authorized acts) and semantically wrong for org-internal / self-scoped writes.
- **Leave secondary writes ungated (status quo).** Rejected: 17 ungated clinical/scheduling mutations
  on a default-deny platform (KL-002).

## Consequences

- Positive: every operational write carries a right-sized decision + deny-audit; the consent invariant
  holds without over-gating; clinically-safe completion; bypass-proof state machines.
- Negative / follow-ups: each new lifecycle command must define its state machine + exclusions; the
  derived-authority read-after asymmetry must be honored wherever produced artifacts are later read.

## Related documents

`docs/adr/ADR-0011-patient-profile-create-authorization.md`,
`docs/architecture/known-limitations.md` (KL-002, closed by this milestone),
`apps/api/src/access-audit.ts` (generalized deny-audit).
