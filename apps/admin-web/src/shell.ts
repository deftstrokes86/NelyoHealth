export const adminShellDescriptor = {
  appId: "admin-web",
  issue: "P02-ISS-012",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type AdminShellDescriptor = typeof adminShellDescriptor;

export function createAdminShellApiClient<TClient>(
  baseUrl: string,
  factory: (resolvedBaseUrl: string) => TClient
): TClient {
  return factory(baseUrl);
}
