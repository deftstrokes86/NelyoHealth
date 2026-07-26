-- Timeline / activity stream projection (roadmap M6.5, ADR-0013).
--
-- A per-patient chronological feed of patient-meaningful care events, maintained
-- by the timeline projection consumer (a dispatcher subscriber that folds curated
-- domain events into append-only entries). REFERENCES ONLY — no PHI, no clinical
-- content: the client renders "a prescription was issued" from entry_type + refs,
-- and fetches details from the owning resource on read, through the full pipeline.
--
-- Reader filtering is at READ time (ADR-0013): a single projection, gated per
-- resource_domain by the reader's live decision for that domain's own read path.
-- So the projection is eventually-consistent DATA, never an authorization cache.
--
-- Context isolation: patient/aggregate/organization are soft UUID references — NO
-- foreign keys — so the projection is independently rebuildable and drops without
-- affecting sources.
--
-- Idempotency: UNIQUE (source_event_ref) — under at-least-once redelivery, one
-- entry per triggering domain event.

CREATE SCHEMA IF NOT EXISTS nelyo_timeline;

CREATE TABLE nelyo_timeline.timeline_entry (
  entry_id UUID PRIMARY KEY,
  -- The triggering domain eventId (idempotency + traceability).
  source_event_ref UUID NOT NULL,
  patient_ref UUID NOT NULL,
  -- The reader-filtering unit: which domain's read path gates this entry.
  resource_domain TEXT NOT NULL CHECK (resource_domain IN (
    'appointment', 'consultation', 'medication', 'lab', 'clinical-record',
    'document', 'message'
  )),
  -- Category the client renders from (e.g. 'appointment-booked'); never content.
  entry_type TEXT NOT NULL,
  -- The domain aggregate the entry concerns (for deep-linking / gated read).
  aggregate_ref UUID NOT NULL,
  organization_ref UUID,
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_event_ref)
);

-- The patient's feed, newest first (cursor-paginated on (occurred_at, entry_id)).
CREATE INDEX timeline_entry_patient_idx
  ON nelyo_timeline.timeline_entry (patient_ref, occurred_at DESC, entry_id DESC);
