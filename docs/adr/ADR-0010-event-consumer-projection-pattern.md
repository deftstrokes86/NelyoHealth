# ADR-0010: Event-consumer projection pattern (load-current-state)

## Status

ACCEPTED (roadmap M6.1). Referenced by M6.2 (Notifications) and M6.3 (Timeline/Activity Stream).

## Date

2026-07-25

## Decision owner

Architecture owner (Lead Platform Engineer), under Chief Architect review of M6.1.

## Context

Every authoritative resource (M5.1–M5.8) emits canonical, reference-only (no-PHI) domain events
through the transactional outbox. The dispatcher (`dispatchPendingOutboxEvents`,
`packages/database/src/transaction-outbox.ts`) fans each dispatched event out to a set of named
`DomainEventConsumer`s with **all-succeed-or-retry** semantics: an event is marked `dispatched` only
when EVERY consumer accepts it; if any consumer throws, the whole event is retried and **re-offered
to all consumers** up to `maxAttempts`, then dead-lettered. Consumers must therefore be **idempotent
keyed by `eventId`**.

The M6 arc introduces DERIVED READ MODELS built as new consumers: the Care Circle read model (M6.1),
notification delivery state (M6.2), and the patient/workspace timeline (M6.3). We need one agreed way
to build such a projection.

## Decision

Build read-model projections with the **load-current-state** strategy:

> On each relevant domain event, treat the event as a **trigger**: load the authoritative aggregate
> by `event.aggregateId`, then **upsert** the read-model row to reflect the aggregate's CURRENT state
> (or delete the row if the aggregate is gone). No-op on irrelevant event types.

Reference implementation: `createCareCircleProjectionConsumer` in
`packages/database/src/care-circle-repository.ts`, wired into the worker dispatcher alongside
`createAuditTrailConsumer` (`apps/worker/src/main.ts`).

## Decision drivers

- **Idempotency under at-least-once redelivery.** Re-applying an event re-reads the same authoritative
  state and upserts the same row (`ON CONFLICT DO UPDATE`) — a no-op in effect. This is mandatory
  given the dispatcher re-offers events to all consumers on any consumer's failure.
- **Order-insensitivity.** Because the projection always reflects current authoritative state, an
  out-of-order or late redelivery converges correctly (last read wins, and the source is
  authoritative), removing the need for per-aggregate sequence/gap tracking.
- **No-PHI, reference-only event payloads.** By the frozen event-envelope contract
  (`packages/domain/src/platform-events.ts`), payloads carry ids/labels, never full aggregate state.
  A projection that must reconstruct full state therefore cannot fold payloads alone — it must load the
  aggregate. Load-current-state makes this a feature, not a workaround.
- **Rebuildability.** Because the projection mirrors current state (not an event-sourced fold), it
  rebuilds from the SOURCE TABLE, not the event log (see Rebuild contract).

## Alternatives considered

- **Payload-only event-sourced fold** (apply each event's delta to the read model). Rejected:
  (a) reference-only payloads omit the lifecycle detail needed to reconstruct full state; (b) folds
  require strict ordering and gap detection; (c) rebuild would require replaying the entire event log
  rather than reading current source.
- **No read model; query the source live on every read.** Rejected for the queries a read model
  exists to serve (e.g. Care Circle's bidirectional "members of patient P" / "wards of actor A", which
  the source relationship table does not index).

## The projection is DATA, never an authorization input (staleness boundary)

This is the load-bearing constraint. A projection is **eventually-consistent resource DATA**; it MUST
NOT participate in any allow/deny decision.

- Every access decision — including the read of the projection itself, and any downstream resource
  access by a projected subject — is made by the authoritative composed pipeline
  (`resolveAndDecideResourceAccess`), which reads consent, the relationship graph, and break-glass
  **live** from their authoritative tables. Verified for M6.1: `readPatientCareCircle` decides first
  (authoritative), then reads the projection only on an allow, purely to populate the returned list.
- Consequence: even an indefinitely-stale or dead-lettered projection causes **no access-control
  breach** — a revoked guardian is denied at the PDP immediately, regardless of projection state. The
  only effect of staleness is bounded freshness of displayed data.

**Staleness SLO for displayed data.** Normal operation: a lifecycle event flips the projection within
~one dispatch interval plus batch processing — `WORKER_OUTBOX_DISPATCH_MS` defaults to 2s, per-event
cost is a single indexed load + upsert, so **≤ ~5 seconds** typical. Under backlog: bounded by
backlog-depth / throughput (seconds-to-low-minutes). The SLO target is **seconds-to-low-minutes, never
hours**; "never hours" is enforced by dead-letter alerting + rebuild (below), not by the read path.

## Failure handling

- **Retry / dead-letter.** A throwing consumer retries to `WORKER_OUTBOX_MAX_ATTEMPTS` (default 5),
  then the event is dead-lettered (`markDeadLettered`) and no longer redelivered. A dead-lettered
  lifecycle event leaves that one aggregate's projection stale until corrected.
- **Alerting.** The worker already emits per-cycle dispatch stats (`retried`, `deadLettered`) via
  structured logs (`apps/worker/src/outbox-dispatch.ts`). Required (observability/ops track): threshold
  alerts on `deadLettered` count and on outbox backlog depth (pending-event age), so a stalled or
  failing consumer is detected well within the "never hours" bound.
- **Recovery.** Rebuild (below) re-derives the projection from the authoritative source, correcting any
  stale or dead-lettered rows. It is the operator/scheduled recovery path — never invoked on the read
  path.

## Rebuild contract (mandatory for every projection built with this pattern)

A projection built with load-current-state MUST provide a batch **rebuild** that re-derives it from the
authoritative SOURCE table (the batch analog of the consumer's per-event load), producing state
**identical to incremental projection**. It is a non-destructive reconcile: upsert every source
aggregate's row, then delete rows whose source aggregate no longer exists.

Reference: `rebuildCareCircleProjection` (`care-circle-repository.ts`) reconciles
`nelyo_care_circle.care_circle_member` against `nelyo_relationship.relationship`. Proven by the
integration test "rebuilds the projection from the authoritative source, correcting stale/missing rows"
(`tests/integration/database-care-circle.spec.ts`): the projection is corrupted (a row dropped, another
flipped to a wrong status), rebuilt, and asserted equal to the incrementally-projected state.

M6.2 and M6.3 each ship their own rebuild + rebuild-equivalence test.

## Security / privacy implications

The read model stores references + non-clinical labels only — no PHI (M6.1: relationship refs +
capability labels). Consumers emit nothing to external systems on this path (M6.2 adds external sends,
which carry no PHI and emit their own audit events — see the M6.2 design). Context isolation holds: the
read-model schema has soft refs and no foreign keys, so it is independently rebuildable and drops
without affecting sources.

## Operational implications

Each projection consumer is appended to the worker's dispatcher `consumers` array. Adding one adds one
indexed load + upsert per relevant event (no-op on others). Requires the dead-letter/backlog alerting
above and the rebuild path for recovery.

## Consequences

- Positive: uniform, idempotent, order-insensitive, rebuildable projections; the invariant
  "read models are never an authorization cache" is preserved by construction; the pattern scales to
  M6.2/M6.3 unchanged.
- Negative: displayed read-model data is eventually consistent (bounded by the SLO); dead-letter
  alerting + a periodic/triggered rebuild are operational obligations, not optional.

## Supersession rule

This ADR may be refined or superseded only by a later ADR that explicitly names it and preserves
history.

## Related documents

`docs/adr/ADR-0006-person-and-longitudinal-patient-identity.md`,
`docs/adr/ADR-0008-finalized-clinical-record-amendments.md`,
`docs/architecture/architecture-evolution-report.md` (the derived-layer surfaces),
`docs/architecture/patient-profile-write-authorization-hardening.md`.
