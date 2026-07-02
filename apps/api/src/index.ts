export { createApiHealthResponse, createReadinessResponse } from "./health.js";
export type { ApiHealthResponse, ReadinessResponse } from "./health.js";
export { createApiEnvelope, createErrorEnvelope } from "./response.js";
export type { ApiEnvelope, ErrorEnvelopeInput } from "./response.js";
export { createAccountDraft } from "./accounts.js";
export type { AccountDraft, AccountDraftInput } from "./accounts.js";
export {
  createProviderSearchResponse,
  createProviderSearchResponseWithProtectedFields
} from "./providers.js";
export type {
  ProviderSearchInput,
  ProviderSearchInputWithProtectedFields,
  ProviderSearchResponse
} from "./providers.js";
export { createBookingDraft } from "./bookings.js";
export type { BookingDraft, BookingDraftInput } from "./bookings.js";
export { createIntakeDraft } from "./intake.js";
export type { IntakeDraft, IntakeDraftInput } from "./intake.js";
export { createReferralDraft } from "./referrals.js";
export type { ReferralDraft, ReferralDraftInput } from "./referrals.js";
export { createPrescriptionDraft } from "./prescriptions.js";
export type { PrescriptionDraft, PrescriptionDraftInput } from "./prescriptions.js";
export { createDiagnosticResultDraft } from "./diagnostic-results.js";
export type { DiagnosticResultDraft, DiagnosticResultDraftInput } from "./diagnostic-results.js";
export { createFollowUpDraft } from "./follow-ups.js";
export type { FollowUpDraft, FollowUpDraftInput } from "./follow-ups.js";
export { createAppointmentDraft } from "./appointments.js";
export type { AppointmentDraft, AppointmentDraftInput } from "./appointments.js";
export { createConsentDraft } from "./consents.js";
export type { ConsentDraft, ConsentDraftInput } from "./consents.js";
export { createAuthorizationPermissionDraft } from "./authorization.js";
export type {
  AuthorizationPermissionDraft,
  AuthorizationPermissionDraftInput
} from "./authorization.js";
export { createAuthenticationDraft } from "./authentication.js";
export type {
  AuthenticationIntent,
  AuthenticationMode,
  AuthenticationTier,
  AuthenticationDraft,
  AuthenticationDraftInput,
  AuthenticationDecisionDraft
} from "./authentication.js";
export { evaluateAuthenticationDecision } from "./authentication-handlers.js";
export type {
  AuthenticationRiskSignals,
  EvaluateAuthenticationDecisionInput
} from "./authentication-handlers.js";
export { createTenancyAccessDraft } from "./tenancy.js";
export type {
  MembershipStatus,
  RoleScope,
  TenantMembershipDraft,
  TenancyAccessDraft,
  TenancyAccessDraftInput,
  TenancyAccessDecisionDraft,
  MembershipLifecycleDecisionDraft,
  MembershipLifecycleDecisionInput
} from "./tenancy.js";
export {
  evaluateTenancyAccessDecision,
  evaluateMembershipLifecycleDecision
} from "./tenancy-handlers.js";
export type { EvaluateTenancyAccessDecisionInput } from "./tenancy-handlers.js";
export { createAuthorizationPolicyDecisionDraftInput } from "./authorization-policy.js";
export type {
  AuthorizationActorRole,
  ConsentStatus,
  RelationshipStatus,
  SessionStatus,
  AuthorizationPolicyDecisionDraftInput,
  AuditIntentDraft,
  AuthorizationPolicyDecisionDraft
} from "./authorization-policy.js";
export { createAuthorizationRelationshipDraft } from "./relationship-model.js";
export type {
  RelationshipLifecycleStatus,
  RelationshipVerificationMethod,
  RelationshipSupportingDocumentDraft,
  RelationshipReviewHistoryEntryDraft,
  RelationshipRevocationInfoDraft,
  RelationshipLifecycleDraft,
  GuardianRelationship,
  HouseholdRelationship,
  SponsorRelationship,
  CaregiverDelegation,
  EmergencyContact,
  ClinicalProxy,
  AuthorizationRelationshipDraft
} from "./relationship-model.js";
export {
  InMemoryRelationshipRepository,
  RelationshipWorkflowService
} from "./relationship-workflows.js";
export type {
  RelationshipRepository,
  CreateRelationshipInput,
  VerifyRelationshipInput,
  ReviewRelationshipInput,
  AddRelationshipDocumentInput,
  RevokeRelationshipInput
} from "./relationship-workflows.js";
export { createConsentRecordDraft } from "./granular-consent.js";
export type {
  ConsentDomain,
  ConsentVersionStatus,
  ConsentVersionDraft,
  ConsentRecordDraft
} from "./granular-consent.js";
export { evaluateAuthorizationPolicyDecision } from "./authorization-policy-handlers.js";
export { createPaymentDraft } from "./payments.js";
export type { PaymentDraft, PaymentDraftInput } from "./payments.js";
export { createProviderDisclosureDecisionDraft } from "./provider-disclosure.js";
export type {
  ProviderDisclosureDecisionDraft,
  ProviderDisclosureDecisionDraftInput
} from "./provider-disclosure.js";
export { createRefundDraft } from "./refunds.js";
export type { RefundDraft, RefundDraftInput } from "./refunds.js";
export { transitionPaymentStatus } from "./payment-handlers.js";
export type { PaymentTransitionInput } from "./payment-handlers.js";
export { transitionRefundStatus } from "./refund-handlers.js";
export type { RefundTransitionInput } from "./refund-handlers.js";
export { evaluateProviderDisclosureEligibility } from "./provider-disclosure-handlers.js";
export type { ProviderDisclosureEligibilityInput } from "./provider-disclosure-handlers.js";
export {
  scheduleAppointmentStatus,
  createBookingWithAppointment,
  transitionBookingStatus,
  handleAppointmentScheduleRoute,
  handleBookingCreateRoute,
  handleBookingTransitionRoute
} from "./appointment-booking.js";
export type {
  AppointmentScheduleInput,
  BookingCreateInput,
  BookingCompleteInput,
  AppointmentScheduleRouteRequest,
  BookingCreateRouteRequest,
  BookingTransitionRouteRequest
} from "./appointment-booking.js";
export {
  handleAuthenticationDecisionRoute,
  handleTenancyAccessDecisionRoute,
  handleAuthorizationPolicyDecisionRoute,
  handlePaymentTransitionRoute,
  handleRefundTransitionRoute,
  handleProviderDisclosureEligibilityRoute
} from "./runtime-routes.js";
export type {
  AuthenticationDecisionRouteRequest,
  TenancyAccessDecisionRouteRequest,
  AuthorizationPolicyDecisionRouteRequest,
  RuntimeRouteMeta,
  PaymentTransitionRouteRequest,
  RefundTransitionRouteRequest,
  ProviderDisclosureEligibilityRouteRequest
} from "./runtime-routes.js";
export {
  createReferralDraftAdvanced,
  createPrescriptionDraftAdvanced,
  transitionReferralStatus,
  transitionPrescriptionStatus
} from "./referral-prescription.js";
export type {
  ReferralDraftAdvanced,
  ReferralDraftAdvancedInput,
  PrescriptionDraftAdvanced,
  PrescriptionDraftAdvancedInput,
  ReferralStatusUpdateInput,
  PrescriptionStatusUpdateInput
} from "./referral-prescription.js";
export {
  handleReferralStatusRoute,
  handlePrescriptionStatusRoute
} from "./referral-prescription-routes.js";
export type {
  ReferralStatusRouteRequest,
  PrescriptionStatusRouteRequest
} from "./referral-prescription-routes.js";
export {
  createTracingContext,
  extractTracingContext,
  tracingContextToHeaders
} from "./tracing-context.js";
export type { TracingContext } from "./tracing-context.js";
export { createNestApiApp } from "./nest/bootstrap.js";

export const apiApplicationBoundary = {
  id: "api",
  packageName: "@nelyohealth/api",
  kind: "application",
  status: "boundary-only",
  owningIssue: "P02-ISS-005",
  frameworkTarget: "NestJS 11",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type ApiApplicationBoundary = typeof apiApplicationBoundary;
