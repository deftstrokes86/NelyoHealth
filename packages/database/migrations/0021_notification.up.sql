-- Notification orchestration store (roadmap M6.2 — Derived Read Models & Event-Driven Layer).
--
-- A MINIMIZED delivery-record store for notifications produced by the
-- notification orchestration consumer (a dispatcher subscriber that turns
-- selected domain events into reference-only messages via the communications
-- port). Per the M6.2 design (Principle 12): this holds REFERENCES + delivery
-- METADATA only — never a rendered body, never PHI. The client renders a
-- localized "You have a new X" from notification_type + refs; the actual content
-- is fetched from the owning resource on read, through the full pipeline.
--
-- Context isolation: recipient/patient/organization/target are soft UUID
-- references — NO foreign keys at all (a single-record resource), so it is
-- independently rebuildable and isolated.
--
-- Idempotency: UNIQUE (event_ref, recipient_actor_ref, channel) — under
-- at-least-once event redelivery, at most one notification per triggering event
-- per recipient per channel (no double-notify).

CREATE SCHEMA IF NOT EXISTS nelyo_notification;

CREATE TABLE nelyo_notification.notification (
  notification_id UUID PRIMARY KEY,
  -- The triggering domain eventId (traceability + idempotency).
  event_ref UUID NOT NULL,
  -- Category the client renders from (e.g. 'appointment-booked'); never content.
  notification_type TEXT NOT NULL,
  recipient_actor_ref UUID NOT NULL,
  patient_ref UUID,
  organization_ref UUID,
  -- The domain aggregate the notification concerns (for deep-linking on read).
  target_ref UUID,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  -- Reference-only template id; the rendered body never touches this store.
  template_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
  provider_message_ref TEXT,
  failure_reason_code TEXT,
  read_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_ref, recipient_actor_ref, channel)
);

-- A recipient's notification feed ("my notifications"), newest first.
CREATE INDEX notification_recipient_idx
  ON nelyo_notification.notification (recipient_actor_ref, created_at DESC);

-- Notifications concerning a patient (governance / patient-subject listing).
CREATE INDEX notification_patient_org_idx
  ON nelyo_notification.notification (patient_ref, organization_ref);

-- Recovery sweep target: records still awaiting or failed delivery.
CREATE INDEX notification_status_idx
  ON nelyo_notification.notification (status)
  WHERE status IN ('queued', 'failed');
