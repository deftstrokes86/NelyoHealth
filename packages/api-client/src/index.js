export { createProviderSearchResponseDto } from "./providers.js";
export { createAccountDraftDto } from "./accounts.js";
export { createBookingDraftDto } from "./bookings.js";
export { createIntakeDraftDto } from "./intake.js";
export { createReferralDraftDto } from "./referrals.js";
export { createPrescriptionDraftDto } from "./prescriptions.js";
export { createDiagnosticResultDraftDto } from "./diagnostic-results.js";
export { createFollowUpDraftDto } from "./follow-ups.js";
export { createAppointmentDraftDto } from "./appointments.js";
export { createConsentDraftDto } from "./consents.js";
export { createAuthorizationPermissionDraftDto } from "./authorization.js";
export { createPaymentDraftDto } from "./payments.js";
export { createProviderDisclosureDecisionDraftDto } from "./provider-disclosure.js";
export { createRefundDraftDto } from "./refunds.js";
export { createAppointmentScheduleDto, createBookingDto } from "./appointment-booking.js";
export { createReferralDraftAdvancedDto, createPrescriptionDraftAdvancedDto } from "./referral-prescription.js";
export { createPaymentTransitionRouteRequestDto, createRefundTransitionRouteRequestDto, createProviderDisclosureEligibilityRouteRequestDto } from "./runtime-routes.js";
export { createApiClient } from "./generated/client.js";
// HTTP contract for the M7 resource slice (timeline, care circle, notifications,
// appointments) — the typed request/response DTOs + error envelope the web
// shells consume. Lives under ./http (a subdirectory, so it is intentionally
// outside the api/api-client module-parity gate, which scans top-level only).
export * from "./http/index.js";
export const apiClientPackageBoundary = {
    id: "api-client",
    packageName: "@nelyohealth/api-client",
    kind: "shared-package",
    status: "phase-2-foundation",
    owningIssue: "P02-ISS-006",
    publicApi: "Generated OpenAPI typed client",
    runtimeImplementation: true,
    featureImplementation: false
};
//# sourceMappingURL=index.js.map