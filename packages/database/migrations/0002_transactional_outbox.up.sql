CREATE TABLE IF NOT EXISTS nelyo_foundation.transactional_outbox (
  event_id UUID PRIMARY KEY,
  event_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  correlation_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  operation_tag TEXT NOT NULL,
  payload_json JSONB NOT NULL,
  dispatch_status TEXT NOT NULL DEFAULT 'pending' CHECK (dispatch_status IN ('pending', 'dispatched', 'dead-lettered')),
  dispatch_attempts INTEGER NOT NULL DEFAULT 0 CHECK (dispatch_attempts >= 0),
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dispatched_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_transactional_outbox_pending_created
  ON nelyo_foundation.transactional_outbox (dispatch_status, created_at);
