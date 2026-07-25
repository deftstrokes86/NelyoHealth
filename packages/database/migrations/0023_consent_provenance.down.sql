-- Reverse 0023_consent_provenance.
ALTER TABLE nelyo_consent.consent_version
  DROP COLUMN provenance;
