/**
 * Server-only Nest API base URL (patient-web BFF). Never exposed to the
 * browser (no NEXT_PUBLIC_ prefix) — only Next.js route handlers and server
 * components call the Nest API.
 */
export function nestApiBaseUrl(): string {
  return process.env.NELYO_API_BASE_URL ?? "http://127.0.0.1:4000";
}
