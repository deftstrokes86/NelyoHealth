import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TIMELINE_ENTRY_KINDS,
  TIMELINE_POLICY,
  TIMELINE_REBUILD_MAP,
  TIMELINE_DOMAINS
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

  // The structural guard (ADR-0013): every included event carries patientRef in its
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
