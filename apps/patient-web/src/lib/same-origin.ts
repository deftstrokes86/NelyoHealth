/**
 * Pure same-origin check for CSRF defense (roadmap M7.1, ADR-0014). Kept free of
 * any `next/server` import so it is unit-testable in the roadmap suite. A
 * state-changing request is same-origin iff its `Origin` (or, failing that,
 * `Referer`) host matches the request `Host`; a request with neither is rejected.
 */
export function isSameOrigin(input: {
  host: string | null;
  origin: string | null;
  referer: string | null;
}): boolean {
  const sourceHost = hostOf(input.origin) ?? hostOf(input.referer);
  return Boolean(input.host && sourceHost && sourceHost === input.host);
}

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}
