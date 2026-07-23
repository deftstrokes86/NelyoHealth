import type { Pool } from "pg";
import type { AuthenticationEvent, Session, UserAccount } from "@nelyohealth/domain";
import {
  ExternalCallPolicy,
  PgAuditSink,
  PgOutboxStore,
  PgTransactionAdapter,
  createDomainEventEnvelope,
  createSession,
  elevateSession,
  findUserAccountByLoginEmail,
  findUserAccountByLoginPhone,
  recordAuthenticationEvent,
  revokeSessionsForAccount,
  runTransactionalCommand,
  setDeviceTrusted,
  type CommandActor
} from "@nelyohealth/database";
import type { AuthenticationDecisionDraft } from "./authentication.js";
import {
  evaluateAuthenticationDecision,
  type EvaluateAuthenticationDecisionInput
} from "./authentication-handlers.js";

/**
 * Identity session service (roadmap M1.2).
 *
 * Executes authentication decisions against persisted identity state:
 * login creates sessions, MFA elevates them, and account-wide revocation
 * runs inside the transactional outbox so SessionsRevoked (EVT-005) is
 * emitted iff the revocation committed. The decision logic itself stays in
 * authentication-handlers.ts (wiring, not redesign).
 *
 * Ports are injectable for unit tests; createPgIdentitySessionPorts wires
 * the production implementations from @nelyohealth/database.
 */

export const DEFAULT_SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export interface IdentitySessionPorts {
  findAccountByEmail(loginEmail: string): Promise<UserAccount | null>;
  findAccountByPhone(loginPhoneE164: string): Promise<UserAccount | null>;
  createSession(input: {
    userAccountId: string;
    expiresAtIso: string;
    authLevel: "primary" | "elevated";
    trustedDeviceId?: string;
  }): Promise<Session>;
  elevateSession(sessionId: string): Promise<Session | null>;
  setDeviceTrusted(deviceId: string, trusted: boolean): Promise<void>;
  recordAuthenticationEvent(input: {
    userAccountId?: string;
    result: AuthenticationEvent["result"];
    method: AuthenticationEvent["method"];
    reasonCode?: string;
  }): Promise<AuthenticationEvent>;
  revokeSessionsWithOutboxEvent(input: {
    userAccountId: string;
    reasonCode: string;
    actor: CommandActor;
    safeContext: {
      requestId: string;
      correlationId: string;
      idempotencyKey: string;
      operationTag: string;
    };
  }): Promise<{ revokedSessionIds: string[] }>;
}

export function createPgIdentitySessionPorts(pool: Pool): IdentitySessionPorts {
  const transaction = new PgTransactionAdapter(pool);
  const outbox = new PgOutboxStore<Record<string, unknown>>(pool);
  const auditSink = new PgAuditSink();
  const externalCallPolicy = new ExternalCallPolicy();

  return {
    findAccountByEmail: (loginEmail) =>
      pool.connect().then(async (client) => {
        try {
          return await findUserAccountByLoginEmail(client, loginEmail);
        } finally {
          client.release();
        }
      }),
    findAccountByPhone: (loginPhoneE164) =>
      pool.connect().then(async (client) => {
        try {
          return await findUserAccountByLoginPhone(client, loginPhoneE164);
        } finally {
          client.release();
        }
      }),
    createSession: (input) =>
      pool.connect().then(async (client) => {
        try {
          return await createSession(client, input);
        } finally {
          client.release();
        }
      }),
    elevateSession: (sessionId) =>
      pool.connect().then(async (client) => {
        try {
          return await elevateSession(client, sessionId);
        } finally {
          client.release();
        }
      }),
    setDeviceTrusted: (deviceId, trusted) =>
      pool.connect().then(async (client) => {
        try {
          await setDeviceTrusted(client, deviceId, trusted);
        } finally {
          client.release();
        }
      }),
    recordAuthenticationEvent: (input) =>
      pool.connect().then(async (client) => {
        try {
          return await recordAuthenticationEvent(client, input);
        } finally {
          client.release();
        }
      }),
    revokeSessionsWithOutboxEvent: async ({ userAccountId, reasonCode, actor, safeContext }) => {
      const { result: revoked } = await runTransactionalCommand({
        transaction,
        outbox,
        auditSink,
        externalCallPolicy,
        command: {
          name: "identity.sessions.revoke",
          aggregateId: userAccountId,
          action: "revoke",
          actor,
          safeContext
        },
        work: async (ctx) => {
          const sessions = await revokeSessionsForAccount(ctx.client, userAccountId);
          await ctx.enqueueDomainEvent(
            createDomainEventEnvelope({
              eventType: "SessionsRevoked",
              aggregateId: userAccountId,
              safeContext,
              payload: {
                accountRef: userAccountId,
                reasonCode,
                revokedSessionCount: sessions.length
              }
            })
          );
          return {
            result: sessions,
            audit: {
              outcome: "committed",
              safeDetails: {
                accountRef: userAccountId,
                reasonCode,
                revokedSessionCount: sessions.length
              }
            }
          };
        }
      });
      return { revokedSessionIds: revoked.map((session) => session.id) };
    }
  };
}

export type LoginIdentifier =
  | { kind: "email"; loginEmail: string }
  | { kind: "phone"; loginPhoneE164: string };

export interface LoginAttemptInput {
  identifier: LoginIdentifier;
  method: AuthenticationEvent["method"];
  decisionSignals: Omit<EvaluateAuthenticationDecisionInput, "authentication"> & {
    authentication: Omit<
      EvaluateAuthenticationDecisionInput["authentication"],
      "accountId" | "personId"
    >;
  };
  trustedDeviceId?: string;
  sessionTtlMs?: number;
  now?: () => Date;
}

export type LoginAttemptOutcome =
  | { status: "authenticated"; decision: AuthenticationDecisionDraft; session: Session }
  | { status: "challenge-required"; decision: AuthenticationDecisionDraft }
  | { status: "denied"; decision: AuthenticationDecisionDraft | null };

/**
 * Execute a login attempt end to end: resolve the account, evaluate the
 * authentication decision, then act on it (session creation, device trust,
 * event recording). Unknown identifiers are recorded and denied with the
 * same generic reason as bad credentials (no account enumeration).
 */
export async function executeLoginAttempt(
  ports: IdentitySessionPorts,
  input: LoginAttemptInput
): Promise<LoginAttemptOutcome> {
  const account =
    input.identifier.kind === "email"
      ? await ports.findAccountByEmail(input.identifier.loginEmail)
      : await ports.findAccountByPhone(input.identifier.loginPhoneE164);

  if (!account || account.status !== "active") {
    await ports.recordAuthenticationEvent({
      userAccountId: account?.id,
      result: "failure",
      method: input.method,
      reasonCode: "credentials-invalid"
    });
    return { status: "denied", decision: null };
  }

  const decision = evaluateAuthenticationDecision({
    ...input.decisionSignals,
    authentication: {
      ...input.decisionSignals.authentication,
      accountId: account.id,
      personId: account.personId
    }
  });

  if (decision.status === "denied") {
    await ports.recordAuthenticationEvent({
      userAccountId: account.id,
      result: "failure",
      method: input.method,
      reasonCode: decision.reasonCode
    });
    return { status: "denied", decision };
  }

  if (decision.status === "challenge-required") {
    await ports.recordAuthenticationEvent({
      userAccountId: account.id,
      result: "challenge-required",
      method: input.method,
      reasonCode: decision.reasonCode
    });
    return { status: "challenge-required", decision };
  }

  // Authenticated.
  if (decision.trustedDeviceAction === "trust-device" && input.trustedDeviceId) {
    await ports.setDeviceTrusted(input.trustedDeviceId, true);
  }

  const now = input.now?.() ?? new Date();
  const ttl = input.sessionTtlMs ?? DEFAULT_SESSION_TTL_MS;
  const session = await ports.createSession({
    userAccountId: account.id,
    expiresAtIso: new Date(now.getTime() + ttl).toISOString(),
    authLevel: input.decisionSignals.mfaVerified ? "elevated" : "primary",
    trustedDeviceId: input.trustedDeviceId
  });

  await ports.recordAuthenticationEvent({
    userAccountId: account.id,
    result: "success",
    method: input.method,
    reasonCode: decision.reasonCode
  });

  return { status: "authenticated", decision, session };
}

export interface StepUpInput {
  sessionId: string;
  userAccountId: string;
  mfaVerified: boolean;
}

export type StepUpOutcome =
  | { status: "elevated"; session: Session }
  | { status: "denied"; reasonCode: "mfa-not-verified" | "session-not-elevatable" };

/** Satisfy a step-up challenge: elevate an active, unexpired session via MFA. */
export async function executeSessionStepUp(
  ports: IdentitySessionPorts,
  input: StepUpInput
): Promise<StepUpOutcome> {
  if (!input.mfaVerified) {
    await ports.recordAuthenticationEvent({
      userAccountId: input.userAccountId,
      result: "failure",
      method: "mfa",
      reasonCode: "mfa-not-verified"
    });
    return { status: "denied", reasonCode: "mfa-not-verified" };
  }

  const session = await ports.elevateSession(input.sessionId);
  if (!session) {
    await ports.recordAuthenticationEvent({
      userAccountId: input.userAccountId,
      result: "failure",
      method: "mfa",
      reasonCode: "session-not-elevatable"
    });
    return { status: "denied", reasonCode: "session-not-elevatable" };
  }

  await ports.recordAuthenticationEvent({
    userAccountId: input.userAccountId,
    result: "success",
    method: "mfa"
  });
  return { status: "elevated", session };
}

export interface RevokeAccountSessionsInput {
  userAccountId: string;
  reasonCode: string;
  /** Who initiated the revocation — attributed in the command audit intent. */
  actor: CommandActor;
  safeContext: {
    requestId: string;
    correlationId: string;
    idempotencyKey: string;
    operationTag: string;
  };
}

/**
 * Revoke every active session for an account. Runs as a transactional command:
 * the session state change, SessionsRevoked (EVT-005: accountRef + reasonCode,
 * never tokens), and the audit intent all commit together or not at all.
 */
export async function executeAccountSessionRevocation(
  ports: IdentitySessionPorts,
  input: RevokeAccountSessionsInput
): Promise<{ revokedSessionIds: string[] }> {
  return ports.revokeSessionsWithOutboxEvent(input);
}
