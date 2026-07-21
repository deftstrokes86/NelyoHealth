DROP INDEX IF EXISTS nelyo_foundation.audit_event_event_id_unique;
ALTER TABLE nelyo_foundation.audit_event DROP COLUMN IF EXISTS event_id;
ALTER TABLE nelyo_foundation.audit_event DROP COLUMN IF EXISTS source;
