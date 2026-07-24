-- Notification delivery reliability hardening (roadmap M6.2 review, items 1-2).
--
-- Adds the state a bounded recovery sweep needs so a failed send does not either
-- (a) retry forever or (b) die silently:
--   * attempt_count      — how many delivery attempts have been made;
--   * next_attempt_at     — earliest time the sweep may re-attempt (exponential
--                           backoff), so repeatedly-failing records back off;
--   * dead_lettered_at    — terminal-state timestamp; at max attempts the record
--                           moves to 'dead-lettered' and is never retried again
--                           (a NotificationDeadLettered event is the alert signal).
--
-- The 'dead-lettered' terminal status is added to the status CHECK. No PHI is
-- introduced; these are delivery-control columns only.

ALTER TABLE nelyo_notification.notification
  ADD COLUMN attempt_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN next_attempt_at TIMESTAMPTZ,
  ADD COLUMN dead_lettered_at TIMESTAMPTZ;

ALTER TABLE nelyo_notification.notification
  DROP CONSTRAINT notification_status_check;
ALTER TABLE nelyo_notification.notification
  ADD CONSTRAINT notification_status_check
  CHECK (status IN ('queued', 'sent', 'failed', 'dead-lettered'));

-- Sweep target: failed records whose backoff has elapsed (or was never set).
CREATE INDEX notification_retry_idx
  ON nelyo_notification.notification (next_attempt_at)
  WHERE status = 'failed';
