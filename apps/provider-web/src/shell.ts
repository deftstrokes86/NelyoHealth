import { createApiClient } from "@nelyohealth/api-client";

export const providerShellDescriptor = {
  appId: "provider-web",
  issue: "P02-ISS-012",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type ProviderShellDescriptor = typeof providerShellDescriptor;

export function createProviderShellApiClient(baseUrl: string) {
  return createApiClient(baseUrl);
}
