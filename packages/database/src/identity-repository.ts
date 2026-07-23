import type { ClientBase } from "pg";
import type {
  Address,
  ContactPoint,
  ExternalIdentity,
  Person,
  UserAccount
} from "@nelyohealth/domain";

/**
 * Identity & Access repository (roadmap M1.1).
 *
 * Owns SQL for the nelyo_identity schema. Functions take an active pg client
 * so callers control the transaction boundary — from M3.x onward, mutations
 * run inside the transactional-command path (state + outbox + audit in one
 * transaction). Other bounded contexts must not query these tables directly.
 */

export type UserAccountStatus = UserAccount["status"];
export type ContactPointKind = ContactPoint["kind"];
export type ExternalIdentityProvider = ExternalIdentity["provider"];

export class DuplicateIdentityError extends Error {
  constructor(
    public readonly constraint: string,
    message: string
  ) {
    super(message);
    this.name = "DuplicateIdentityError";
  }
}

function rethrowDuplicate(error: unknown): never {
  const pgError = error as { code?: string; constraint?: string };
  if (pgError?.code === "23505") {
    throw new DuplicateIdentityError(
      pgError.constraint ?? "unknown-constraint",
      `Identity uniqueness violated (${pgError.constraint ?? "unknown constraint"}).`
    );
  }
  throw error;
}

interface PersonRow {
  id: string;
  display_name: string;
  date_of_birth: string | Date | null;
  primary_contact_point_id: string | null;
  primary_address_id: string | null;
}

interface AddressRow {
  id: string;
  person_id: string;
  line1: string;
  city: string;
  state: string;
  country_code: string;
  postal_code: string | null;
}

interface ContactPointRow {
  id: string;
  person_id: string;
  kind: ContactPointKind;
  value: string;
  verified: boolean;
}

interface UserAccountRow {
  id: string;
  person_id: string;
  login_email: string | null;
  login_phone_e164: string | null;
  status: UserAccountStatus;
}

interface ExternalIdentityRow {
  id: string;
  user_account_id: string;
  provider: ExternalIdentityProvider;
  external_subject: string;
}

function toIsoDate(value: string | Date | null): string | undefined {
  if (value === null) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}

function mapPerson(row: PersonRow): Person {
  return {
    id: row.id,
    displayName: row.display_name,
    dateOfBirthIso: toIsoDate(row.date_of_birth),
    primaryContactPointId: row.primary_contact_point_id ?? undefined,
    primaryAddressId: row.primary_address_id ?? undefined
  };
}

function mapAddress(row: AddressRow): Address {
  return {
    id: row.id,
    personId: row.person_id,
    line1: row.line1,
    city: row.city,
    state: row.state,
    countryCode: row.country_code,
    postalCode: row.postal_code ?? undefined
  };
}

function mapContactPoint(row: ContactPointRow): ContactPoint {
  return {
    id: row.id,
    personId: row.person_id,
    kind: row.kind,
    value: row.value,
    verified: row.verified
  };
}

function mapUserAccount(row: UserAccountRow): UserAccount {
  return {
    id: row.id,
    personId: row.person_id,
    loginEmail: row.login_email ?? undefined,
    loginPhoneE164: row.login_phone_e164 ?? undefined,
    status: row.status
  };
}

function mapExternalIdentity(row: ExternalIdentityRow): ExternalIdentity {
  return {
    id: row.id,
    userAccountId: row.user_account_id,
    provider: row.provider,
    externalSubject: row.external_subject
  };
}

// ---------- Person + ContactPoint ----------

export async function createPerson(
  client: ClientBase,
  input: { displayName: string; dateOfBirthIso?: string }
): Promise<Person> {
  const result = await client.query<PersonRow>(
    `INSERT INTO nelyo_identity.person (display_name, date_of_birth)
     VALUES ($1, $2)
     RETURNING id, display_name, date_of_birth::text AS date_of_birth, primary_contact_point_id, primary_address_id`,
    [input.displayName, input.dateOfBirthIso ?? null]
  );
  return mapPerson(result.rows[0]);
}

export async function getPersonById(client: ClientBase, personId: string): Promise<Person | null> {
  const result = await client.query<PersonRow>(
    `SELECT id, display_name, date_of_birth::text AS date_of_birth, primary_contact_point_id, primary_address_id
     FROM nelyo_identity.person WHERE id = $1`,
    [personId]
  );
  return result.rows[0] ? mapPerson(result.rows[0]) : null;
}

export async function addContactPoint(
  client: ClientBase,
  input: {
    personId: string;
    kind: ContactPointKind;
    value: string;
    verified?: boolean;
  }
): Promise<ContactPoint> {
  try {
    const result = await client.query<ContactPointRow>(
      `INSERT INTO nelyo_identity.contact_point (person_id, kind, value, verified)
       VALUES ($1, $2, $3, $4)
       RETURNING id, person_id, kind, value, verified`,
      [input.personId, input.kind, input.value, input.verified ?? false]
    );
    return mapContactPoint(result.rows[0]);
  } catch (error) {
    rethrowDuplicate(error);
  }
}

export async function listContactPoints(
  client: ClientBase,
  personId: string
): Promise<ContactPoint[]> {
  const result = await client.query<ContactPointRow>(
    `SELECT id, person_id, kind, value, verified
     FROM nelyo_identity.contact_point
     WHERE person_id = $1
     ORDER BY created_at ASC`,
    [personId]
  );
  return result.rows.map(mapContactPoint);
}

export async function markContactPointVerified(
  client: ClientBase,
  contactPointId: string
): Promise<ContactPoint | null> {
  const result = await client.query<ContactPointRow>(
    `UPDATE nelyo_identity.contact_point
     SET verified = TRUE, updated_at = NOW()
     WHERE id = $1
     RETURNING id, person_id, kind, value, verified`,
    [contactPointId]
  );
  return result.rows[0] ? mapContactPoint(result.rows[0]) : null;
}

export async function setPrimaryContactPoint(
  client: ClientBase,
  personId: string,
  contactPointId: string
): Promise<Person | null> {
  const result = await client.query<PersonRow>(
    `UPDATE nelyo_identity.person
     SET primary_contact_point_id = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, display_name, date_of_birth::text AS date_of_birth, primary_contact_point_id, primary_address_id`,
    [personId, contactPointId]
  );
  return result.rows[0] ? mapPerson(result.rows[0]) : null;
}

// ---------- UserAccount ----------

export async function createUserAccount(
  client: ClientBase,
  input: {
    /** Optional client-supplied id; omitted → gen_random_uuid(). Lets a caller
     * know the account id before insert (e.g. as a command aggregate id). */
    id?: string;
    personId: string;
    loginEmail?: string;
    loginPhoneE164?: string;
    status?: UserAccountStatus;
  }
): Promise<UserAccount> {
  try {
    const result = await client.query<UserAccountRow>(
      `INSERT INTO nelyo_identity.user_account (id, person_id, login_email, login_phone_e164, status)
       VALUES (COALESCE($1, gen_random_uuid()), $2, $3, $4, $5)
       RETURNING id, person_id, login_email, login_phone_e164, status`,
      [
        input.id ?? null,
        input.personId,
        input.loginEmail ?? null,
        input.loginPhoneE164 ?? null,
        input.status ?? "pending"
      ]
    );
    return mapUserAccount(result.rows[0]);
  } catch (error) {
    rethrowDuplicate(error);
  }
}

export async function getUserAccountById(
  client: ClientBase,
  userAccountId: string
): Promise<UserAccount | null> {
  const result = await client.query<UserAccountRow>(
    `SELECT id, person_id, login_email, login_phone_e164, status
     FROM nelyo_identity.user_account WHERE id = $1`,
    [userAccountId]
  );
  return result.rows[0] ? mapUserAccount(result.rows[0]) : null;
}

export async function findUserAccountByLoginEmail(
  client: ClientBase,
  loginEmail: string
): Promise<UserAccount | null> {
  const result = await client.query<UserAccountRow>(
    `SELECT id, person_id, login_email, login_phone_e164, status
     FROM nelyo_identity.user_account
     WHERE LOWER(login_email) = LOWER($1)`,
    [loginEmail]
  );
  return result.rows[0] ? mapUserAccount(result.rows[0]) : null;
}

export async function findUserAccountByLoginPhone(
  client: ClientBase,
  loginPhoneE164: string
): Promise<UserAccount | null> {
  const result = await client.query<UserAccountRow>(
    `SELECT id, person_id, login_email, login_phone_e164, status
     FROM nelyo_identity.user_account
     WHERE login_phone_e164 = $1`,
    [loginPhoneE164]
  );
  return result.rows[0] ? mapUserAccount(result.rows[0]) : null;
}

export async function updateUserAccountStatus(
  client: ClientBase,
  userAccountId: string,
  status: UserAccountStatus
): Promise<UserAccount | null> {
  const result = await client.query<UserAccountRow>(
    `UPDATE nelyo_identity.user_account
     SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, person_id, login_email, login_phone_e164, status`,
    [userAccountId, status]
  );
  return result.rows[0] ? mapUserAccount(result.rows[0]) : null;
}

// ---------- ExternalIdentity ----------

export async function addExternalIdentity(
  client: ClientBase,
  input: {
    userAccountId: string;
    provider: ExternalIdentityProvider;
    externalSubject: string;
  }
): Promise<ExternalIdentity> {
  try {
    const result = await client.query<ExternalIdentityRow>(
      `INSERT INTO nelyo_identity.external_identity (user_account_id, provider, external_subject)
       VALUES ($1, $2, $3)
       RETURNING id, user_account_id, provider, external_subject`,
      [input.userAccountId, input.provider, input.externalSubject]
    );
    return mapExternalIdentity(result.rows[0]);
  } catch (error) {
    rethrowDuplicate(error);
  }
}

export async function findExternalIdentity(
  client: ClientBase,
  provider: ExternalIdentityProvider,
  externalSubject: string
): Promise<ExternalIdentity | null> {
  const result = await client.query<ExternalIdentityRow>(
    `SELECT id, user_account_id, provider, external_subject
     FROM nelyo_identity.external_identity
     WHERE provider = $1 AND external_subject = $2`,
    [provider, externalSubject]
  );
  return result.rows[0] ? mapExternalIdentity(result.rows[0]) : null;
}

// ---------- Address (person-scoped; roadmap M2.1) ----------

export async function addAddress(
  client: ClientBase,
  input: {
    personId: string;
    line1: string;
    city: string;
    state: string;
    countryCode: string;
    postalCode?: string;
  }
): Promise<Address> {
  const result = await client.query<AddressRow>(
    `INSERT INTO nelyo_identity.address (person_id, line1, city, state, country_code, postal_code)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, person_id, line1, city, state, country_code, postal_code`,
    [
      input.personId,
      input.line1,
      input.city,
      input.state,
      input.countryCode,
      input.postalCode ?? null
    ]
  );
  return mapAddress(result.rows[0]);
}

export async function listAddressesForPerson(
  client: ClientBase,
  personId: string
): Promise<Address[]> {
  const result = await client.query<AddressRow>(
    `SELECT id, person_id, line1, city, state, country_code, postal_code
     FROM nelyo_identity.address
     WHERE person_id = $1
     ORDER BY created_at ASC`,
    [personId]
  );
  return result.rows.map(mapAddress);
}

export async function setPrimaryAddress(
  client: ClientBase,
  personId: string,
  addressId: string
): Promise<Person | null> {
  const result = await client.query<PersonRow>(
    `UPDATE nelyo_identity.person
     SET primary_address_id = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, display_name, date_of_birth::text AS date_of_birth, primary_contact_point_id, primary_address_id`,
    [personId, addressId]
  );
  return result.rows[0] ? mapPerson(result.rows[0]) : null;
}
