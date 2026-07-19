import type { Pool, PoolClient } from "pg";
import {
  addContactPoint,
  createPerson,
  createUserAccount,
  createPasswordCredential,
  createDomainEventEnvelope,
  ExternalCallPolicy,
  findUserAccountByLoginEmail,
  PgOutboxStore,
  PgTransactionAdapter,
  runTransactionalWorkWithOutbox
} from "@nelyohealth/database";
import { hashPassword } from "./password-hashing.js";

/**
 * Account registration (patient-web sign-up).
 *
 * No account-enumeration side channel: whether the email was already
 * registered or is brand new, the caller sees the same "accepted" outcome
 * (mirrors the login flow's generic-denial pattern from M1.2). A duplicate
 * email is a silent no-op — no second person/account/credential is created.
 *
 * New accounts land in status "pending" (existing UserAccountStatus value);
 * email verification and the role/consent onboarding flow are NOT built
 * here — see the milestone report for that disclosed scope boundary.
 *
 * Runs inside the transactional outbox: person + contact point + account +
 * credential either all commit together or none do, and AccountRegistered
 * (reference-only payload: accountId/personId, never name/email/password)
 * exists iff the registration committed.
 */

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterAccountInput {
  fullName: string;
  loginEmail: string;
  password: string;
  safeContext: {
    requestId: string;
    correlationId: string;
    idempotencyKey: string;
    operationTag: string;
  };
}

export type RegisterAccountOutcome =
  | { status: "accepted" }
  | { status: "rejected"; reasonCode: "invalid-full-name" | "invalid-email" | "weak-password" };

export interface RegistrationPorts {
  register(input: RegisterAccountInput): Promise<RegisterAccountOutcome>;
}

export function createPgRegistrationPorts(pool: Pool): RegistrationPorts {
  const transaction = new PgTransactionAdapter(pool);
  const outbox = new PgOutboxStore<Record<string, unknown>>(pool);
  const externalCallPolicy = new ExternalCallPolicy();

  return {
    register: (input) => registerAccount({ pool, transaction, outbox, externalCallPolicy }, input)
  };
}

interface RegisterAccountDeps {
  pool: Pool;
  transaction: PgTransactionAdapter;
  outbox: PgOutboxStore<Record<string, unknown>>;
  externalCallPolicy: ExternalCallPolicy;
}

export async function registerAccount(
  deps: RegisterAccountDeps,
  input: RegisterAccountInput
): Promise<RegisterAccountOutcome> {
  const fullName = input.fullName.trim();
  if (fullName.length < 2) {
    return { status: "rejected", reasonCode: "invalid-full-name" };
  }
  if (!EMAIL_PATTERN.test(input.loginEmail)) {
    return { status: "rejected", reasonCode: "invalid-email" };
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    return { status: "rejected", reasonCode: "weak-password" };
  }

  const existing = await withClient(deps.pool, (client) =>
    findUserAccountByLoginEmail(client, input.loginEmail)
  );
  if (existing) {
    // Same outward response as a fresh registration — no enumeration.
    return { status: "accepted" };
  }

  const passwordHash = await hashPassword(input.password);

  await runTransactionalWorkWithOutbox({
    transaction: deps.transaction,
    outbox: deps.outbox,
    externalCallPolicy: deps.externalCallPolicy,
    work: async (ctx) => {
      const person = await createPerson(ctx.client, { displayName: fullName });
      await addContactPoint(ctx.client, {
        personId: person.id,
        kind: "email",
        value: input.loginEmail,
        verified: false
      });
      const account = await createUserAccount(ctx.client, {
        personId: person.id,
        loginEmail: input.loginEmail,
        status: "pending"
      });
      await createPasswordCredential(ctx.client, {
        userAccountId: account.id,
        passwordHash: passwordHash.hash,
        algorithm: passwordHash.algorithm
      });
      await ctx.enqueueDomainEvent(
        createDomainEventEnvelope({
          eventType: "AccountRegistered",
          aggregateId: account.id,
          safeContext: input.safeContext,
          payload: { accountRef: account.id, personRef: person.id }
        })
      );
      return account;
    }
  });

  return { status: "accepted" };
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
