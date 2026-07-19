import { NextResponse, type NextRequest } from "next/server";
import { nestApiBaseUrl } from "../../../../src/lib/api-base";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "../../../../src/lib/session-cookie";

interface NestSessionResponse {
  data: { sessionId: string; requiresChallenge: boolean; redirectPath: string } | null;
  errors: Array<{ code: string; message: string }>;
}

/**
 * BFF sign-in route (patient-web). The browser calls this, never the Nest
 * API directly. On success, sets the HttpOnly session cookie itself (the
 * Nest API returns only a JSON sessionId — it never sets cookies).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });
  }

  const upstream = await fetch(`${nestApiBaseUrl()}/api/auth/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: body.email, password: body.password })
  });
  const payload = (await upstream.json()) as NestSessionResponse;

  if (!upstream.ok || !payload.data) {
    const reasonCode = payload.errors[0]?.message ?? "generic";
    return NextResponse.json({ error: reasonCode }, { status: upstream.status });
  }

  const response = NextResponse.json({ redirectPath: payload.data.redirectPath });
  response.cookies.set(SESSION_COOKIE_NAME, payload.data.sessionId, SESSION_COOKIE_OPTIONS);
  return response;
}
