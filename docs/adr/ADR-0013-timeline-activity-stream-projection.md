# ADR-0013: Timeline / Activity Stream — payload projection, read-time per-domain gating, filter-vs-access decisions

## Status

ACCEPTED (roadmap M6.5 — Timeline / Activity Stream). Plan reviewed and approved with corrections,
all folded in below.

## Date

2026-07-26

## Context

The M6 derived-layer arc adds a per-patient **timeline / activity stream**: a chronological feed of
patient-meaningful care events. Readers have **heterogeneous grants** — the patient sees everything; a
clinician sees clinical entries; a care-circle member with appointment-only visibility must never see
medication or lab entries. This ADR records the projection shape, the reader-filtering model, and the
invariants, per ADR-0010 and the M6.2 curated-policy precedent.

## Decision

### 1. One per-patient projection, filtered at read time (not per-audience materialization)

`nelyo_timeline.timeline_entry` is a single per-patient projection. Each entry is **references only** —
`source_event_ref` (idempotency), `patient_ref`, `resource_domain`, `entry_type`, the aggregate ref
(deep-link target), `occurred_at`, `organization_ref` — **no clinical content**. Rendering ("a
prescription was issued") resolves details through the domain's **gated read at display time**.

Per-audience materialization is rejected: grants change faster than events accrue, and a materialized
per-audience view embeds a **grant snapshot** that goes stale on revocation → **stale-grant leakage**.
A single projection + live read-time filtering keeps ADR-0010's invariant intact: *the projection is
eventually-consistent DATA, never an authorization cache.*

### 2. The visibility invariant (load-bearing)

> **A timeline entry is visible to a reader iff that reader could obtain the same fact through the
> domain's own read surface.**

Therefore **each domain's filter decision uses the SAME decision kind as that domain's own read path** —
domain-level filtering is only correct when it mirrors the domain's real authorization:

- **Consent-gated domains** (appointment, consultation, medication, lab, clinical-record, document):
  the composed pipeline (consent + ReBAC + break-glass) for that resource's `read` action.
- **Messaging** is **participant/self-scoped, NOT consent-scoped** — the messaging read surface lists a
  patient's threads only for a participant. If the timeline gated message entries by a *consent-domain*
  decision, a care-circle member with a broad grant would see message-activity metadata (existence,
  frequency, the org refs of threads with e.g. a psychiatry clinic) they could never get from the
  messaging surface — a **metadata leak through the timeline**. So message entries are visible only to
  the participant/self scope (in M6.5: the patient). Enforced by test: *a care-circle member with all
  consent domains granted still sees no message entries.*

### 3. Filter decisions vs. access decisions (avoid deny-audit noise)

A multi-domain surface makes MANY expected non-allow decisions per read (a viewer with one granted
domain "fails" the others by design). These are **filter outcomes, not access-attempt denials** — they
must NOT persist deny-audit rows (that would emit ~6 rows per page load forever and bury real
denials). So:

- **Access decision (audited, once):** whether the reader may read this patient's timeline AT ALL —
  `resolveDecideAndAuditAccess`, resource `timeline`. A denied timeline read deny-audits normally.
- **Filter decisions (decide-only, per domain, NOT persisted):** which domains' entries return —
  the decide-only evaluator (`resolveAndDecideResourceAccess` / the pure composition; no audit sink).

This **filter-vs-access** distinction is general and will recur on every multi-domain surface
(dashboards next). It is documented here as the pattern.

### 4. Payload-based projection (departure from care-circle's load-current-state), ADR-0010-conformant

Timeline entries are **immutable historical facts** ("an appointment was booked at T"), unlike the
Care Circle's *current* membership. So the consumer **folds each policy-matched event's reference-only
payload into one append-only entry** — the payload carries everything an entry needs
(patient/aggregate/org refs + occurredAt). Idempotent by `UNIQUE(source_event_ref)`; order-insensitive
(entries are independent; display sorts by `occurred_at`); no PHI; no FKs; staleness bound = the
dispatch SLO (seconds-to-low-minutes, never hours).

**A timeline is patient-keyed, so every included event MUST carry `patientRef` in its payload.** Build
finding (M6.5): 9 of the 23 included events did not — they and their command audits were extended with
a reference-only `patientRef` (additive, no PHI). This is now a **structural requirement**, enforced two
ways: (1) the consumer THROWS if a policy-matched event lacks `patientRef` (a regression surfaces via
retry/dead-letter, never a silently-dropped entry); (2) a **policy-guard test** asserts every
`TIMELINE_POLICY` event type carries `patientRef` in its payload — so a future timeline-included event
cannot reintroduce the gap. `TIMELINE_POLICY` (by event) and `TIMELINE_REBUILD_MAP` (by command) are
DERIVED from one `TIMELINE_ENTRY_KINDS` list, so they cannot diverge.

Inclusion is a curated **`TIMELINE_POLICY`** (mirroring `NOTIFICATION_POLICY`), **default-exclude**:
patient-meaningful care events in; system/identity/governance events out; **break-glass and
denied-access attempts never** (security audit — surfacing them leaks).

### 5. Rebuild from the append-only audit trail (pragmatic; coupling documented)

The outbox is drained (not a permanent event store), so rebuild re-derives entries from the
**append-only `audit_event` trail**, which permanently records every committed command
(`command_name` + `aggregate_id` + refs + `occurred_at`). Conditions (all required):

1. The **`commandName → timeline entry` rebuild map lives adjacent to `TIMELINE_POLICY`**, with a
   **drift test**: every included event type maps to a command and vice versa — policy and rebuild map
   cannot diverge silently.
2. **This coupling is a contract:** the audit `safeDetails.patientRef` + `aggregate_id` + `occurred_at`
   the rebuild consumes may not change without updating the rebuild map; the **rebuild-equivalence
   test** is the enforcement. Because the domain eventId is NOT in the audit row (command audits carry
   `audit_id`, not the event id) and `occurred_at` is set microseconds apart from the event's
   `createdAt` in the same transaction, incremental and rebuild entries legitimately differ in
   `source_event_ref` and `occurred_at`. **Equivalence is therefore by FACT** — the multiset of
   `(patient_ref, resource_domain, entry_type, aggregate_ref)` must match between the two paths — not
   by row identity. Rebuild is a reconcile (TRUNCATE + re-derive), using `audit_id` as `source_event_ref`.
3. **Not the endorsed end state:** if a durable event archive ever exists (e.g. a retained outbox),
   rebuild should migrate to it. Audit-as-archive is the pragmatic choice for now.
4. **Historical gap (KL-003):** events and audit rows written before the `patientRef` fix lack it for
   the 9 late-added types. As this is a dev/test-stage platform (no production data), the accepted
   position is (ii): pre-fix entries of those 9 types are absent from a rebuild — recorded in
   `known-limitations.md` KL-003 — rather than a one-time legacy aggregate-lookup backfill branch.

## Retention & volume

Entries are minimal references (no content), so per-patient growth is bounded by event count, not
payload size — **retained indefinitely, online** (a longitudinal timeline is the product value; not
purged like notifications). Reads are **cursor-paginated** (`(occurred_at DESC, entry_id)`, hard
page-size cap); index `(patient_ref, occurred_at DESC)`. **Archival mechanism defined up front:**
partition by `occurred_at` (yearly); cold-archive partitions older than ~7 years when volume warrants.

## Invariants preserved

Projection-is-DATA-never-authz-cache; no-PHI (refs + labels only); context isolation (soft refs, no
FKs); default-exclude inclusion policy; immediate revocation propagation (filter decisions are live);
append-only auditability (the timeline read is access-audited once). Consent invariant untouched —
filtering reads live per domain.

## Consequences

- Positive: one projection, live per-domain gating with no stale-grant leakage; the messaging
  decision-kind match closes a metadata leak; filter-vs-access keeps the audit trail signal-clean; the
  rebuild reuses the durable audit log.
- Negative / follow-ups: domain-level (not entry-level) gating (revisit when grants get finer); the
  audit-as-archive coupling (migrate to a durable event archive if one appears); per-read domain
  decisions (bounded ≤ number of domains, batched one-per-domain).

## Related documents

`docs/adr/ADR-0010-event-consumer-projection-pattern.md`,
`docs/adr/ADR-0012-derived-authority-and-operational-write-authorization.md`,
`apps/api/src/access-audit.ts` (audited vs decide-only paths),
`packages/database/src/notification-repository.ts` (`NOTIFICATION_POLICY` curated-policy precedent).
