-- Unified audit (roadmap M3.2 — Dispatcher + Unified Audit).
--
-- M3.1 made nelyo_foundation.audit_event the persisted audit-intent store for
-- COMMANDS (state + outbox + audit in one TX). M3.2 makes it the single
-- unified audit store by also letting the dispatcher's audit subscriber record
-- DISPATCHED DOMAIN EVENTS into the same table ("audit is a subscriber to the
-- event stream" — architecture-evolution-report.md). Both sources are queried
-- together and distinguished by `source`.
--
-- source:   'command'        — the in-TX command audit intent (M3.1).
--           'event-dispatch' — a business event delivered by the dispatcher.
-- event_id: set only for 'event-dispatch' rows; the partial UNIQUE index makes
--           the audit consumer idempotent under at-least-once redelivery
--           (dispatching the same event twice records exactly one audit row).

ALTER TABLE nelyo_foundation.audit_event
  ADD COLUMN source TEXT NOT NULL DEFAULT 'command'
    CHECK (source IN ('command', 'event-dispatch'));

ALTER TABLE nelyo_foundation.audit_event
  ADD COLUMN event_id UUID;

CREATE UNIQUE INDEX audit_event_event_id_unique
  ON nelyo_foundation.audit_event (event_id)
  WHERE event_id IS NOT NULL;
