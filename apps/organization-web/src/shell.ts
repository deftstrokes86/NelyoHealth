export const organizationShellDescriptor = {
  appId: "organization-web",
  issue: "P02-ISS-012",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type OrganizationShellDescriptor = typeof organizationShellDescriptor;

export function createOrganizationShellApiClient<TClient>(
  baseUrl: string,
  factory: (resolvedBaseUrl: string) => TClient
): TClient {
  return factory(baseUrl);
}
