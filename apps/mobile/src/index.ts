export const mobileApplicationBoundary = {
  id: "mobile",
  packageName: "@nelyohealth/mobile",
  kind: "application",
  status: "boundary-only",
  owningIssue: "P02-ISS-013",
  frameworkTarget: "Expo SDK 56 with React Native 0.85.3",
  runtimeImplementation: false,
  featureImplementation: false
} as const;

export type MobileApplicationBoundary = typeof mobileApplicationBoundary;
