-- Foundation audit intent (roadmap M3.1 — Transactional Command).
--
-- Every state-changing command writes state + outbox + audit intent in ONE
-- transaction (architecture-evolution-report.md). This is the persisted
-- audit-intent store: the compliance-critical "this command happened, by
-- whom, with what outcome" record, committed atomically with the state it
-- describes so it can never drift from reality.
--
-- Reference-only, no PHI: reference columns hold ids/labels and safe_details
-- is guarded against protected-body keys at write time (the domain
-- FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS list). This is NOT the rich clinical
-- audit model (apps/api audit-event-workflows) — the M3.2 "unified audit"
-- consolidates the two.
--
-- Append-only by construction: the repository exposes only insert + read.
-- Production hardening (revoking UPDATE/DELETE from the application role) is
-- an ops follow-up; a hard trigger is intentionally omitted here so test
-- fixtures can clean up their own run-scoped rows.

CREATE TABLE nelyo_foundation.audit_event (
  audit_id UUID PRIMARY KEY,
  command_name TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  action TEXT NOT NULL,
  outcome TEXT NOT NULL,
  actor_account_ref TEXT NOT NULL,
  actor_persona_kind TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  tenant_ref TEXT,
  correlation_id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  safe_details JSONB NOT NULL DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_event_aggregate_idx
  ON nelyo_foundation.audit_event (aggregate_id, occurred_at DESC);
CREATE INDEX audit_event_correlation_idx
  ON nelyo_foundation.audit_event (correlation_id);
CREATE INDEX audit_event_actor_idx
  ON nelyo_foundation.audit_event (actor_account_ref, occurred_at DESC);
