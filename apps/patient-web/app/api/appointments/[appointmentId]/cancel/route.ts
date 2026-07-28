import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createPatientApiClient } from "@nelyohealth/api-client";
import { nestApiBaseUrl } from "../../../../../src/lib/api-base";
import { assertSameOrigin } from "../../../../../src/lib/csrf";
import { SESSION_COOKIE_NAME } from "../../../../../src/lib/session-cookie";

/**
 * BFF cancel-appointment route (patient-web). A pure PROXY (ADR-0014): forwards to
 * the Nest API via the typed client and passes the envelope + status through. A
 * denied cancel and a non-existent appointment both come back as the uniform 404;
 * the shell renders both identically. No reshaping, no retries.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ appointmentId: string }> }
): Promise<NextResponse> {
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    return NextResponse.json(
      { data: null, errors: [{ code: "UNAUTHENTICATED", message: "unauthenticated" }] },
      { status: 401 }
    );
  }
  const body = (await request.json().catch(() => ({}))) as { cancellationReasonCode?: string };
  const { appointmentId } = await context.params;
  const client = createPatientApiClient({ baseUrl: nestApiBaseUrl(), sessionToken: sessionId });
  const result = await client.cancelAppointment(appointmentId, {
    cancellationReasonCode: body.cancellationReasonCode
  });
  return NextResponse.json({ data: result.data, errors: result.errors }, { status: result.status });
}
