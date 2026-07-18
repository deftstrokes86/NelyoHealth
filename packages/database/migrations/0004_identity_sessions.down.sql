-- Roll back 0004_identity_sessions. The nelyo_identity schema itself is
-- owned by 0003_identity_access and is not dropped here.

DROP INDEX IF EXISTS nelyo_identity.authentication_event_account_idx;
DROP TABLE IF EXISTS nelyo_identity.authentication_event;

DROP INDEX IF EXISTS nelyo_identity.session_account_active_idx;
DROP INDEX IF EXISTS nelyo_identity.session_account_idx;
DROP TABLE IF EXISTS nelyo_identity.session;

DROP INDEX IF EXISTS nelyo_identity.device_account_idx;
DROP TABLE IF EXISTS nelyo_identity.device;
