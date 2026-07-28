import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createPatientApiClient } from "@nelyohealth/api-client";
import { nestApiBaseUrl } from "../../../../../src/lib/api-base";
import { assertSameOrigin } from "../../../../../src/lib/csrf";
import { SESSION_COOKIE_NAME } from "../../../../../src/lib/session-cookie";

/**
 * BFF mark-notification-read route (patient-web). A pure PROXY (ADR-0014): it
 * forwards to the Nest API through the typed client and passes the envelope + status
 * straight back — no reshaping of error bodies, no 404 remapping, no retries. The
 * non-enumeration/DTO guarantees were earned at the Nest edge; the BFF must be
 * incapable of undoing them. 401 is the single exception, handled by the shell.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ notificationId: string }> }
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
  const { notificationId } = await context.params;
  const client = createPatientApiClient({ baseUrl: nestApiBaseUrl(), sessionToken: sessionId });
  const result = await client.markNotificationRead(notificationId);
  return NextResponse.json({ data: result.data, errors: result.errors }, { status: result.status });
}
