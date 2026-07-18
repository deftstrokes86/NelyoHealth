import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  DuplicateIdentityError,
  createDatabaseClient,
  addContactPoint,
  addExternalIdentity,
  createPerson,
  createUserAccount,
  findExternalIdentity,
  findUserAccountByLoginEmail,
  findUserAccountByLoginPhone,
  getPersonById,
  getUserAccountById,
  listContactPoints,
  markContactPointVerified,
  setPrimaryContactPoint,
  updateUserAccountStatus
} from "../../packages/database/src/index.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

describe.skipIf(!shouldRun)("identity repository integration (nelyo_identity)", () => {
  const client = createDatabaseClient();
  const run = `it-${Date.now()}`;

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    // Synthetic-only cleanup of rows created by this run.
    await client.query(
      `DELETE FROM nelyo_identity.external_identity
       WHERE external_subject LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `UPDATE nelyo_identity.person SET primary_contact_point_id = NULL
       WHERE display_name LIKE $1`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_identity.user_account
       WHERE person_id IN (SELECT id FROM nelyo_identity.person WHERE display_name LIKE $1)`,
      [`${run}%`]
    );
    await client.query(
      `DELETE FROM nelyo_identity.contact_point
       WHERE person_id IN (SELECT id FROM nelyo_identity.person WHERE display_name LIKE $1)`,
      [`${run}%`]
    );
    await client.query(`DELETE FROM nelyo_identity.person WHERE display_name LIKE $1`, [`${run}%`]);
    await client.end();
  });

  it("persists a person with contact points and a primary designation", async () => {
    const person = await createPerson(client, {
      displayName: `${run}-amina`,
      dateOfBirthIso: "1990-04-12"
    });
    expect(person.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(person.dateOfBirthIso).toBe("1990-04-12");

    const email = await addContactPoint(client, {
      personId: person.id,
      kind: "email",
      value: `${run}-amina@example.test`
    });
    const phone = await addContactPoint(client, {
      personId: person.id,
      kind: "phone",
      value: "+2348000000001",
      verified: true
    });
    expect(email.verified).toBe(false);
    expect(phone.verified).toBe(true);

    const updated = await setPrimaryContactPoint(client, person.id, email.id);
    expect(updated?.primaryContactPointId).toBe(email.id);

    const verifiedEmail = await markContactPointVerified(client, email.id);
    expect(verifiedEmail?.verified).toBe(true);

    const contacts = await listContactPoints(client, person.id);
    expect(contacts).toHaveLength(2);

    const fetched = await getPersonById(client, person.id);
    expect(fetched?.displayName).toBe(`${run}-amina`);
    expect(fetched?.primaryContactPointId).toBe(email.id);
  });

  it("rejects duplicate contact points per person", async () => {
    const person = await createPerson(client, { displayName: `${run}-dupe-contact` });
    await addContactPoint(client, {
      personId: person.id,
      kind: "email",
      value: `${run}-dupe@example.test`
    });
    await expect(
      addContactPoint(client, {
        personId: person.id,
        kind: "email",
        value: `${run}-dupe@example.test`
      })
    ).rejects.toBeInstanceOf(DuplicateIdentityError);
  });

  it("enforces one account per person and unique logins (case-insensitive email)", async () => {
    const person = await createPerson(client, { displayName: `${run}-account-owner` });
    const account = await createUserAccount(client, {
      personId: person.id,
      loginEmail: `${run}-Owner@Example.Test`
    });
    expect(account.status).toBe("pending");

    // Second account for the same person → one-human-one-identity violation.
    await expect(
      createUserAccount(client, {
        personId: person.id,
        loginPhoneE164: "+2348000000002"
      })
    ).rejects.toBeInstanceOf(DuplicateIdentityError);

    // Same email with different casing → unique.
    const otherPerson = await createPerson(client, { displayName: `${run}-other` });
    await expect(
      createUserAccount(client, {
        personId: otherPerson.id,
        loginEmail: `${run}-owner@example.test`
      })
    ).rejects.toBeInstanceOf(DuplicateIdentityError);

    const foundByEmail = await findUserAccountByLoginEmail(client, `${run}-OWNER@example.test`);
    expect(foundByEmail?.id).toBe(account.id);
  });

  it("supports phone login lookup and status transitions", async () => {
    const person = await createPerson(client, { displayName: `${run}-phone-user` });
    const account = await createUserAccount(client, {
      personId: person.id,
      loginPhoneE164: "+2348000000003"
    });

    const found = await findUserAccountByLoginPhone(client, "+2348000000003");
    expect(found?.id).toBe(account.id);

    const activated = await updateUserAccountStatus(client, account.id, "active");
    expect(activated?.status).toBe("active");

    const fetched = await getUserAccountById(client, account.id);
    expect(fetched?.status).toBe("active");
  });

  it("links external identities uniquely per provider subject", async () => {
    const person = await createPerson(client, { displayName: `${run}-ext-user` });
    const account = await createUserAccount(client, {
      personId: person.id,
      loginEmail: `${run}-ext@example.test`
    });

    const external = await addExternalIdentity(client, {
      userAccountId: account.id,
      provider: "email-otp",
      externalSubject: `${run}-subject-1`
    });
    expect(external.userAccountId).toBe(account.id);

    await expect(
      addExternalIdentity(client, {
        userAccountId: account.id,
        provider: "email-otp",
        externalSubject: `${run}-subject-1`
      })
    ).rejects.toBeInstanceOf(DuplicateIdentityError);

    const found = await findExternalIdentity(client, "email-otp", `${run}-subject-1`);
    expect(found?.id).toBe(external.id);
  });

  it("rejects an account with no login channel (check constraint)", async () => {
    const person = await createPerson(client, { displayName: `${run}-no-login` });
    await expect(createUserAccount(client, { personId: person.id })).rejects.toThrow();
  });
});
