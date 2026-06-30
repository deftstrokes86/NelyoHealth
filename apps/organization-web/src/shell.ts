import { createApiClient } from "@nelyohealth/api-client";

export const organizationShellDescriptor = {
  appId: "organization-web",
  issue: "P02-ISS-012",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type OrganizationShellDescriptor = typeof organizationShellDescriptor;

export function createOrganizationShellApiClient(baseUrl: string) {
  return createApiClient(baseUrl);
}
