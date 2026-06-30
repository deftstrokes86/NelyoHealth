export const mobileShellDescriptor = {
  appId: "mobile",
  issue: "P02-ISS-013",
  syntheticOnly: true,
  nativeFeatureParityClaimed: false
} as const;

export type MobileShellDescriptor = typeof mobileShellDescriptor;

export const mobileApplicationBoundary = {
  id: "mobile",
  packageName: "@nelyohealth/mobile",
  kind: "application",
  status: "shell-runtime",
  owningIssue: "P02-ISS-013",
  frameworkTarget: "Expo SDK 56 with React Native 0.85.3",
  runtimeImplementation: true,
  featureImplementation: false
} as const;

export type MobileApplicationBoundary = typeof mobileApplicationBoundary;
