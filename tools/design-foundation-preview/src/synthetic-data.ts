export const protectedProviderSentinels = [
  "PROTECTED_ADDRESS_SENTINEL",
  "PROTECTED_COORDINATE_SENTINEL",
  "PROTECTED_DISTANCE_SENTINEL",
  "PROTECTED_BRANCH_SENTINEL",
  "PROTECTED_PHONE_SENTINEL",
  "PROTECTED_PICKUP_SENTINEL",
  "PROTECTED_MAP_SENTINEL"
] as const;
export const syntheticProviderMatch = {
  providerDisplayName: "CarePoint Pharmacy",
  price: "Synthetic price: NGN 4,200",
  availability: "Synthetic availability: today",
  hiddenDetailSentinel: protectedProviderSentinels.join(" ")
};
export const syntheticPatient = {
  name: "Synthetic Ada Patient",
  sponsor: "Synthetic family sponsor",
  note: "All preview data is synthetic and non-production."
};
