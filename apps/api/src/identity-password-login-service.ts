import type { Pool } from "pg";
import {
  countRecentAuthenticationFailures,
  getPasswordCredentialByUserAccountId
} from "@nelyohealth/database";
import { verifyPassword } from "./password-hashing.js";
import {
  executeLoginAttempt,
  type IdentitySessionPorts,
  type LoginAttemptOutcome
} from "./identity-session-service.js";

/**
 * Password-login entry point (patient-web sign-in).
 *
 * Computes the two signals executeLoginAttempt's decision logic (M1.2,
 * unmodified) already expects as inputs — passwordVerified and
 * loginAttemptCountInWindow — then delegates entirely to it. A separate
 * ports interface (not an extension of IdentitySessionPorts) keeps M1.2's
 * interface and tests untouched; this only adds a new, composable seam.
 */

const MAX_LOGIN_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export interface PasswordCredentialPorts {
  getPasswordCredential(
    userAccountId: string
  ): Promise<{ passwordHash: string; algorithm: string } | null>;
  countRecentAuthenticationFailures(userAccountId: string, sinceIso: string): Promise<number>;
}

export function createPgPasswordCredentialPorts(pool: Pool): PasswordCredentialPorts {
  return {
    getPasswordCredential: (userAccountId) =>
      pool.connect().then(async (client) => {
        try {
          const credential = await getPasswordCredentialByUserAccountId(client, userAccountId);
          return credential
            ? { passwordHash: credential.passwordHash, algorithm: credential.algorithm }
            : null;
        } finally {
          client.release();
        }
      }),
    countRecentAuthenticationFailures: (userAccountId, sinceIso) =>
      pool.connect().then(async (client) => {
        try {
          return await countRecentAuthenticationFailures(client, userAccountId, sinceIso);
        } finally {
          client.release();
        }
      })
  };
}

export interface PasswordLoginInput {
  loginEmail: string;
  password: string;
  authRequestId: string;
  now?: () => Date;
}

export async function executePasswordLoginAttempt(
  sessionPorts: IdentitySessionPorts,
  credentialPorts: PasswordCredentialPorts,
  input: PasswordLoginInput
): Promise<LoginAttemptOutcome> {
  const now = input.now?.() ?? new Date();
  const account = await sessionPorts.findAccountByEmail(input.loginEmail);

  let passwordVerified = false;
  let loginAttemptCountInWindow = 0;
  if (account) {
    const credential = await credentialPorts.getPasswordCredential(account.id);
    if (credential) {
      passwordVerified = await verifyPassword(input.password, {
        hash: credential.passwordHash,
        algorithm: credential.algorithm
      });
    }
    const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS).toISOString();
    loginAttemptCountInWindow = await credentialPorts.countRecentAuthenticationFailures(
      account.id,
      windowStart
    );
  }

  return executeLoginAttempt(sessionPorts, {
    identifier: { kind: "email", loginEmail: input.loginEmail },
    method: "password",
    decisionSignals: {
      authentication: {
        authRequestId: input.authRequestId,
        tenantId: "personal",
        intent: "login",
        mode: "password",
        tier: "patient",
        loginIdentifier: input.loginEmail,
        requestedAt: now.toISOString()
      },
      loginAttemptCountInWindow,
      maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
      passwordVerified,
      otpVerified: false,
      mfaVerified: false,
      trustedDevicePresent: true,
      markDeviceTrusted: false,
      accountRecoveryApproved: false,
      phoneChangeOtpVerified: false,
      riskSignals: { unfamiliarDevice: false, impossibleTravel: false, ipReputation: "low" },
      evaluatedAt: now.toISOString()
    },
    now: input.now
  });
}
