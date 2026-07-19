import type { ClientBase } from "pg";
import type {
  Facility,
  Invitation,
  Organization,
  OrganizationMembership,
  RoleAssignment
} from "@nelyohealth/domain";
import { DuplicateIdentityError } from "./identity-repository.js";

/**
 * Organizations & Facilities repository (roadmap M2.1).
 *
 * Owns SQL for the nelyo_tenancy schema. Client-parameterized so callers
 * control the transaction boundary (from M3.x mutations run inside the
 * transactional-command path). Cross-context links (person ids) are soft
 * references — this context never FKs into nelyo_identity.
 *
 * OrganizationMembership.activeRoleAssignmentIds is DERIVED here (a read model
 * over role_assignment where status = 'active'), never stored.
 */

function rethrowDuplicate(error: unknown): never {
  const pgError = error as { code?: string; constraint?: string };
  if (pgError?.code === "23505") {
    throw new DuplicateIdentityError(
      pgError.constraint ?? "unknown-constraint",
      `Tenancy uniqueness violated (${pgError.constraint ?? "unknown constraint"}).`
    );
  }
  throw error;
}

interface OrganizationRow {
  id: string;
  legal_name: string;
  display_name: string;
  status: Organization["status"];
}

interface FacilityRow {
  id: string;
  organization_id: string;
  display_name: string;
  status: Facility["status"];
}

interface MembershipRow {
  id: string;
  organization_id: string;
  person_id: string;
  status: OrganizationMembership["status"];
  active_role_assignment_ids: string[] | null;
}

interface RoleAssignmentRow {
  id: string;
  organization_id: string;
  facility_id: string | null;
  membership_id: string;
  role_code: string;
  status: RoleAssignment["status"];
}

interface InvitationRow {
  id: string;
  organization_id: string;
  invited_by_person_id: string;
  invited_email: string | null;
  invited_phone_e164: string | null;
  role_codes: string[];
  status: Invitation["status"];
}

// Derives activeRoleAssignmentIds inline so a membership always carries its
// active roles as a read model (never a persisted column).
const MEMBERSHIP_SELECT = `
  m.id, m.organization_id, m.person_id, m.status,
  COALESCE(
    ARRAY(
      SELECT r.id FROM nelyo_tenancy.role_assignment r
      WHERE r.membership_id = m.id AND r.status = 'active'
      ORDER BY r.created_at ASC
    ),
    '{}'
  ) AS active_role_assignment_ids
`;

function mapOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    legalName: row.legal_name,
    displayName: row.display_name,
    status: row.status
  };
}

function mapFacility(row: FacilityRow): Facility {
  return {
    id: row.id,
    organizationId: row.organization_id,
    displayName: row.display_name,
    status: row.status
  };
}

function mapMembership(row: MembershipRow): OrganizationMembership {
  return {
    id: row.id,
    organizationId: row.organization_id,
    personId: row.person_id,
    status: row.status,
    activeRoleAssignmentIds: row.active_role_assignment_ids ?? []
  };
}

function mapRoleAssignment(row: RoleAssignmentRow): RoleAssignment {
  return {
    id: row.id,
    organizationId: row.organization_id,
    facilityId: row.facility_id ?? undefined,
    membershipId: row.membership_id,
    roleCode: row.role_code,
    status: row.status
  };
}

function mapInvitation(row: InvitationRow): Invitation {
  return {
    id: row.id,
    organizationId: row.organization_id,
    invitedByPersonId: row.invited_by_person_id,
    invitedEmail: row.invited_email ?? undefined,
    invitedPhoneE164: row.invited_phone_e164 ?? undefined,
    roleCodes: row.role_codes,
    status: row.status
  };
}

// ---------- Organization ----------

export async function createOrganization(
  client: ClientBase,
  input: { legalName: string; displayName: string; status?: Organization["status"] }
): Promise<Organization> {
  const result = await client.query<OrganizationRow>(
    `INSERT INTO nelyo_tenancy.organization (legal_name, display_name, status)
     VALUES ($1, $2, COALESCE($3, 'active'))
     RETURNING id, legal_name, display_name, status`,
    [input.legalName, input.displayName, input.status ?? null]
  );
  return mapOrganization(result.rows[0]);
}

export async function getOrganizationById(
  client: ClientBase,
  organizationId: string
): Promise<Organization | null> {
  const result = await client.query<OrganizationRow>(
    `SELECT id, legal_name, display_name, status
     FROM nelyo_tenancy.organization WHERE id = $1`,
    [organizationId]
  );
  return result.rows[0] ? mapOrganization(result.rows[0]) : null;
}

export async function updateOrganizationStatus(
  client: ClientBase,
  organizationId: string,
  status: Organization["status"]
): Promise<Organization | null> {
  const result = await client.query<OrganizationRow>(
    `UPDATE nelyo_tenancy.organization
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, legal_name, display_name, status`,
    [organizationId, status]
  );
  return result.rows[0] ? mapOrganization(result.rows[0]) : null;
}

// ---------- Facility ----------

export async function createFacility(
  client: ClientBase,
  input: { organizationId: string; displayName: string; status?: Facility["status"] }
): Promise<Facility> {
  const result = await client.query<FacilityRow>(
    `INSERT INTO nelyo_tenancy.facility (organization_id, display_name, status)
     VALUES ($1, $2, COALESCE($3, 'active'))
     RETURNING id, organization_id, display_name, status`,
    [input.organizationId, input.displayName, input.status ?? null]
  );
  return mapFacility(result.rows[0]);
}

export async function listFacilitiesForOrganization(
  client: ClientBase,
  organizationId: string
): Promise<Facility[]> {
  const result = await client.query<FacilityRow>(
    `SELECT id, organization_id, display_name, status
     FROM nelyo_tenancy.facility
     WHERE organization_id = $1
     ORDER BY created_at ASC`,
    [organizationId]
  );
  return result.rows.map(mapFacility);
}

// ---------- OrganizationMembership ----------

export async function createMembership(
  client: ClientBase,
  input: {
    organizationId: string;
    personId: string;
    status?: OrganizationMembership["status"];
  }
): Promise<OrganizationMembership> {
  try {
    const result = await client.query<MembershipRow>(
      `WITH inserted AS (
         INSERT INTO nelyo_tenancy.organization_membership (organization_id, person_id, status)
         VALUES ($1, $2, COALESCE($3, 'invited'))
         RETURNING id, organization_id, person_id, status
       )
       SELECT ${MEMBERSHIP_SELECT} FROM inserted m`,
      [input.organizationId, input.personId, input.status ?? null]
    );
    return mapMembership(result.rows[0]);
  } catch (error) {
    rethrowDuplicate(error);
  }
}

export async function getMembershipById(
  client: ClientBase,
  membershipId: string
): Promise<OrganizationMembership | null> {
  const result = await client.query<MembershipRow>(
    `SELECT ${MEMBERSHIP_SELECT}
     FROM nelyo_tenancy.organization_membership m
     WHERE m.id = $1`,
    [membershipId]
  );
  return result.rows[0] ? mapMembership(result.rows[0]) : null;
}

export async function listMembershipsForPerson(
  client: ClientBase,
  personId: string
): Promise<OrganizationMembership[]> {
  const result = await client.query<MembershipRow>(
    `SELECT ${MEMBERSHIP_SELECT}
     FROM nelyo_tenancy.organization_membership m
     WHERE m.person_id = $1
     ORDER BY m.created_at ASC`,
    [personId]
  );
  return result.rows.map(mapMembership);
}

export async function updateMembershipStatus(
  client: ClientBase,
  membershipId: string,
  status: OrganizationMembership["status"]
): Promise<OrganizationMembership | null> {
  const result = await client.query<MembershipRow>(
    `WITH updated AS (
       UPDATE nelyo_tenancy.organization_membership
       SET status = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, organization_id, person_id, status
     )
     SELECT ${MEMBERSHIP_SELECT} FROM updated m`,
    [membershipId, status]
  );
  return result.rows[0] ? mapMembership(result.rows[0]) : null;
}

// ---------- RoleAssignment ----------

export async function assignRole(
  client: ClientBase,
  input: {
    organizationId: string;
    membershipId: string;
    roleCode: string;
    facilityId?: string;
    status?: RoleAssignment["status"];
  }
): Promise<RoleAssignment> {
  const result = await client.query<RoleAssignmentRow>(
    `INSERT INTO nelyo_tenancy.role_assignment
       (organization_id, facility_id, membership_id, role_code, status)
     VALUES ($1, $2, $3, $4, COALESCE($5, 'active'))
     RETURNING id, organization_id, facility_id, membership_id, role_code, status`,
    [
      input.organizationId,
      input.facilityId ?? null,
      input.membershipId,
      input.roleCode,
      input.status ?? null
    ]
  );
  return mapRoleAssignment(result.rows[0]);
}

export async function listRoleAssignmentsForMembership(
  client: ClientBase,
  membershipId: string
): Promise<RoleAssignment[]> {
  const result = await client.query<RoleAssignmentRow>(
    `SELECT id, organization_id, facility_id, membership_id, role_code, status
     FROM nelyo_tenancy.role_assignment
     WHERE membership_id = $1
     ORDER BY created_at ASC`,
    [membershipId]
  );
  return result.rows.map(mapRoleAssignment);
}

export async function updateRoleAssignmentStatus(
  client: ClientBase,
  roleAssignmentId: string,
  status: RoleAssignment["status"]
): Promise<RoleAssignment | null> {
  const result = await client.query<RoleAssignmentRow>(
    `UPDATE nelyo_tenancy.role_assignment
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, organization_id, facility_id, membership_id, role_code, status`,
    [roleAssignmentId, status]
  );
  return result.rows[0] ? mapRoleAssignment(result.rows[0]) : null;
}

// ---------- Invitation ----------

export async function createInvitation(
  client: ClientBase,
  input: {
    organizationId: string;
    invitedByPersonId: string;
    roleCodes: string[];
    invitedEmail?: string;
    invitedPhoneE164?: string;
    status?: Invitation["status"];
  }
): Promise<Invitation> {
  const result = await client.query<InvitationRow>(
    `INSERT INTO nelyo_tenancy.invitation
       (organization_id, invited_by_person_id, invited_email, invited_phone_e164,
        role_codes, status)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'pending'))
     RETURNING id, organization_id, invited_by_person_id, invited_email,
               invited_phone_e164, role_codes, status`,
    [
      input.organizationId,
      input.invitedByPersonId,
      input.invitedEmail ?? null,
      input.invitedPhoneE164 ?? null,
      input.roleCodes,
      input.status ?? null
    ]
  );
  return mapInvitation(result.rows[0]);
}

export async function getInvitationById(
  client: ClientBase,
  invitationId: string
): Promise<Invitation | null> {
  const result = await client.query<InvitationRow>(
    `SELECT id, organization_id, invited_by_person_id, invited_email,
            invited_phone_e164, role_codes, status
     FROM nelyo_tenancy.invitation WHERE id = $1`,
    [invitationId]
  );
  return result.rows[0] ? mapInvitation(result.rows[0]) : null;
}

export async function updateInvitationStatus(
  client: ClientBase,
  invitationId: string,
  status: Invitation["status"]
): Promise<Invitation | null> {
  const result = await client.query<InvitationRow>(
    `UPDATE nelyo_tenancy.invitation
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, organization_id, invited_by_person_id, invited_email,
               invited_phone_e164, role_codes, status`,
    [invitationId, status]
  );
  return result.rows[0] ? mapInvitation(result.rows[0]) : null;
}

export { DuplicateIdentityError };
