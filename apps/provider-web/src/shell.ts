export const providerShellDescriptor = {
  appId: "provider-web",
  issue: "P02-ISS-012",
  syntheticOnly: true,
  protectedProviderDetailsExposed: false
} as const;

export type ProviderShellDescriptor = typeof providerShellDescriptor;

export function createProviderShellApiClient<TClient>(
  baseUrl: string,
  factory: (resolvedBaseUrl: string) => TClient
): TClient {
  return factory(baseUrl);
}
