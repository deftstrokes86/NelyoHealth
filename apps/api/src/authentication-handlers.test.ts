import { describe, expect, it } from "vitest";
import { createAuthenticationDraft } from "./authentication.js";
import { evaluateAuthenticationDecision } from "./authentication-handlers.js";

describe("authentication decision handler", () => {
  it("denies login when rate limit is exceeded", () => {
    const decision = evaluateAuthenticationDecision({
      authentication: createAuthenticationDraft({
        authRequestId: "auth-1",
        accountId: "account-1",
        personId: "person-1",
        tenantId: "tenant-1",
        intent: "login",
        mode: "password",
        tier: "patient",
        loginIdentifier: "patient@example.com",
        requestedAt: "2026-07-02T08:00:00.000Z"
      }),
      loginAttemptCountInWindow: 5,
      maxLoginAttempts: 5,
      passwordVerified: true,
      otpVerified: true,
      mfaVerified: false,
      trustedDevicePresent: false,
      markDeviceTrusted: false,
      accountRecoveryApproved: false,
      phoneChangeOtpVerified: false,
      riskSignals: {
        unfamiliarDevice: false,
        impossibleTravel: false,
        ipReputation: "low"
      },
      evaluatedAt: "2026-07-02T08:01:00.000Z"
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "rate-limit-exceeded"
    });
  });

  it("requires OTP for passwordless login before authentication", () => {
    const decision = evaluateAuthenticationDecision({
      authentication: createAuthenticationDraft({
        authRequestId: "auth-2",
        accountId: "account-2",
        personId: "person-2",
        tenantId: "tenant-2",
        intent: "login",
        mode: "passwordless",
        tier: "patient",
        loginIdentifier: "+2348000000000",
        requestedAt: "2026-07-02T08:00:00.000Z"
      }),
      loginAttemptCountInWindow: 0,
      maxLoginAttempts: 5,
      passwordVerified: false,
      otpVerified: false,
      mfaVerified: false,
      trustedDevicePresent: false,
      markDeviceTrusted: false,
      accountRecoveryApproved: false,
      phoneChangeOtpVerified: false,
      riskSignals: {
        unfamiliarDevice: false,
        impossibleTravel: false,
        ipReputation: "low"
      },
      evaluatedAt: "2026-07-02T08:01:00.000Z"
    });

    expect(decision).toMatchObject({
      status: "challenge-required",
      reasonCode: "otp-verification-required"
    });
  });

  it("requires MFA for provider login on untrusted devices", () => {
    const decision = evaluateAuthenticationDecision({
      authentication: createAuthenticationDraft({
        authRequestId: "auth-3",
        accountId: "account-3",
        personId: "person-3",
        tenantId: "tenant-3",
        intent: "login",
        mode: "password",
        tier: "provider",
        loginIdentifier: "provider@example.com",
        requestedAt: "2026-07-02T08:00:00.000Z"
      }),
      loginAttemptCountInWindow: 0,
      maxLoginAttempts: 5,
      passwordVerified: true,
      otpVerified: true,
      mfaVerified: false,
      trustedDevicePresent: false,
      markDeviceTrusted: true,
      accountRecoveryApproved: false,
      phoneChangeOtpVerified: false,
      riskSignals: {
        unfamiliarDevice: false,
        impossibleTravel: false,
        ipReputation: "low"
      },
      evaluatedAt: "2026-07-02T08:01:00.000Z"
    });

    expect(decision).toMatchObject({
      status: "challenge-required",
      reasonCode: "mfa-required",
      requiresMfa: true
    });
  });

  it("denies suspicious login and revokes session intent", () => {
    const decision = evaluateAuthenticationDecision({
      authentication: createAuthenticationDraft({
        authRequestId: "auth-4",
        accountId: "account-4",
        personId: "person-4",
        tenantId: "tenant-4",
        intent: "login",
        mode: "password",
        tier: "patient",
        loginIdentifier: "patient@example.com",
        requestedAt: "2026-07-02T08:00:00.000Z"
      }),
      loginAttemptCountInWindow: 0,
      maxLoginAttempts: 5,
      passwordVerified: true,
      otpVerified: true,
      mfaVerified: true,
      trustedDevicePresent: true,
      markDeviceTrusted: false,
      accountRecoveryApproved: false,
      phoneChangeOtpVerified: false,
      riskSignals: {
        unfamiliarDevice: true,
        impossibleTravel: true,
        ipReputation: "high"
      },
      evaluatedAt: "2026-07-02T08:01:00.000Z"
    });

    expect(decision).toMatchObject({
      status: "denied",
      reasonCode: "suspicious-login-review-required",
      sessionAction: "revoke"
    });
  });

  it("authenticates phone change only after phone OTP verification", () => {
    const decision = evaluateAuthenticationDecision({
      authentication: createAuthenticationDraft({
        authRequestId: "auth-5",
        accountId: "account-5",
        personId: "person-5",
        tenantId: "tenant-5",
        intent: "change-phone",
        mode: "password",
        tier: "patient",
        loginIdentifier: "patient@example.com",
        requestedAt: "2026-07-02T08:00:00.000Z"
      }),
      loginAttemptCountInWindow: 0,
      maxLoginAttempts: 5,
      passwordVerified: true,
      otpVerified: true,
      mfaVerified: false,
      trustedDevicePresent: true,
      markDeviceTrusted: false,
      accountRecoveryApproved: false,
      phoneChangeOtpVerified: true,
      requestedPhoneChangeE164: "+2348111111111",
      riskSignals: {
        unfamiliarDevice: false,
        impossibleTravel: false,
        ipReputation: "low"
      },
      evaluatedAt: "2026-07-02T08:01:00.000Z"
    });

    expect(decision).toMatchObject({
      status: "authenticated",
      reasonCode: "authenticated",
      updatedPhoneE164: "+2348111111111"
    });
  });
});
