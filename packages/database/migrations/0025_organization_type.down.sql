-- Rollback: organization type (roadmap M8.3e).
--
-- Dropping the column returns the runtime to a single organization workspace; the
-- composition resolver falls back to its fail-closed path rather than misreading a
-- missing type as a hospital.

DROP INDEX IF EXISTS nelyo_tenancy.organization_type_idx;

ALTER TABLE nelyo_tenancy.organization
  DROP COLUMN IF EXISTS organization_type;
