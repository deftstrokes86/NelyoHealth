import { RequestValidationException } from "./resource-http.js";

/**
 * Timeline keyset cursor (roadmap M7, ADR-0014 edge hygiene).
 *
 * Opaque base64url of `occurredAt|entryId`. A tampered cursor can only re-window
 * the caller's OWN already-authorized read (the subject patient comes from the
 * access context, never the cursor), so a malformed cursor is a uniform 400 — never
 * a 500 and never an oracle.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function encodeTimelineCursor(entry: { occurredAt: string; entryId: string }): string {
  return Buffer.from(`${entry.occurredAt}|${entry.entryId}`, "utf8").toString("base64url");
}

export function decodeTimelineCursor(cursor: string): { occurredAt: string; entryId: string } {
  let decoded: string;
  try {
    decoded = Buffer.from(cursor, "base64url").toString("utf8");
  } catch {
    throw new RequestValidationException("cursor-malformed");
  }
  const separator = decoded.lastIndexOf("|");
  if (separator <= 0) {
    throw new RequestValidationException("cursor-malformed");
  }
  const occurredAt = decoded.slice(0, separator);
  const entryId = decoded.slice(separator + 1);
  if (Number.isNaN(Date.parse(occurredAt)) || !UUID_RE.test(entryId)) {
    throw new RequestValidationException("cursor-malformed");
  }
  return { occurredAt, entryId };
}

/** Clamp a client-supplied limit into a safe range (default 50, hard cap 200). */
export function parseLimit(raw: string | undefined): number {
  if (raw === undefined) return 50;
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value <= 0) return 50;
  return Math.min(value, 200);
}
