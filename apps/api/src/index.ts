export { createApiHealthResponse, createReadinessResponse } from "./health.js";
export type { ApiHealthResponse, ReadinessResponse } from "./health.js";
export { createApiEnvelope, createErrorEnvelope } from "./response.js";
export type { ApiEnvelope, ErrorEnvelopeInput } from "./response.js";
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
