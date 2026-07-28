import { NextResponse, type NextRequest } from "next/server";
import { nestApiBaseUrl } from "../../../../src/lib/api-base";
import { assertSameOrigin } from "../../../../src/lib/csrf";

interface NestRegistrationResponse {
  data: { accepted: true } | null;
  errors: Array<{ code: string; message: string }>;
}

/** BFF sign-up route (patient-web). No cookie is set here — registration does not sign the caller in. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.fullName !== "string" ||
    typeof body.email !== "string" ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });
  }

  const upstream = await fetch(`${nestApiBaseUrl()}/api/auth/registrations`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fullName: body.fullName, email: body.email, password: body.password })
  });
  const payload = (await upstream.json()) as NestRegistrationResponse;

  if (!upstream.ok || !payload.data) {
    const reasonCode = payload.errors[0]?.message ?? "generic";
    return NextResponse.json({ error: reasonCode }, { status: upstream.status });
  }

  return NextResponse.json({ accepted: true });
}
