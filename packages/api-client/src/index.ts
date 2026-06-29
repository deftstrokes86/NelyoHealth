export { createProviderSearchResponseDto } from "./providers.js";
export type { ProviderSearchRequestDto, ProviderSearchResponseDto } from "./providers.js";
export { createAccountDraftDto } from "./accounts.js";
export type { AccountDraftDto, AccountDraftRequestDto } from "./accounts.js";
export { createBookingDraftDto } from "./bookings.js";
export type { BookingDraftDto, BookingDraftRequestDto } from "./bookings.js";
export { createIntakeDraftDto } from "./intake.js";
export type { IntakeDraftDto, IntakeDraftRequestDto } from "./intake.js";
export { createReferralDraftDto } from "./referrals.js";
export type { ReferralDraftDto, ReferralDraftRequestDto } from "./referrals.js";
export { createPrescriptionDraftDto } from "./prescriptions.js";
export type { PrescriptionDraftDto, PrescriptionDraftRequestDto } from "./prescriptions.js";
export { createDiagnosticResultDraftDto } from "./diagnostic-results.js";
export type {
  DiagnosticResultDraftDto,
  DiagnosticResultDraftRequestDto
} from "./diagnostic-results.js";
export { createFollowUpDraftDto } from "./follow-ups.js";
export type { FollowUpDraftDto, FollowUpDraftRequestDto } from "./follow-ups.js";
export { createAppointmentDraftDto } from "./appointments.js";
export type { AppointmentDraftDto, AppointmentDraftRequestDto } from "./appointments.js";
export { createConsentDraftDto } from "./consents.js";
export type { ConsentDraftDto, ConsentDraftRequestDto } from "./consents.js";
export { createAuthorizationPermissionDraftDto } from "./authorization.js";
export type {
  AuthorizationPermissionDraftDto,
  AuthorizationPermissionDraftRequestDto
} from "./authorization.js";
export { createPaymentDraftDto } from "./payments.js";
export type { PaymentDraftDto, PaymentDraftRequestDto } from "./payments.js";
export { createProviderDisclosureDecisionDraftDto } from "./provider-disclosure.js";
export type {
  ProviderDisclosureDecisionDraftDto,
  ProviderDisclosureDecisionDraftRequestDto
} from "./provider-disclosure.js";

export const apiClientPackageBoundary = {
  id: "api-client",
  packageName: "@nelyohealth/api-client",
  kind: "shared-package",
  status: "boundary-only",
  owningIssue: "P02-ISS-006",
  publicApi: "Generated OpenAPI typed client boundary",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type ApiClientPackageBoundary = typeof apiClientPackageBoundary;
