/**
 * Session cookie contract (patient-web BFF).
 *
 * The browser never talks to the Nest API directly for auth — Next.js route
 * handlers are the BFF: they call the Nest API server-side and hold the
 * HttpOnly cookie themselves. On later requests needing auth, server code
 * reads this cookie and forwards the session id as the `x-nelyo-session`
 * header the Nest AuthorizationGuard already accepts (M2.3) — no change to
 * the guard was needed.
 */
export const SESSION_COOKIE_NAME = "nelyo_session_id";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 12 * 60 * 60 // 12 hours, matching DEFAULT_SESSION_TTL_MS server-side.
};
