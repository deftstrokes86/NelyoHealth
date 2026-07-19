import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  addAddress,
  assignRole,
  createFacility,
  createInvitation,
  createMembership,
  createOrganization,
  createPerson,
  DuplicateIdentityError,
  getInvitationById,
  getMembershipById,
  getPersonById,
  listFacilitiesForOrganization,
  listMembershipsForPerson,
  listRoleAssignmentsForMembership,
  setPrimaryAddress,
  updateInvitationStatus,
  updateMembershipStatus,
  updateOrganizationStatus,
  updateRoleAssignmentStatus,
  createDatabaseClient
} from "../../packages/database/src/index.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

describe.skipIf(!shouldRun)("tenancy repository integration (nelyo_tenancy)", () => {
  const client = createDatabaseClient();
  const run = `tn-${Date.now()}`;
  const orgIds: string[] = [];
  const personIds: string[] = [];

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    // Child-to-parent cleanup, run-scoped by legal_name / display_name prefix.
    await client.query(
      `DELETE FROM nelyo_tenancy.role_assignment r USING nelyo_tenancy.organization o
       WHERE r.organization_id = o.id AND o.legal_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_tenancy.invitation i USING nelyo_tenancy.organization o
       WHERE i.organization_id = o.id AND o.legal_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_tenancy.organization_membership m USING nelyo_tenancy.organization o
       WHERE m.organization_id = o.id AND o.legal_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_tenancy.facility f USING nelyo_tenancy.organization o
       WHERE f.organization_id = o.id AND o.legal_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(`DELETE FROM nelyo_tenancy.organization WHERE legal_name LIKE $1`, [
      `${run}%`
    ]);
    // Detach primary_address_id before deleting addresses (RESTRICT FK).
    await client.query(
      `UPDATE nelyo_identity.person SET primary_address_id = NULL WHERE display_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_identity.address a USING nelyo_identity.person p
       WHERE a.person_id = p.id AND p.display_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(`DELETE FROM nelyo_identity.person WHERE display_name LIKE $1`, [`${run}%`]);
    await client.end();
  });

  it("creates an organization + facility and derives nothing it should not", async () => {
    const org = await createOrganization(client, {
      legalName: `${run} Clinic Group Ltd`,
      displayName: `${run} Clinic Group`
    });
    orgIds.push(org.id);
    expect(org.status).toBe("active");

    const facility = await createFacility(client, {
      organizationId: org.id,
      displayName: `${run} Main Branch`
    });
    expect(facility.organizationId).toBe(org.id);

    const facilities = await listFacilitiesForOrganization(client, org.id);
    expect(facilities.map((f) => f.id)).toContain(facility.id);

    const suspended = await updateOrganizationStatus(client, org.id, "suspended");
    expect(suspended?.status).toBe("suspended");
  });

  it("derives activeRoleAssignmentIds from role_assignment (never persisted)", async () => {
    const org = await createOrganization(client, {
      legalName: `${run} Derive Ltd`,
      displayName: `${run} Derive`
    });
    orgIds.push(org.id);
    const person = await createPerson(client, { displayName: `${run}-clinician` });
    personIds.push(person.id);

    const membership = await createMembership(client, {
      organizationId: org.id,
      personId: person.id,
      status: "active"
    });
    expect(membership.activeRoleAssignmentIds).toEqual([]);

    const facility = await createFacility(client, {
      organizationId: org.id,
      displayName: `${run} Derive Branch`
    });
    const active = await assignRole(client, {
      organizationId: org.id,
      membershipId: membership.id,
      roleCode: "clinician",
      facilityId: facility.id
    });
    const revoked = await assignRole(client, {
      organizationId: org.id,
      membershipId: membership.id,
      roleCode: "billing",
      status: "revoked"
    });

    // Only the active assignment appears in the derived read model.
    const reread = await getMembershipById(client, membership.id);
    expect(reread?.activeRoleAssignmentIds).toEqual([active.id]);
    expect(reread?.activeRoleAssignmentIds).not.toContain(revoked.id);

    // Revoking the active one empties the derived set; all rows still exist.
    await updateRoleAssignmentStatus(client, active.id, "revoked");
    const afterRevoke = await getMembershipById(client, membership.id);
    expect(afterRevoke?.activeRoleAssignmentIds).toEqual([]);
    const allRows = await listRoleAssignmentsForMembership(client, membership.id);
    expect(allRows).toHaveLength(2);
  });

  it("enforces one membership per person per organization", async () => {
    const org = await createOrganization(client, {
      legalName: `${run} Unique Ltd`,
      displayName: `${run} Unique`
    });
    orgIds.push(org.id);
    const person = await createPerson(client, { displayName: `${run}-dupe` });
    personIds.push(person.id);

    await createMembership(client, { organizationId: org.id, personId: person.id });
    await expect(
      createMembership(client, { organizationId: org.id, personId: person.id })
    ).rejects.toBeInstanceOf(DuplicateIdentityError);
  });

  it("rejects a role whose facility belongs to a different organization (tenant-consistency FK)", async () => {
    const orgA = await createOrganization(client, {
      legalName: `${run} OrgA Ltd`,
      displayName: `${run} OrgA`
    });
    const orgB = await createOrganization(client, {
      legalName: `${run} OrgB Ltd`,
      displayName: `${run} OrgB`
    });
    orgIds.push(orgA.id, orgB.id);
    const person = await createPerson(client, { displayName: `${run}-crosser` });
    personIds.push(person.id);

    const membershipA = await createMembership(client, {
      organizationId: orgA.id,
      personId: person.id
    });
    const facilityB = await createFacility(client, {
      organizationId: orgB.id,
      displayName: `${run} OrgB Branch`
    });

    // membership in A, facility in B => composite FK must reject.
    await expect(
      assignRole(client, {
        organizationId: orgA.id,
        membershipId: membershipA.id,
        roleCode: "clinician",
        facilityId: facilityB.id
      })
    ).rejects.toThrow();
  });

  it("stores invitations with role_codes and transitions status", async () => {
    const org = await createOrganization(client, {
      legalName: `${run} Invite Ltd`,
      displayName: `${run} Invite`
    });
    orgIds.push(org.id);
    const inviter = await createPerson(client, { displayName: `${run}-admin` });
    personIds.push(inviter.id);

    const invitation = await createInvitation(client, {
      organizationId: org.id,
      invitedByPersonId: inviter.id,
      invitedEmail: `${run}@example.test`,
      roleCodes: ["clinician", "scheduler"]
    });
    expect(invitation.roleCodes).toEqual(["clinician", "scheduler"]);
    expect(invitation.status).toBe("pending");

    const accepted = await updateInvitationStatus(client, invitation.id, "accepted");
    expect(accepted?.status).toBe("accepted");
    const reread = await getInvitationById(client, invitation.id);
    expect(reread?.status).toBe("accepted");
  });

  it("lists memberships for a person across organizations", async () => {
    const person = await createPerson(client, { displayName: `${run}-multi` });
    personIds.push(person.id);
    const org1 = await createOrganization(client, {
      legalName: `${run} Multi1 Ltd`,
      displayName: `${run} Multi1`
    });
    const org2 = await createOrganization(client, {
      legalName: `${run} Multi2 Ltd`,
      displayName: `${run} Multi2`
    });
    orgIds.push(org1.id, org2.id);
    await createMembership(client, { organizationId: org1.id, personId: person.id });
    const m2 = await createMembership(client, { organizationId: org2.id, personId: person.id });
    await updateMembershipStatus(client, m2.id, "active");

    const memberships = await listMembershipsForPerson(client, person.id);
    expect(memberships).toHaveLength(2);
    expect(memberships.map((m) => m.organizationId).sort()).toEqual([org1.id, org2.id].sort());
  });

  it("completes the person Address deferral (primary_address_id round-trips)", async () => {
    const person = await createPerson(client, { displayName: `${run}-addr` });
    personIds.push(person.id);
    expect(person.primaryAddressId).toBeUndefined();

    const address = await addAddress(client, {
      personId: person.id,
      line1: "1 Health Way",
      city: "Lagos",
      state: "Lagos",
      countryCode: "NG",
      postalCode: "100001"
    });
    const updated = await setPrimaryAddress(client, person.id, address.id);
    expect(updated?.primaryAddressId).toBe(address.id);

    const reread = await getPersonById(client, person.id);
    expect(reread?.primaryAddressId).toBe(address.id);
  });
});
