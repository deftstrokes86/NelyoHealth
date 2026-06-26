export { createProviderSearchResponseDto } from "./providers.js";
export type { ProviderSearchRequestDto, ProviderSearchResponseDto } from "./providers.js";
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
