export { createProviderDiscoveryViewModel } from "./provider-discovery.js";
export type { ProviderDiscoveryViewModel } from "./provider-discovery.js";
export {
  createInitialProviderDiscoveryState,
  createProviderDiscoveryStateWithSelection
} from "./provider-discovery-state.js";
export type { ProviderDiscoveryState } from "./provider-discovery-state.js";
export { createInitialBookingState, createBookingStateWithSelection } from "./booking-state.js";
export type { BookingState } from "./booking-state.js";
export { createInitialIntakeState, createIntakeStateWithSelection } from "./intake-state.js";
export type { IntakeState } from "./intake-state.js";
export { createIntakeViewModel } from "./intake.js";
export type { IntakeDraftDtoLike, IntakeViewModel } from "./intake.js";
export { createInitialReferralState, createReferralStateWithSelection } from "./referral-state.js";
export type { ReferralState } from "./referral-state.js";
export { createReferralViewModel } from "./referral.js";
export type { ReferralDraftDtoLike, ReferralViewModel } from "./referral.js";
export {
  createInitialPrescriptionState,
  createPrescriptionStateWithSelection
} from "./prescription-state.js";
export type { PrescriptionState } from "./prescription-state.js";
export { createPrescriptionViewModel } from "./prescription.js";
export type { PrescriptionDraftDtoLike, PrescriptionViewModel } from "./prescription.js";
export {
  createInitialDiagnosticResultState,
  createDiagnosticResultStateWithSelection
} from "./diagnostic-result-state.js";
export type { DiagnosticResultState } from "./diagnostic-result-state.js";
export { createDiagnosticResultViewModel } from "./diagnostic-result.js";
export type {
  DiagnosticResultDraftDtoLike,
  DiagnosticResultViewModel
} from "./diagnostic-result.js";
export { createInitialFollowUpState, createFollowUpStateWithSelection } from "./follow-up-state.js";
export type { FollowUpState } from "./follow-up-state.js";
export { createFollowUpViewModel } from "./follow-up.js";
export type { FollowUpDraftDtoLike, FollowUpViewModel } from "./follow-up.js";
export {
  createInitialAppointmentState,
  createAppointmentStateWithSelection
} from "./appointment-state.js";
export type { AppointmentState } from "./appointment-state.js";
export { createAppointmentViewModel } from "./appointment.js";
export type { AppointmentDraftDtoLike, AppointmentViewModel } from "./appointment.js";
export { createInitialConsentState, createConsentStateWithSelection } from "./consent-state.js";
export type { ConsentState } from "./consent-state.js";
export { createConsentViewModel } from "./consent.js";
export type { ConsentDraftDtoLike, ConsentViewModel } from "./consent.js";
export {
  createInitialAuthorizationState,
  createAuthorizationStateWithSelection
} from "./authorization-state.js";
export type { AuthorizationState } from "./authorization-state.js";
export { createAuthorizationPermissionViewModel } from "./authorization.js";
export type {
  AuthorizationPermissionDraftDtoLike,
  AuthorizationPermissionViewModel
} from "./authorization.js";

export const patientWebApplicationBoundary = {
  id: "patient-web",
  packageName: "@nelyohealth/patient-web",
  kind: "application",
  status: "boundary-only",
  owningIssue: "P02-ISS-012",
  frameworkTarget: "Next.js 16",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type PatientWebApplicationBoundary = typeof patientWebApplicationBoundary;
