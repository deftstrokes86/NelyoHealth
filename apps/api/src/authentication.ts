export type AuthenticationIntent = "register" | "login" | "recover-account" | "change-phone";

export type AuthenticationMode = "password" | "passwordless";

export type AuthenticationTier =
  | "patient"
  | "provider"
  | "organization-admin"
  | "platform-admin"
  | "operations";

export interface AuthenticationDraft {
  authRequestId: string;
  accountId: string;
  personId: string;
  tenantId: string;
  intent: AuthenticationIntent;
  mode: AuthenticationMode;
  tier: AuthenticationTier;
  loginIdentifier: string;
  requestedAt: string;
}

export interface AuthenticationDraftInput {
  authRequestId: string;
  accountId: string;
  personId: string;
  tenantId: string;
  intent: AuthenticationIntent;
  mode: AuthenticationMode;
  tier: AuthenticationTier;
  loginIdentifier: string;
  requestedAt: string;
}

export interface AuthenticationDecisionDraft {
  authRequestId: string;
  status: "authenticated" | "challenge-required" | "denied";
  reasonCode:
    | "authenticated"
    | "rate-limit-exceeded"
    | "suspicious-login-review-required"
    | "credentials-invalid"
    | "otp-verification-required"
    | "mfa-required"
    | "recovery-verification-required"
    | "phone-change-otp-required"
    | "phone-change-target-missing";
  requiresMfa: boolean;
  sessionAction: "create" | "revoke" | "none";
  trustedDeviceAction: "trust-device" | "none";
  updatedPhoneE164: string | null;
  evaluatedAt: string;
  nextSteps: string[];
}

export function createAuthenticationDraft(
  input: AuthenticationDraftInput
): AuthenticationDraft {
  return {
    authRequestId: input.authRequestId,
    accountId: input.accountId,
    personId: input.personId,
    tenantId: input.tenantId,
    intent: input.intent,
    mode: input.mode,
    tier: input.tier,
    loginIdentifier: input.loginIdentifier,
    requestedAt: input.requestedAt
  };
}
