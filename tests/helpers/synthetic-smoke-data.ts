export const smokeCopy = {
  heading: "NelyoHealth Browser Smoke Check",
  updatedStatus: "Synthetic status updated.",
  validationError: 'Enter "ready" to pass the synthetic validation check.',
  asyncLoading: "Loading synthetic same-origin response...",
  asyncSuccess: "Synthetic same-origin request completed.",
  asyncError: "Synthetic handled error state.",
  dialogTitle: "Synthetic confirmation dialog"
} as const;

export const localOriginAllowList = ["http://127.0.0.1", "http://localhost"] as const;

export const forbiddenProtectedSentinels = [
  "real patient",
  "real provider",
  "clinical record",
  "diagnosis",
  "prescription number",
  "pharmacy address",
  "laboratory address",
  "payment card",
  "production origin",
  "access token",
  "secret key"
] as const;

export const approvedSyntheticStorageKeys: readonly string[] = [];
