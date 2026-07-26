import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TIMELINE_ENTRY_KINDS,
  TIMELINE_POLICY,
  TIMELINE_REBUILD_MAP,
  TIMELINE_DOMAINS,
  createTimelineProjectionConsumer,
  dispatchPendingOutboxEvents,
  ExternalCallPolicy,
  SyntheticInMemoryOutboxStore,
  SyntheticTransactionAdapter,
  runTransactionalWorkWithOutbox,
  createDomainEventEnvelope
} from "../../packages/database/src/index.js";

/**
 * M6.5 — the timeline inclusion policy + the structural guards (ADR-0013):
 *  - one source of truth (TIMELINE_POLICY / TIMELINE_REBUILD_MAP cannot diverge);
 *  - default-exclude (security/governance/system events absent);
 *  - the policy-guard: every included event MUST carry patientRef in its payload,
 *    so the next person adding a timeline event cannot reintroduce the M6.5 gap.
 */
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("timeline inclusion policy", () => {
  it("includes the expected patient-meaningful care events", () => {
    for (const eventType of [
      "AppointmentBooked",
      "AppointmentStatusChanged",
      "ConsultationCompleted",
      "PrescriptionDispensed",
      "LabResultReported",
      "MedicalRecordEntryAdded",
      "DocumentRegistered",
      "MessagePosted"
    ]) {
      expect(TIMELINE_POLICY[eventType]).toBeTruthy();
    }
  });

  it("DEFAULT-EXCLUDES security, governance, and system events (would leak or are noise)", () => {
    for (const excluded of [
      // security audit — surfacing these leaks
      "BreakGlassRequested",
      "BreakGlassActivated",
      "BreakGlassExpired",
      "BreakGlassReviewed",
      // governance
      "ConsentGranted",
      "ConsentWithdrawn",
      "RelationshipEstablished",
      "RelationshipRevoked",
      // identity / system / noise
      "AccountRegistered",
      "SessionsRevoked",
      "NotificationSent",
      "MessageRead",
      "AppointmentSlotOpened",
      "MedicalRecordOpened",
      "PatientProfileCreated",
      "PatientProfileUpdated"
    ]) {
      expect(TIMELINE_POLICY[excluded]).toBeUndefined();
    }
  });

  it("derives policy + rebuild map from one source (cannot diverge)", () => {
    expect(Object.keys(TIMELINE_POLICY)).toHaveLength(TIMELINE_ENTRY_KINDS.length);
    expect(Object.keys(TIMELINE_REBUILD_MAP)).toHaveLength(TIMELINE_ENTRY_KINDS.length);
    for (const kind of TIMELINE_ENTRY_KINDS) {
      expect(kind.eventType).toBeTruthy();
      expect(kind.commandName).toBeTruthy();
      expect(kind.entryType).toBeTruthy();
      expect(TIMELINE_DOMAINS).toContain(kind.resourceDomain);
      // eventType <-> commandName pairing is bidirectional (drift guard).
      expect(TIMELINE_REBUILD_MAP[kind.commandName].eventType).toBe(kind.eventType);
      expect(TIMELINE_POLICY[kind.eventType].commandName).toBe(kind.commandName);
    }
  });

  // The structural guard (ADR-0013 §4): every included event carries patientRef in its
  // payload, so a timeline-included event can never fail to key to a patient.
  it("policy-guard: every included event emits patientRef in its payload", () => {
    const sources = [
      "appointment",
      "consultation",
      "prescription",
      "laboratory",
      "medical-record",
      "document",
      "messaging"
    ]
      .map((name) => readFileSync(resolve(repoRoot, `apps/api/src/${name}-service.ts`), "utf8"))
      .join("\n");

    for (const { eventType } of TIMELINE_ENTRY_KINDS) {
      const emitIdx = sources.indexOf(`eventType: "${eventType}"`);
      expect(emitIdx, `${eventType} must be emitted`).toBeGreaterThan(-1);
      // The payload block follows the eventType within the same enqueue call.
      const window = sources.slice(emitIdx, emitIdx + 600);
      expect(window, `${eventType} payload must carry patientRef`).toContain("patientRef");
    }
  });
});

interface PoisonPayload extends Record<string, unknown> {
  organizationRef: string;
}

/**
 * ADR-0013 §6 — the poison-event terminal path. The fold-time throw (§4) is the runtime
 * backstop behind the policy-guard above. Under at-least-once redelivery it must NOT retry
 * forever: the dispatcher retries to maxAttempts, then DEAD-LETTERS (terminal, no longer
 * pending). The guard fires BEFORE the pool is touched, so a permanently-malformed event
 * fails loudly and terminally on the guard reason — never a silent drop, never a hot loop.
 */
describe("timeline poison-event terminal path (ADR-0013 §6)", () => {
  it("dead-letters a policy-matched event with no patientRef at maxAttempts, before touching the pool", async () => {
    const outbox = new SyntheticInMemoryOutboxStore<PoisonPayload>();
    // A pool that fails loudly if connected — proves the guard rejects PRE-connect.
    const poolMustNotConnect = {
      connect: async () => {
        throw new Error("POOL_TOUCHED: guard must reject before connecting");
      }
    } as unknown as Parameters<typeof createTimelineProjectionConsumer>[0];
    const consumer = createTimelineProjectionConsumer(poolMustNotConnect);

    // Seed a timeline-INCLUDED event (AppointmentBooked) whose payload omits patientRef.
    await runTransactionalWorkWithOutbox({
      transaction: new SyntheticTransactionAdapter(),
      outbox,
      externalCallPolicy: new ExternalCallPolicy(),
      work: async (ctx) => {
        await ctx.enqueueDomainEvent(
          createDomainEventEnvelope<PoisonPayload>({
            eventId: "poison-1",
            eventType: "AppointmentBooked",
            aggregateId: "appt-1",
            safeContext: {
              requestId: "req",
              correlationId: "corr",
              idempotencyKey: "idem-poison-1",
              operationTag: "appointment.booking.book"
            },
            payload: { organizationRef: "org-1" } // no patientRef — the poison
          })
        );
        return null;
      }
    });

    // maxAttempts = 1 → first failure dead-letters immediately.
    const stats = await dispatchPendingOutboxEvents({
      outbox,
      externalCallPolicy: new ExternalCallPolicy(),
      maxAttempts: 1,
      consumers: [consumer]
    });

    expect(stats).toMatchObject({ dispatched: 0, deadLettered: 1 });
    const record = outbox.readById("poison-1");
    expect(record?.dispatchStatus).toBe("dead-lettered"); // terminal, no longer pending
    // Dead-lettered on the GUARD reason (pre-connect), not on a pool/connect error.
    expect(record?.lastError).toMatch(/no patientRef/);
    expect(record?.lastError).not.toMatch(/POOL_TOUCHED/);
  });
});
