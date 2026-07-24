-- Reverse 0022_notification_retry.

DROP INDEX IF EXISTS nelyo_notification.notification_retry_idx;

-- Reject any dead-lettered rows before narrowing the constraint would fail; move
-- them back to 'failed' so the down-migration is total.
UPDATE nelyo_notification.notification SET status = 'failed' WHERE status = 'dead-lettered';

ALTER TABLE nelyo_notification.notification
  DROP CONSTRAINT notification_status_check;
ALTER TABLE nelyo_notification.notification
  ADD CONSTRAINT notification_status_check
  CHECK (status IN ('queued', 'sent', 'failed'));

ALTER TABLE nelyo_notification.notification
  DROP COLUMN attempt_count,
  DROP COLUMN next_attempt_at,
  DROP COLUMN dead_lettered_at;
