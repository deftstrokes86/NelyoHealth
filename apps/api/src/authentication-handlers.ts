import {
  type AuthenticationDecisionDraft,
  type AuthenticationDraft
} from "./authentication.js";

export interface AuthenticationRiskSignals {
  unfamiliarDevice: boolean;
  impossibleTravel: boolean;
  ipReputation: "low" | "high";
}

export interface EvaluateAuthenticationDecisionInput {
  authentication: AuthenticationDraft;
  loginAttemptCountInWindow: number;
  maxLoginAttempts: number;
  passwordVerified: boolean;
  otpVerified: boolean;
  mfaVerified: boolean;
  trustedDevicePresent: boolean;
  markDeviceTrusted: boolean;
  accountRecoveryApproved: boolean;
  phoneChangeOtpVerified: boolean;
  requestedPhoneChangeE164?: string;
  riskSignals: AuthenticationRiskSignals;
  evaluatedAt: string;
}

export function evaluateAuthenticationDecision(
  input: EvaluateAuthenticationDecisionInput
): AuthenticationDecisionDraft {
  const { authentication } = input;

  if (input.loginAttemptCountInWindow >= input.maxLoginAttempts) {
    return {
      authRequestId: authentication.authRequestId,
      status: "denied",
      reasonCode: "rate-limit-exceeded",
      requiresMfa: false,
      sessionAction: "none",
      trustedDeviceAction: "none",
      updatedPhoneE164: null,
      evaluatedAt: input.evaluatedAt,
      nextSteps: ["wait-and-retry", "optional-account-recovery"]
    };
  }

  const suspiciousLogin =
    input.riskSignals.impossibleTravel ||
    input.riskSignals.ipReputation === "high" ||
    input.riskSignals.unfamiliarDevice;

  if (suspiciousLogin) {
    return {
      authRequestId: authentication.authRequestId,
      status: "denied",
      reasonCode: "suspicious-login-review-required",
      requiresMfa: true,
      sessionAction: "revoke",
      trustedDeviceAction: "none",
      updatedPhoneE164: null,
      evaluatedAt: input.evaluatedAt,
      nextSteps: ["security-review", "account-recovery"]
    };
  }

  if (authentication.mode === "password" && !input.passwordVerified) {
    return {
      authRequestId: authentication.authRequestId,
      status: "denied",
      reasonCode: "credentials-invalid",
      requiresMfa: false,
      sessionAction: "none",
      trustedDeviceAction: "none",
      updatedPhoneE164: null,
      evaluatedAt: input.evaluatedAt,
      nextSteps: ["retry-login", "account-recovery"]
    };
  }

  if (authentication.mode === "passwordless" && !input.otpVerified) {
    return {
      authRequestId: authentication.authRequestId,
      status: "challenge-required",
      reasonCode: "otp-verification-required",
      requiresMfa: false,
      sessionAction: "none",
      trustedDeviceAction: "none",
      updatedPhoneE164: null,
      evaluatedAt: input.evaluatedAt,
      nextSteps: ["submit-otp"]
    };
  }

  if (authentication.intent === "register" && !input.otpVerified) {
    return {
      authRequestId: authentication.authRequestId,
      status: "challenge-required",
      reasonCode: "otp-verification-required",
      requiresMfa: false,
      sessionAction: "none",
      trustedDeviceAction: "none",
      updatedPhoneE164: null,
      evaluatedAt: input.evaluatedAt,
      nextSteps: ["verify-registration-otp"]
    };
  }

  if (
    authentication.intent === "recover-account" &&
    !input.accountRecoveryApproved
  ) {
    return {
      authRequestId: authentication.authRequestId,
      status: "challenge-required",
      reasonCode: "recovery-verification-required",
      requiresMfa: false,
      sessionAction: "none",
      trustedDeviceAction: "none",
      updatedPhoneE164: null,
      evaluatedAt: input.evaluatedAt,
      nextSteps: ["verify-recovery-proof"]
    };
  }

  if (authentication.intent === "change-phone") {
    if (!input.requestedPhoneChangeE164) {
      return {
        authRequestId: authentication.authRequestId,
        status: "denied",
        reasonCode: "phone-change-target-missing",
        requiresMfa: false,
        sessionAction: "none",
        trustedDeviceAction: "none",
        updatedPhoneE164: null,
        evaluatedAt: input.evaluatedAt,
        nextSteps: ["supply-target-phone"]
      };
    }

    if (!input.phoneChangeOtpVerified) {
      return {
        authRequestId: authentication.authRequestId,
        status: "challenge-required",
        reasonCode: "phone-change-otp-required",
        requiresMfa: false,
        sessionAction: "none",
        trustedDeviceAction: "none",
        updatedPhoneE164: null,
        evaluatedAt: input.evaluatedAt,
        nextSteps: ["verify-phone-change-otp"]
      };
    }
  }

  const requiresMfa =
    isPrivilegedTier(authentication.tier) && !input.trustedDevicePresent;

  if (requiresMfa && !input.mfaVerified) {
    return {
      authRequestId: authentication.authRequestId,
      status: "challenge-required",
      reasonCode: "mfa-required",
      requiresMfa: true,
      sessionAction: "none",
      trustedDeviceAction: "none",
      updatedPhoneE164: null,
      evaluatedAt: input.evaluatedAt,
      nextSteps: ["complete-mfa"]
    };
  }

  return {
    authRequestId: authentication.authRequestId,
    status: "authenticated",
    reasonCode: "authenticated",
    requiresMfa,
    sessionAction: "create",
    trustedDeviceAction: input.markDeviceTrusted ? "trust-device" : "none",
    updatedPhoneE164:
      authentication.intent === "change-phone"
        ? input.requestedPhoneChangeE164 ?? null
        : null,
    evaluatedAt: input.evaluatedAt,
    nextSteps: ["session-established"]
  };
}

function isPrivilegedTier(tier: AuthenticationDraft["tier"]): boolean {
  return (
    tier === "provider" ||
    tier === "organization-admin" ||
    tier === "platform-admin"
  );
}
