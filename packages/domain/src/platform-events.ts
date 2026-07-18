import { randomUUID } from "node:crypto";

/**
 * Platform event contract (roadmap M0.2 — Platform Contracts).
 *
 * This module freezes the event ENVELOPE and the versioning rules for every
 * event that leaves a module through the transactional outbox. It encodes the
 * accepted architecture (architecture-evolution-report.md, CANON-006) and the
 * event-catalogue taxonomy.
 *
 * FROZEN RULES (envelope v1):
 * - The envelope field set is frozen. Changing it requires a new
 *   PLATFORM_EVENT_ENVELOPE_VERSION and an explicit governance decision.
 * - Payload schemas version independently per event name via
 *   `schemaVersion`. Within one schemaVersion, payload changes must be
 *   additive-only; breaking changes require schemaVersion + 1.
 * - Event names are PascalCase, past tense, from the event catalogue
 *   (e.g. AppointmentBooked, ConsentWithdrawn).
 * - Payloads carry REFERENCES, never protected bodies: no clinical content,
 *   no authentication secrets, no raw payment data, no protected provider
 *   location (source-of-truth-matrix.md "Data That Must Not Be Duplicated").
 * - Ordering is per aggregate (aggregateType + aggregateId); consumers are
 *   idempotent keyed by eventId.
 *
 * The runtime outbox (packages/database transaction-outbox) adopts this
 * contract when the mandatory transactional-command path lands (roadmap
 * M3.x); until then this module is the single authoritative definition.
 */

/** Frozen envelope version. Bumping this is a governance decision. */
export const PLATFORM_EVENT_ENVELOPE_VERSION = 1 as const;

/** Event taxonomy from the event catalogue. */
export const platformEventKinds = [
  "domain",
  "integration",
  "audit",
  "operational"
] as const;

export type PlatformEventKind = (typeof platformEventKinds)[number];

/** PascalCase event-name rule (catalogue naming convention). */
export const EVENT_NAME_PATTERN = /^[A-Z][A-Za-z0-9]+$/;

/**
 * Canonical forbidden payload-key fragments. Single source of truth for the
 * references-not-bodies rule; the outbox and worker safety checks converge on
 * this list during the M3.x retrofit.
 */
export const FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS = [
  "phi",
  "clinical",
  "secret",
  "password",
  "token",
  "paymentcard",
  "providernpi",
  "provideraddress"
] as const;

/** Correlation and idempotency context carried by every event. */
export interface PlatformEventSafeContext {
  requestId: string;
  correlationId: string;
  idempotencyKey: string;
  operationTag: string;
}

/** The aggregate an event belongs to; the per-aggregate ordering key. */
export interface PlatformEventAggregateRef {
  aggregateType: string;
  aggregateId: string;
}

/**
 * The frozen platform event envelope (v1).
 *
 * Field set is drift-pinned by platform-events.test.ts; do not add, remove,
 * or rename fields without bumping PLATFORM_EVENT_ENVELOPE_VERSION.
 */
export interface PlatformEventEnvelope<
  TPayload extends Record<string, unknown> = Record<string, unknown>
> {
  envelopeVersion: typeof PLATFORM_EVENT_ENVELOPE_VERSION;
  eventId: string;
  eventName: string;
  eventKind: PlatformEventKind;
  schemaVersion: number;
  aggregate: PlatformEventAggregateRef;
  occurredAt: string;
  safeContext: PlatformEventSafeContext;
  payload: TPayload;
}

/** Ordered, frozen field list — the drift-check baseline. */
export const PLATFORM_EVENT_ENVELOPE_FIELDS = [
  "envelopeVersion",
  "eventId",
  "eventName",
  "eventKind",
  "schemaVersion",
  "aggregate",
  "occurredAt",
  "safeContext",
  "payload"
] as const;

export class PlatformEventContractViolation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlatformEventContractViolation";
  }
}

export function assertValidEventName(eventName: string): void {
  if (!EVENT_NAME_PATTERN.test(eventName)) {
    throw new PlatformEventContractViolation(
      `Event name '${eventName}' must be PascalCase (catalogue convention, e.g. AppointmentBooked).`
    );
  }
}

export function assertValidSchemaVersion(schemaVersion: number): void {
  if (!Number.isInteger(schemaVersion) || schemaVersion < 1) {
    throw new PlatformEventContractViolation(
      `schemaVersion must be a positive integer; received '${schemaVersion}'.`
    );
  }
}

export function assertSafeEventPayload(payload: Record<string, unknown>): void {
  for (const payloadKey of Object.keys(payload)) {
    const normalizedKey = payloadKey.toLowerCase();
    for (const fragment of FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS) {
      if (normalizedKey.includes(fragment)) {
        throw new PlatformEventContractViolation(
          `Event payload key '${payloadKey}' violates the references-not-bodies rule (fragment '${fragment}').`
        );
      }
    }
  }
}

export function assertValidPlatformEvent<TPayload extends Record<string, unknown>>(
  envelope: PlatformEventEnvelope<TPayload>
): void {
  if (envelope.envelopeVersion !== PLATFORM_EVENT_ENVELOPE_VERSION) {
    throw new PlatformEventContractViolation(
      `Unsupported envelope version '${envelope.envelopeVersion}'.`
    );
  }
  assertValidEventName(envelope.eventName);
  assertValidSchemaVersion(envelope.schemaVersion);
  if (!envelope.aggregate.aggregateType || !envelope.aggregate.aggregateId) {
    throw new PlatformEventContractViolation(
      "Event aggregate requires both aggregateType and aggregateId (per-aggregate ordering key)."
    );
  }
  if (!envelope.safeContext.correlationId || !envelope.safeContext.idempotencyKey) {
    throw new PlatformEventContractViolation(
      "Event safeContext requires correlationId and idempotencyKey."
    );
  }
  assertSafeEventPayload(envelope.payload);
}

export interface CreatePlatformEventInput<TPayload extends Record<string, unknown>> {
  eventName: string;
  eventKind: PlatformEventKind;
  schemaVersion: number;
  aggregate: PlatformEventAggregateRef;
  safeContext: PlatformEventSafeContext;
  payload: TPayload;
  eventId?: string;
  occurredAt?: string;
}

/** Build and validate a platform event envelope. */
export function createPlatformEvent<TPayload extends Record<string, unknown>>(
  input: CreatePlatformEventInput<TPayload>
): PlatformEventEnvelope<TPayload> {
  const envelope: PlatformEventEnvelope<TPayload> = {
    envelopeVersion: PLATFORM_EVENT_ENVELOPE_VERSION,
    eventId: input.eventId ?? randomUUID(),
    eventName: input.eventName,
    eventKind: input.eventKind,
    schemaVersion: input.schemaVersion,
    aggregate: input.aggregate,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    safeContext: input.safeContext,
    payload: input.payload
  };
  assertValidPlatformEvent(envelope);
  return envelope;
}
