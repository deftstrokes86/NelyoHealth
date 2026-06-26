export { createProviderDiscoveryViewModel } from "./provider-discovery.js";
export type { ProviderDiscoveryViewModel } from "./provider-discovery.js";
export {
  createInitialProviderDiscoveryState,
  createProviderDiscoveryStateWithSelection
} from "./provider-discovery-state.js";
export type { ProviderDiscoveryState } from "./provider-discovery-state.js";
export { createInitialBookingState, createBookingStateWithSelection } from "./booking-state.js";
export type { BookingState } from "./booking-state.js";

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
