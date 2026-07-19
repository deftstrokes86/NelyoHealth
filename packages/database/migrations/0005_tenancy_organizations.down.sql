-- Roll back 0005_tenancy_organizations. Reverses in dependency order and
-- restores nelyo_identity.person to its post-0004 shape.

ALTER TABLE nelyo_identity.person
  DROP CONSTRAINT IF EXISTS person_primary_address_fk;
ALTER TABLE nelyo_identity.person
  DROP COLUMN IF EXISTS primary_address_id;

DROP INDEX IF EXISTS nelyo_identity.address_person_idx;
DROP TABLE IF EXISTS nelyo_identity.address;

DROP INDEX IF EXISTS nelyo_tenancy.invitation_org_idx;
DROP TABLE IF EXISTS nelyo_tenancy.invitation;

DROP INDEX IF EXISTS nelyo_tenancy.role_assignment_active_membership_idx;
DROP INDEX IF EXISTS nelyo_tenancy.role_assignment_membership_idx;
DROP TABLE IF EXISTS nelyo_tenancy.role_assignment;

DROP INDEX IF EXISTS nelyo_tenancy.membership_person_idx;
DROP TABLE IF EXISTS nelyo_tenancy.organization_membership;

DROP INDEX IF EXISTS nelyo_tenancy.facility_org_idx;
DROP TABLE IF EXISTS nelyo_tenancy.facility;

DROP TABLE IF EXISTS nelyo_tenancy.organization;

DROP SCHEMA IF EXISTS nelyo_tenancy;
