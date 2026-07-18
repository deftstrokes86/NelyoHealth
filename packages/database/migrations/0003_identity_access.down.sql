-- Roll back 0003_identity_access. Drops only objects owned by this
-- migration; schema drop is non-cascading so later migrations' objects
-- (if any remain) fail loudly instead of being destroyed silently.

DROP INDEX IF EXISTS nelyo_identity.external_identity_account_idx;
DROP INDEX IF EXISTS nelyo_identity.contact_point_person_idx;

DROP TABLE IF EXISTS nelyo_identity.external_identity;
DROP TABLE IF EXISTS nelyo_identity.user_account;

ALTER TABLE IF EXISTS nelyo_identity.person
  DROP CONSTRAINT IF EXISTS person_primary_contact_point_fk;

DROP TABLE IF EXISTS nelyo_identity.contact_point;
DROP TABLE IF EXISTS nelyo_identity.person;

DROP SCHEMA IF EXISTS nelyo_identity;
