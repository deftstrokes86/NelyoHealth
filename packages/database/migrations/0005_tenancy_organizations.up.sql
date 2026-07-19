-- Organizations & Facilities bounded context — tenancy persistence (roadmap M2.1).
-- Owns: Organization, Facility, OrganizationMembership, RoleAssignment, Invitation.
-- Contract source: packages/domain/src/identity-tenancy-model.ts.
--
-- Context isolation (domain-boundaries.md): this context must not FK into
-- nelyo_identity. Cross-context links (membership.person_id,
-- invitation.invited_by_person_id) are SOFT uuid references validated at the
-- application layer, never database foreign keys.
--
-- Note on session.active_tenant_id (nelyo_identity, migration 0004): it stays
-- a SOFT reference, not a hard FK into this schema. A hard cross-schema FK
-- would couple the Identity context to the Tenancy context and violate the
-- isolation canon; "Personal" workspace is activeTenantId = NULL, a non-null
-- value references an Organization here. The M2.2 ActingContext resolver
-- validates the reference. (This supersedes the 0004 header note.)
--
-- OrganizationMembership.activeRoleAssignmentIds is DERIVED (read model over
-- role_assignment where status = 'active'); it is never persisted.

CREATE SCHEMA IF NOT EXISTS nelyo_tenancy;

CREATE TABLE nelyo_tenancy.organization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'offboarded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE nelyo_tenancy.facility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES nelyo_tenancy.organization (id) ON DELETE RESTRICT,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'offboarded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Enables the composite tenant-consistency FK from role_assignment.
  CONSTRAINT facility_id_org_unique UNIQUE (id, organization_id)
);

CREATE INDEX facility_org_idx ON nelyo_tenancy.facility (organization_id);

-- person_id: soft reference to nelyo_identity.person (no cross-schema FK).
CREATE TABLE nelyo_tenancy.organization_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES nelyo_tenancy.organization (id) ON DELETE RESTRICT,
  person_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'invited'
    CHECK (status IN ('invited', 'active', 'suspended', 'offboarded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT membership_unique_per_person_org UNIQUE (organization_id, person_id),
  -- Enables the composite tenant-consistency FK from role_assignment.
  CONSTRAINT membership_id_org_unique UNIQUE (id, organization_id)
);

CREATE INDEX membership_person_idx ON nelyo_tenancy.organization_membership (person_id);

-- role_code is a soft capability code (no role registry table — the Capability
-- and Resource registries were removed as over-abstraction). Composite FKs
-- guarantee a role's facility and membership belong to the SAME organization.
CREATE TABLE nelyo_tenancy.role_assignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES nelyo_tenancy.organization (id) ON DELETE RESTRICT,
  facility_id UUID,
  membership_id UUID NOT NULL,
  role_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT role_assignment_membership_org_fk
    FOREIGN KEY (membership_id, organization_id)
    REFERENCES nelyo_tenancy.organization_membership (id, organization_id) ON DELETE RESTRICT,
  -- facility_id NULL => org-scoped role (MATCH SIMPLE skips the check);
  -- non-null must match the same organization.
  CONSTRAINT role_assignment_facility_org_fk
    FOREIGN KEY (facility_id, organization_id)
    REFERENCES nelyo_tenancy.facility (id, organization_id) ON DELETE RESTRICT
);

CREATE INDEX role_assignment_membership_idx
  ON nelyo_tenancy.role_assignment (membership_id);
CREATE INDEX role_assignment_active_membership_idx
  ON nelyo_tenancy.role_assignment (membership_id)
  WHERE status = 'active';

-- invited_by_person_id: soft reference to nelyo_identity.person.
CREATE TABLE nelyo_tenancy.invitation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES nelyo_tenancy.organization (id) ON DELETE RESTRICT,
  invited_by_person_id UUID NOT NULL,
  invited_email TEXT,
  invited_phone_e164 TEXT,
  role_codes TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT invitation_target_present
    CHECK (invited_email IS NOT NULL OR invited_phone_e164 IS NOT NULL)
);

CREATE INDEX invitation_org_idx ON nelyo_tenancy.invitation (organization_id);

-- Address completes the M1.1 deferral. Person-scoped and identity-owned; the
-- domain's optional organizationId is NOT modeled here — organization/facility
-- location is governed location data (REQ-LOCK-004, precise location protected
-- pre-payment) and lands with the tenancy location work, not as a plain column.
CREATE TABLE nelyo_identity.address (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES nelyo_identity.person (id) ON DELETE RESTRICT,
  line1 TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country_code TEXT NOT NULL,
  postal_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX address_person_idx ON nelyo_identity.address (person_id);

ALTER TABLE nelyo_identity.person
  ADD COLUMN primary_address_id UUID;

ALTER TABLE nelyo_identity.person
  ADD CONSTRAINT person_primary_address_fk
  FOREIGN KEY (primary_address_id)
  REFERENCES nelyo_identity.address (id)
  ON DELETE SET NULL;
