export { createApiHealthResponse, createReadinessResponse } from "./health.js";
export type { ApiHealthResponse, ReadinessResponse } from "./health.js";

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
