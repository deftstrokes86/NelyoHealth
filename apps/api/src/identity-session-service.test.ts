import { describe, expect, it } from "vitest";
import type { AuthenticationEvent, Session, UserAccount } from "@nelyohealth/domain";
import {
  DEFAULT_SESSION_TTL_MS,
  executeAccountSessionRevocation,
  executeLoginAttempt,
  executeSessionStepUp,
  type IdentitySessionPorts,
  type LoginAttemptInput
} from "./identity-session-service.js";

interface FakeState {
  accounts: UserAccount[];
  sessions: Session[];
  events: Array<{
    userAccountId?: string;
    result: AuthenticationEvent["result"];
    method: AuthenticationEvent["method"];
    reasonCode?: string;
  }>;
  trustedDevices: Array<{ deviceId: string; trusted: boolean }>;
  revocations: Array<{ userAccountId: string; reasonCode: string }>;
}

function createFakePorts(state: FakeState): IdentitySessionPorts {
  let sessionSeq = 0;
  return {
    findAccountByEmail: async (loginEmail) =>
      state.accounts.find(
        (account) => account.loginEmail?.toLowerCase() === loginEmail.toLowerCase()
      ) ?? null,
    findAccountByPhone: async (loginPhoneE164) =>
      state.accounts.find((account) => account.loginPhoneE164 === loginPhoneE164) ?? null,
    createSession: async (input) => {
      sessionSeq += 1;
      const session: Session = {
        id: `session-${sessionSeq}`,
        userAccountId: input.userAccountId,
        status: "active",
        authLevel: input.authLevel,
        trustedDeviceId: input.trustedDeviceId,
        expiresAtIso: input.expiresAtIso
      };
      state.sessions.push(session);
      return session;
    },
    elevateSession: async (sessionId) => {
      const session = state.sessions.find(
        (candidate) =>
          candidate.id === sessionId &&
          candidate.status === "active" &&
          (candidate.expiresAtIso ?? "") > new Date().toISOString()
      );
      if (!session) return null;
      session.authLevel = "elevated";
      return session;
    },
    setDeviceTrusted: async (deviceId, trusted) => {
      state.trustedDevices.push({ deviceId, trusted });
    },
    recordAuthenticationEvent: async (input) => {
      state.events.push(input);
      return {
        id: `event-${state.events.length}`,
        userAccountId: input.userAccountId,
        result: input.result,
        method: input.method,
        reasonCode: input.reasonCode
      };
    },
    revokeSessionsWithOutboxEvent: async ({ userAccountId, reasonCode }) => {
      state.revocations.push({ userAccountId, reasonCode });
      const revoked = state.sessions.filter(
        (session) => session.userAccountId === userAccountId && session.status === "active"
      );
      for (const session of revoked) session.status = "revoked";
      return { revokedSessionIds: revoked.map((session) => session.id) };
    }
  };
}

function emptyState(): FakeState {
  return { accounts: [], sessions: [], events: [], trustedDevices: [], revocations: [] };
}

const activeAccount: UserAccount = {
  id: "account-1",
  personId: "person-1",
  loginEmail: "amina@example.test",
  status: "active"
};

function loginInput(
  overrides: Partial<{
    passwordVerified: boolean;
    mfaVerified: boolean;
    attempts: number;
    trustedDeviceId: string;
    markDeviceTrusted: boolean;
    tier: "patient" | "provider";
    trustedDevicePresent: boolean;
  }> = {}
): LoginAttemptInput {
  return {
    identifier: { kind: "email", loginEmail: "amina@example.test" },
    method: "password",
    trustedDeviceId: overrides.trustedDeviceId,
    decisionSignals: {
      authentication: {
        authRequestId: "auth-1",
        tenantId: "tenant-personal",
        intent: "login",
        mode: "password",
        tier: overrides.tier ?? "patient",
        loginIdentifier: "amina@example.test",
        requestedAt: new Date().toISOString()
      },
      loginAttemptCountInWindow: overrides.attempts ?? 0,
      maxLoginAttempts: 5,
      passwordVerified: overrides.passwordVerified ?? true,
      otpVerified: false,
      mfaVerified: overrides.mfaVerified ?? false,
      trustedDevicePresent: overrides.trustedDevicePresent ?? true,
      markDeviceTrusted: overrides.markDeviceTrusted ?? false,
      accountRecoveryApproved: false,
      phoneChangeOtpVerified: false,
      riskSignals: {
        unfamiliarDevice: false,
        impossibleTravel: false,
        ipReputation: "low"
      },
      evaluatedAt: new Date().toISOString()
    }
  };
}

describe("executeLoginAttempt", () => {
  it("creates a primary session and records success on an authenticated decision", async () => {
    const state = emptyState();
    state.accounts.push(activeAccount);
    const outcome = await executeLoginAttempt(createFakePorts(state), loginInput());

    expect(outcome.status).toBe("authenticated");
    if (outcome.status !== "authenticated") throw new Error("unreachable");
    expect(outcome.session.authLevel).toBe("primary");
    expect(outcome.session.userAccountId).toBe("account-1");
    const expiry = Date.parse(outcome.session.expiresAtIso ?? "");
    expect(expiry).toBeGreaterThan(Date.now() + DEFAULT_SESSION_TTL_MS - 60_000);
    expect(state.events).toEqual([
      {
        userAccountId: "account-1",
        result: "success",
        method: "password",
        reasonCode: "authenticated"
      }
    ]);
  });

  it("creates an elevated session when MFA was already verified", async () => {
    const state = emptyState();
    state.accounts.push(activeAccount);
    const outcome = await executeLoginAttempt(
      createFakePorts(state),
      loginInput({ mfaVerified: true })
    );
    expect(outcome.status).toBe("authenticated");
    if (outcome.status !== "authenticated") throw new Error("unreachable");
    expect(outcome.session.authLevel).toBe("elevated");
  });

  it("denies unknown identifiers with the generic credentials reason (no enumeration)", async () => {
    const state = emptyState();
    const outcome = await executeLoginAttempt(createFakePorts(state), loginInput());
    expect(outcome.status).toBe("denied");
    expect(state.sessions).toHaveLength(0);
    expect(state.events[0]).toMatchObject({
      result: "failure",
      reasonCode: "credentials-invalid"
    });
    expect(state.events[0].userAccountId).toBeUndefined();
  });

  it("denies non-active accounts identically to unknown identifiers", async () => {
    const state = emptyState();
    state.accounts.push({ ...activeAccount, status: "suspended" });
    const outcome = await executeLoginAttempt(createFakePorts(state), loginInput());
    expect(outcome.status).toBe("denied");
    expect(state.events[0].reasonCode).toBe("credentials-invalid");
  });

  it("records a denied decision (rate limit) without creating a session", async () => {
    const state = emptyState();
    state.accounts.push(activeAccount);
    const outcome = await executeLoginAttempt(createFakePorts(state), loginInput({ attempts: 5 }));
    expect(outcome.status).toBe("denied");
    expect(state.sessions).toHaveLength(0);
    expect(state.events[0].reasonCode).toBe("rate-limit-exceeded");
  });

  it("denies an unverified password (credentials-invalid) without a session", async () => {
    const state = emptyState();
    state.accounts.push(activeAccount);
    const outcome = await executeLoginAttempt(
      createFakePorts(state),
      loginInput({ passwordVerified: false })
    );
    expect(outcome.status).toBe("denied");
    expect(state.sessions).toHaveLength(0);
    expect(state.events[0].reasonCode).toBe("credentials-invalid");
  });

  it("records challenge-required (mfa-required) for a privileged tier on an untrusted device", async () => {
    const state = emptyState();
    state.accounts.push(activeAccount);
    const outcome = await executeLoginAttempt(
      createFakePorts(state),
      loginInput({ tier: "provider", trustedDevicePresent: false })
    );
    expect(outcome.status).toBe("challenge-required");
    if (outcome.status !== "challenge-required") throw new Error("unreachable");
    expect(outcome.decision.reasonCode).toBe("mfa-required");
    expect(state.sessions).toHaveLength(0);
    expect(state.events[0].result).toBe("challenge-required");
  });

  it("trusts the presented device when the decision says so", async () => {
    const state = emptyState();
    state.accounts.push(activeAccount);
    await executeLoginAttempt(
      createFakePorts(state),
      loginInput({ trustedDeviceId: "device-9", markDeviceTrusted: true })
    );
    expect(state.trustedDevices).toEqual([{ deviceId: "device-9", trusted: true }]);
  });
});

describe("executeSessionStepUp", () => {
  it("elevates an active session on verified MFA and records success", async () => {
    const state = emptyState();
    state.sessions.push({
      id: "session-1",
      userAccountId: "account-1",
      status: "active",
      authLevel: "primary",
      expiresAtIso: new Date(Date.now() + 60_000).toISOString()
    });
    const outcome = await executeSessionStepUp(createFakePorts(state), {
      sessionId: "session-1",
      userAccountId: "account-1",
      mfaVerified: true
    });
    expect(outcome.status).toBe("elevated");
    expect(state.sessions[0].authLevel).toBe("elevated");
    expect(state.events.at(-1)).toMatchObject({ result: "success", method: "mfa" });
  });

  it("denies without MFA verification and records the failure", async () => {
    const state = emptyState();
    const outcome = await executeSessionStepUp(createFakePorts(state), {
      sessionId: "session-1",
      userAccountId: "account-1",
      mfaVerified: false
    });
    expect(outcome).toEqual({ status: "denied", reasonCode: "mfa-not-verified" });
    expect(state.events[0].reasonCode).toBe("mfa-not-verified");
  });

  it("denies elevation of an expired session", async () => {
    const state = emptyState();
    state.sessions.push({
      id: "session-1",
      userAccountId: "account-1",
      status: "active",
      authLevel: "primary",
      expiresAtIso: new Date(Date.now() - 1_000).toISOString()
    });
    const outcome = await executeSessionStepUp(createFakePorts(state), {
      sessionId: "session-1",
      userAccountId: "account-1",
      mfaVerified: true
    });
    expect(outcome).toEqual({ status: "denied", reasonCode: "session-not-elevatable" });
  });
});

describe("executeAccountSessionRevocation", () => {
  it("revokes all active sessions through the outbox port", async () => {
    const state = emptyState();
    state.sessions.push(
      {
        id: "session-1",
        userAccountId: "account-1",
        status: "active",
        authLevel: "primary",
        expiresAtIso: new Date(Date.now() + 60_000).toISOString()
      },
      {
        id: "session-2",
        userAccountId: "account-1",
        status: "active",
        authLevel: "elevated",
        expiresAtIso: new Date(Date.now() + 60_000).toISOString()
      }
    );
    const outcome = await executeAccountSessionRevocation(createFakePorts(state), {
      userAccountId: "account-1",
      reasonCode: "account-recovery",
      safeContext: {
        requestId: "req-1",
        correlationId: "corr-1",
        idempotencyKey: "idem-1",
        operationTag: "identity.sessions.revoke"
      }
    });
    expect(outcome.revokedSessionIds).toEqual(["session-1", "session-2"]);
    expect(state.sessions.every((session) => session.status === "revoked")).toBe(true);
    expect(state.revocations).toEqual([
      { userAccountId: "account-1", reasonCode: "account-recovery" }
    ]);
  });
});
