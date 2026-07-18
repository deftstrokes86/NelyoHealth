import { describe, expect, it } from "vitest";
import {
  EVENT_NAME_PATTERN,
  FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS,
  PLATFORM_EVENT_ENVELOPE_FIELDS,
  PLATFORM_EVENT_ENVELOPE_VERSION,
  PlatformEventContractViolation,
  assertSafeEventPayload,
  assertValidEventName,
  assertValidSchemaVersion,
  createPlatformEvent,
  platformEventKinds
} from "./platform-events.js";

const safeContext = {
  requestId: "req-1",
  correlationId: "corr-1",
  idempotencyKey: "idem-1",
  operationTag: "test.operation"
};

const aggregate = { aggregateType: "Appointment", aggregateId: "appt-1" };

const buildValid = () =>
  createPlatformEvent({
    eventName: "AppointmentBooked",
    eventKind: "domain",
    schemaVersion: 1,
    aggregate,
    safeContext,
    payload: { appointmentRef: "appt-1", patientRef: "pat-1" }
  });

describe("platform event envelope — frozen contract (drift pins)", () => {
  it("pins envelope version 1", () => {
    expect(PLATFORM_EVENT_ENVELOPE_VERSION).toBe(1);
  });

  it("pins the exact envelope field set", () => {
    const envelope = buildValid();
    expect(Object.keys(envelope).sort()).toEqual([...PLATFORM_EVENT_ENVELOPE_FIELDS].sort());
    // Frozen literal baseline — changing the envelope must fail here first.
    expect([...PLATFORM_EVENT_ENVELOPE_FIELDS]).toEqual([
      "envelopeVersion",
      "eventId",
      "eventName",
      "eventKind",
      "schemaVersion",
      "aggregate",
      "occurredAt",
      "safeContext",
      "payload"
    ]);
  });

  it("pins the event taxonomy to the catalogue kinds", () => {
    expect([...platformEventKinds]).toEqual(["domain", "integration", "audit", "operational"]);
  });

  it("pins the forbidden payload-key fragments (references-not-bodies rule)", () => {
    expect([...FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS]).toEqual([
      "phi",
      "clinical",
      "secret",
      "password",
      "token",
      "paymentcard",
      "providernpi",
      "provideraddress"
    ]);
  });

  it("pins the safeContext and aggregate shapes", () => {
    const envelope = buildValid();
    expect(Object.keys(envelope.safeContext).sort()).toEqual([
      "correlationId",
      "idempotencyKey",
      "operationTag",
      "requestId"
    ]);
    expect(Object.keys(envelope.aggregate).sort()).toEqual(["aggregateId", "aggregateType"]);
  });
});

describe("event naming rule", () => {
  it("accepts catalogue-style PascalCase past-tense names", () => {
    for (const name of ["AppointmentBooked", "ConsentWithdrawn", "PrescriptionIssued"]) {
      expect(() => assertValidEventName(name)).not.toThrow();
      expect(EVENT_NAME_PATTERN.test(name)).toBe(true);
    }
  });

  it("rejects non-PascalCase names", () => {
    for (const name of ["appointmentBooked", "appointment-booked", "APPOINTMENT_BOOKED ", "A", ""]) {
      expect(() => assertValidEventName(name)).toThrow(PlatformEventContractViolation);
    }
  });
});

describe("schema versioning rule", () => {
  it("accepts positive integers", () => {
    expect(() => assertValidSchemaVersion(1)).not.toThrow();
    expect(() => assertValidSchemaVersion(7)).not.toThrow();
  });

  it("rejects zero, negatives, and non-integers", () => {
    for (const version of [0, -1, 1.5, Number.NaN]) {
      expect(() => assertValidSchemaVersion(version)).toThrow(PlatformEventContractViolation);
    }
  });
});

describe("payload safety (references, never bodies)", () => {
  it("accepts reference-style payloads", () => {
    expect(() =>
      assertSafeEventPayload({ appointmentRef: "a", patientRef: "p", reasonCode: "r" })
    ).not.toThrow();
  });

  it("rejects every forbidden fragment", () => {
    for (const fragment of FORBIDDEN_EVENT_PAYLOAD_KEY_FRAGMENTS) {
      expect(() => assertSafeEventPayload({ [`x${fragment}Value`]: "leak" })).toThrow(
        PlatformEventContractViolation
      );
    }
  });
});

describe("createPlatformEvent builder", () => {
  it("defaults eventId (UUID) and occurredAt (ISO instant)", () => {
    const envelope = buildValid();
    expect(envelope.eventId).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Date(envelope.occurredAt).toISOString()).toBe(envelope.occurredAt);
  });

  it("rejects a missing aggregate ordering key", () => {
    expect(() =>
      createPlatformEvent({
        eventName: "AppointmentBooked",
        eventKind: "domain",
        schemaVersion: 1,
        aggregate: { aggregateType: "", aggregateId: "appt-1" },
        safeContext,
        payload: {}
      })
    ).toThrow(PlatformEventContractViolation);
  });

  it("rejects a missing correlation/idempotency context", () => {
    expect(() =>
      createPlatformEvent({
        eventName: "AppointmentBooked",
        eventKind: "domain",
        schemaVersion: 1,
        aggregate,
        safeContext: { ...safeContext, idempotencyKey: "" },
        payload: {}
      })
    ).toThrow(PlatformEventContractViolation);
  });

  it("rejects unsafe payload keys end-to-end", () => {
    expect(() =>
      createPlatformEvent({
        eventName: "AppointmentBooked",
        eventKind: "domain",
        schemaVersion: 1,
        aggregate,
        safeContext,
        payload: { clinicalNoteBody: "must never travel in an event" }
      })
    ).toThrow(PlatformEventContractViolation);
  });
});
