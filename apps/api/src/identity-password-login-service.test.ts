import { describe, expect, it } from "vitest";
import type { Session, UserAccount } from "@nelyohealth/domain";
import { hashPassword } from "./password-hashing.js";
import {
  executePasswordLoginAttempt,
  type PasswordCredentialPorts
} from "./identity-password-login-service.js";
import type { IdentitySessionPorts } from "./identity-session-service.js";

const activeAccount: UserAccount = {
  id: "account-1",
  personId: "person-1",
  loginEmail: "amina@example.test",
  status: "active"
};

function createFakeSessionPorts(
  overrides: Partial<IdentitySessionPorts> = {}
): IdentitySessionPorts {
  const sessions: Session[] = [];
  let seq = 0;
  return {
    findAccountByEmail: async (email) =>
      email.toLowerCase() === activeAccount.loginEmail ? activeAccount : null,
    findAccountByPhone: async () => null,
    createSession: async (input) => {
      seq += 1;
      const session: Session = {
        id: `session-${seq}`,
        userAccountId: input.userAccountId,
        status: "active",
        authLevel: input.authLevel,
        expiresAtIso: input.expiresAtIso
      };
      sessions.push(session);
      return session;
    },
    elevateSession: async () => null,
    setDeviceTrusted: async () => {},
    recordAuthenticationEvent: async (input) => ({
      id: "event-1",
      userAccountId: input.userAccountId,
      result: input.result,
      method: input.method,
      reasonCode: input.reasonCode
    }),
    revokeSessionsWithOutboxEvent: async () => ({ revokedSessionIds: [] }),
    ...overrides
  };
}

function createFakeCredentialPorts(
  credentials: Map<string, { passwordHash: string; algorithm: string }>,
  failureCounts: Map<string, number> = new Map()
): PasswordCredentialPorts {
  return {
    getPasswordCredential: async (userAccountId) => credentials.get(userAccountId) ?? null,
    countRecentAuthenticationFailures: async (userAccountId) =>
      failureCounts.get(userAccountId) ?? 0
  };
}

function toStoredCredential(hashed: { hash: string; algorithm: string }): {
  passwordHash: string;
  algorithm: string;
} {
  return { passwordHash: hashed.hash, algorithm: hashed.algorithm };
}

describe("executePasswordLoginAttempt", () => {
  it("authenticates with the correct password and creates a primary session", async () => {
    const stored = toStoredCredential(await hashPassword("correct horse battery staple"));
    const credentials = new Map([["account-1", stored]]);
    const outcome = await executePasswordLoginAttempt(
      createFakeSessionPorts(),
      createFakeCredentialPorts(credentials),
      {
        loginEmail: "amina@example.test",
        password: "correct horse battery staple",
        authRequestId: "req-1"
      }
    );
    expect(outcome.status).toBe("authenticated");
    if (outcome.status !== "authenticated") throw new Error("unreachable");
    expect(outcome.session.authLevel).toBe("primary");
  });

  it("denies with the generic reason on a wrong password (no signal leaked)", async () => {
    const stored = toStoredCredential(await hashPassword("correct horse battery staple"));
    const credentials = new Map([["account-1", stored]]);
    const outcome = await executePasswordLoginAttempt(
      createFakeSessionPorts(),
      createFakeCredentialPorts(credentials),
      { loginEmail: "amina@example.test", password: "wrong password", authRequestId: "req-2" }
    );
    expect(outcome.status).toBe("denied");
  });

  it("denies an unknown email identically to a wrong password (no enumeration)", async () => {
    const outcome = await executePasswordLoginAttempt(
      createFakeSessionPorts(),
      createFakeCredentialPorts(new Map()),
      { loginEmail: "unknown@example.test", password: "whatever12345", authRequestId: "req-3" }
    );
    expect(outcome.status).toBe("denied");
  });

  it("denies once the recent-failure count reaches the limit (rate limit)", async () => {
    const stored = toStoredCredential(await hashPassword("correct horse battery staple"));
    const credentials = new Map([["account-1", stored]]);
    const failures = new Map([["account-1", 5]]);
    const outcome = await executePasswordLoginAttempt(
      createFakeSessionPorts(),
      createFakeCredentialPorts(credentials, failures),
      {
        loginEmail: "amina@example.test",
        password: "correct horse battery staple",
        authRequestId: "req-4"
      }
    );
    expect(outcome.status).toBe("denied");
    if (outcome.status !== "denied") throw new Error("unreachable");
    expect(outcome.decision?.reasonCode).toBe("rate-limit-exceeded");
  });

  it("denies when the account has no password credential at all", async () => {
    const outcome = await executePasswordLoginAttempt(
      createFakeSessionPorts(),
      createFakeCredentialPorts(new Map()),
      { loginEmail: "amina@example.test", password: "anything1234", authRequestId: "req-5" }
    );
    expect(outcome.status).toBe("denied");
  });
});
