import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "../../../../src/lib/session-cookie";

/**
 * BFF sign-out route (patient-web). Redirects (303) rather than returning
 * JSON so a plain <form method="post"> works without any client-side JS.
 *
 * Disclosed scope limit: this clears the browser's session cookie only. No
 * HTTP endpoint exists yet to revoke a single session server-side (M1.2's
 * executeAccountSessionRevocation revokes ALL of an account's sessions and
 * is not exposed over HTTP) — the session row itself remains "active" until
 * its natural TTL expiry. Sufficient for this deliverable; a real per-session
 * revoke-on-sign-out endpoint is a follow-up, not fabricated here.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL("/sign-in", request.url), 303);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
