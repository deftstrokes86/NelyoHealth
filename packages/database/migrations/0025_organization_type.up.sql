-- Organization type (roadmap M8.3e).
--
-- Until now the runtime mapped EVERY organization workspace to "hospital" because the
-- Tenancy context carried no type. That hardcoded mapping is what made the Platform
-- Registry's claim — "organization types differ only in registry data, never in code
-- branches" — untrue at runtime.
--
-- This column IS the runtime mapping: its value is a Workspace Registry id of kind
-- `organization`, so resolving a workspace is a lookup, not a branch. Adding a new
-- organization type is then a registry entry plus a CHECK-constraint value — no
-- composition code changes.
--
-- Default 'hospital' preserves the behaviour every existing row already had, so the
-- migration is non-breaking for seeded and production data alike.

ALTER TABLE nelyo_tenancy.organization
  ADD COLUMN organization_type TEXT NOT NULL DEFAULT 'hospital'
    CHECK (organization_type IN (
      'hospital',
      'pharmacy',
      'laboratory',
      'employer',
      'insurer',
      'ngo',
      'government'
    ));

-- Workspace resolution reads this column on every organization-context request.
CREATE INDEX organization_type_idx ON nelyo_tenancy.organization (organization_type);

COMMENT ON COLUMN nelyo_tenancy.organization.organization_type IS
  'Workspace Registry id (kind=organization) this organization composes as. See ADR-0016 / M8.3e.';
