import { NextResponse, type NextRequest } from "next/server";
import { isSameOrigin } from "./same-origin";

/**
 * CSRF defense for the BFF mutation routes (roadmap M7.1, ADR-0014 edge hygiene).
 *
 * The BFF moves auth from a bearer header to an HttpOnly cookie, which the browser
 * attaches automatically — so a hostile page could drive the browser to POST to a
 * mutation route (sign-out, mark-read, cancel) with the cookie. `SameSite=Lax` on
 * the session cookie is the first line; this origin check is the second: a
 * state-changing request must prove it came from our own origin. Reads (server
 * components) don't need it — they never rely on ambient cookies from the browser.
 */
export function assertSameOrigin(request: NextRequest): NextResponse | null {
  const ok = isSameOrigin({
    host: request.headers.get("host"),
    origin: request.headers.get("origin"),
    referer: request.headers.get("referer")
  });
  if (ok) {
    return null;
  }
  return NextResponse.json(
    { data: null, errors: [{ code: "CSRF_REJECTED", message: "Cross-origin request rejected." }] },
    { status: 403 }
  );
}
