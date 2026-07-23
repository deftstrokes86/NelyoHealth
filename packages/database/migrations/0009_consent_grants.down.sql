-- Rollback consent persistence (roadmap M4.1).
DROP TABLE IF EXISTS nelyo_consent.consent_version;
DROP TABLE IF EXISTS nelyo_consent.consent_record;
DROP SCHEMA IF EXISTS nelyo_consent;
