import type { ClientBase } from "pg";

/**
 * Password credential repository (patient-web sign-in/sign-up).
 *
 * Stores only the hash + algorithm tag — never a plaintext password, never
 * logged. Hashing/verification itself lives in apps/api (a platform concern,
 * not a persistence concern); this module is pure storage.
 */

export interface PasswordCredential {
  id: string;
  userAccountId: string;
  passwordHash: string;
  algorithm: string;
}

interface PasswordCredentialRow {
  id: string;
  user_account_id: string;
  password_hash: string;
  algorithm: string;
}

function mapRow(row: PasswordCredentialRow): PasswordCredential {
  return {
    id: row.id,
    userAccountId: row.user_account_id,
    passwordHash: row.password_hash,
    algorithm: row.algorithm
  };
}

export async function createPasswordCredential(
  client: ClientBase,
  input: { userAccountId: string; passwordHash: string; algorithm: string }
): Promise<PasswordCredential> {
  const result = await client.query<PasswordCredentialRow>(
    `INSERT INTO nelyo_identity.password_credential (user_account_id, password_hash, algorithm)
     VALUES ($1, $2, $3)
     RETURNING id, user_account_id, password_hash, algorithm`,
    [input.userAccountId, input.passwordHash, input.algorithm]
  );
  return mapRow(result.rows[0]);
}

export async function getPasswordCredentialByUserAccountId(
  client: ClientBase,
  userAccountId: string
): Promise<PasswordCredential | null> {
  const result = await client.query<PasswordCredentialRow>(
    `SELECT id, user_account_id, password_hash, algorithm
     FROM nelyo_identity.password_credential
     WHERE user_account_id = $1`,
    [userAccountId]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

/**
 * Count failed authentication events for an account within a lookback
 * window — backs the login decision's loginAttemptCountInWindow signal
 * using the append-only trail already established in M1.2, rather than
 * a separate rate-limit store.
 */
export async function countRecentAuthenticationFailures(
  client: ClientBase,
  userAccountId: string,
  sinceIso: string
): Promise<number> {
  const result = await client.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM nelyo_identity.authentication_event
     WHERE user_account_id = $1 AND result = 'failure' AND created_at >= $2`,
    [userAccountId, sinceIso]
  );
  return Number(result.rows[0]?.count ?? "0");
}
