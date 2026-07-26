import { randomUUID } from "node:crypto";
import type { ClientBase, Pool, PoolClient } from "pg";
import type { DomainEventConsumer, OutboxEventRecord } from "./transaction-outbox.js";

/**
 * Timeline / activity-stream projection (roadmap M6.5, ADR-0013).
 *
 * A per-patient chronological feed of patient-meaningful care events, maintained by
 * the timeline projection consumer: a dispatcher subscriber that FOLDS a curated set
 * of reference-only domain events into append-only entries (payload-based, because
 * entries are immutable historical facts, unlike the Care Circle's current-state
 * membership). Entries carry REFERENCES ONLY — no PHI: rendering resolves details
 * through the domain's gated read at display time.
 *
 * Reader filtering is at READ time, per resource_domain, by the reader's live
 * decision for THAT domain's own read path (ADR-0013) — done in the api read
 * service, not here. This projection is eventually-consistent DATA, never an authz
 * cache.
 */

export type TimelineResourceDomain =
  | "appointment"
  | "consultation"
  | "medication"
  | "lab"
  | "clinical-record"
  | "document"
  | "message";

export interface PersistedTimelineEntry {
  entryId: string;
  sourceEventRef: string;
  patientRef: string;
  resourceDomain: TimelineResourceDomain;
  entryType: string;
  aggregateRef: string;
  organizationRef?: string;
  occurredAt: string;
}

/**
 * The SINGLE source of truth for what becomes a timeline entry. Each kind names the
 * domain `eventType` (incremental fold) AND the `commandName` (rebuild-from-audit),
 * so `TIMELINE_POLICY` (by event) and `TIMELINE_REBUILD_MAP` (by command) are
 * DERIVED from one list and cannot diverge (ADR-0013 ruling-(i) condition 1). To add
 * a timeline event, add a row here — and it must carry `patientRef` in its payload
 * (enforced by the policy-guard test) and its audit safeDetails (rebuild contract).
 *
 * Default-EXCLUDE: anything not listed is NOT a timeline entry — system/identity/
 * governance events, and break-glass / denied-access attempts (security audit),
 * are intentionally absent (surfacing them would leak).
 */
interface TimelineEntryKind {
  eventType: string;
  commandName: string;
  entryType: string;
  resourceDomain: TimelineResourceDomain;
}

export const TIMELINE_ENTRY_KINDS: readonly TimelineEntryKind[] = [
  {
    eventType: "AppointmentBooked",
    commandName: "appointment.booking.book",
    entryType: "appointment-booked",
    resourceDomain: "appointment"
  },
  {
    eventType: "AppointmentCancelled",
    commandName: "appointment.booking.cancel",
    entryType: "appointment-cancelled",
    resourceDomain: "appointment"
  },
  {
    eventType: "AppointmentRescheduled",
    commandName: "appointment.booking.reschedule",
    entryType: "appointment-rescheduled",
    resourceDomain: "appointment"
  },
  {
    eventType: "AppointmentStatusChanged",
    commandName: "appointment.booking.transition-status",
    entryType: "appointment-status-changed",
    resourceDomain: "appointment"
  },
  {
    eventType: "ConsultationScheduled",
    commandName: "consultation.encounter.schedule",
    entryType: "consultation-scheduled",
    resourceDomain: "consultation"
  },
  {
    eventType: "ConsultationStarted",
    commandName: "consultation.encounter.start",
    entryType: "consultation-started",
    resourceDomain: "consultation"
  },
  {
    eventType: "ConsultationCompleted",
    commandName: "consultation.encounter.complete",
    entryType: "consultation-completed",
    resourceDomain: "consultation"
  },
  {
    eventType: "ConsultationCancelled",
    commandName: "consultation.encounter.cancel",
    entryType: "consultation-cancelled",
    resourceDomain: "consultation"
  },
  {
    eventType: "ConsultationParticipantAdded",
    commandName: "consultation.encounter.add-participant",
    entryType: "consultation-participant-added",
    resourceDomain: "consultation"
  },
  {
    eventType: "PrescriptionIssued",
    commandName: "prescription.rx.prescribe",
    entryType: "prescription-issued",
    resourceDomain: "medication"
  },
  {
    eventType: "PrescriptionDispensed",
    commandName: "prescription.rx.dispense",
    entryType: "prescription-dispensed",
    resourceDomain: "medication"
  },
  {
    eventType: "PrescriptionCancelled",
    commandName: "prescription.rx.cancel",
    entryType: "prescription-cancelled",
    resourceDomain: "medication"
  },
  {
    eventType: "LabOrderPlaced",
    commandName: "laboratory.order.place",
    entryType: "lab-order-placed",
    resourceDomain: "lab"
  },
  {
    eventType: "LabResultReported",
    commandName: "laboratory.result.record",
    entryType: "lab-result-reported",
    resourceDomain: "lab"
  },
  {
    eventType: "LabOrderCancelled",
    commandName: "laboratory.order.cancel",
    entryType: "lab-order-cancelled",
    resourceDomain: "lab"
  },
  {
    eventType: "MedicalRecordEntryAdded",
    commandName: "medical-record.entry.add",
    entryType: "record-entry-added",
    resourceDomain: "clinical-record"
  },
  {
    eventType: "MedicalRecordEntryAmended",
    commandName: "medical-record.entry.amend",
    entryType: "record-entry-amended",
    resourceDomain: "clinical-record"
  },
  {
    eventType: "MedicalRecordEntryVoided",
    commandName: "medical-record.entry.void",
    entryType: "record-entry-voided",
    resourceDomain: "clinical-record"
  },
  {
    eventType: "DocumentRegistered",
    commandName: "document.document.register",
    entryType: "document-registered",
    resourceDomain: "document"
  },
  {
    eventType: "DocumentArchived",
    commandName: "document.document.archive",
    entryType: "document-archived",
    resourceDomain: "document"
  },
  {
    eventType: "MessageThreadStarted",
    commandName: "messaging.thread.start",
    entryType: "message-thread-started",
    resourceDomain: "message"
  },
  {
    eventType: "MessagePosted",
    commandName: "messaging.message.post",
    entryType: "message-posted",
    resourceDomain: "message"
  },
  {
    eventType: "MessageThreadClosed",
    commandName: "messaging.thread.close",
    entryType: "message-thread-closed",
    resourceDomain: "message"
  }
];

export const TIMELINE_POLICY: Record<string, TimelineEntryKind> = Object.fromEntries(
  TIMELINE_ENTRY_KINDS.map((kind) => [kind.eventType, kind])
);

export const TIMELINE_REBUILD_MAP: Record<string, TimelineEntryKind> = Object.fromEntries(
  TIMELINE_ENTRY_KINDS.map((kind) => [kind.commandName, kind])
);

/** The distinct resource domains a timeline can contain (for per-domain filtering). */
export const TIMELINE_DOMAINS: readonly TimelineResourceDomain[] = Array.from(
  new Set(TIMELINE_ENTRY_KINDS.map((k) => k.resourceDomain))
);

interface TimelineRow {
  entry_id: string;
  source_event_ref: string;
  patient_ref: string;
  resource_domain: TimelineResourceDomain;
  entry_type: string;
  aggregate_ref: string;
  organization_ref: string | null;
  occurred_at: string | Date;
}

function mapEntry(row: TimelineRow): PersistedTimelineEntry {
  return {
    entryId: row.entry_id,
    sourceEventRef: row.source_event_ref,
    patientRef: row.patient_ref,
    resourceDomain: row.resource_domain,
    entryType: row.entry_type,
    aggregateRef: row.aggregate_ref,
    organizationRef: row.organization_ref ?? undefined,
    occurredAt: row.occurred_at instanceof Date ? row.occurred_at.toISOString() : row.occurred_at
  };
}

const TIMELINE_COLUMNS =
  "entry_id, source_event_ref, patient_ref, resource_domain, entry_type, aggregate_ref, " +
  "organization_ref, occurred_at";

/** Insert one entry; idempotent by source_event_ref (ON CONFLICT DO NOTHING). */
export async function insertTimelineEntry(
  client: ClientBase,
  input: {
    entryId: string;
    sourceEventRef: string;
    patientRef: string;
    resourceDomain: TimelineResourceDomain;
    entryType: string;
    aggregateRef: string;
    organizationRef?: string;
    occurredAt: string;
  }
): Promise<boolean> {
  const result = await client.query(
    `INSERT INTO nelyo_timeline.timeline_entry
       (entry_id, source_event_ref, patient_ref, resource_domain, entry_type, aggregate_ref,
        organization_ref, occurred_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (source_event_ref) DO NOTHING
     RETURNING entry_id`,
    [
      input.entryId,
      input.sourceEventRef,
      input.patientRef,
      input.resourceDomain,
      input.entryType,
      input.aggregateRef,
      input.organizationRef ?? null,
      input.occurredAt
    ]
  );
  return (result.rowCount ?? 0) > 0;
}

/** A patient's feed, newest first, cursor-paginated on (occurred_at, entry_id). */
export async function listTimelineForPatient(
  client: ClientBase,
  input: {
    patientRef: string;
    limit?: number;
    /** Return entries strictly older than this cursor (keyset pagination). */
    before?: { occurredAt: string; entryId: string };
  }
): Promise<PersistedTimelineEntry[]> {
  const limit = Math.min(input.limit ?? 50, 200);
  if (input.before) {
    const result = await client.query<TimelineRow>(
      `SELECT ${TIMELINE_COLUMNS} FROM nelyo_timeline.timeline_entry
        WHERE patient_ref = $1
          AND (occurred_at, entry_id) < ($2::timestamptz, $3::uuid)
        ORDER BY occurred_at DESC, entry_id DESC
        LIMIT $4`,
      [input.patientRef, input.before.occurredAt, input.before.entryId, limit]
    );
    return result.rows.map(mapEntry);
  }
  const result = await client.query<TimelineRow>(
    `SELECT ${TIMELINE_COLUMNS} FROM nelyo_timeline.timeline_entry
      WHERE patient_ref = $1
      ORDER BY occurred_at DESC, entry_id DESC
      LIMIT $2`,
    [input.patientRef, limit]
  );
  return result.rows.map(mapEntry);
}

function readString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" ? value : undefined;
}

/**
 * The dispatcher's timeline subscriber (M6.5). On a policy-matched event, folds the
 * reference-only payload into one append-only entry (idempotent by eventId). No-ops
 * on every other event type. GUARD: a policy-matched event MUST carry patientRef —
 * the timeline is patient-keyed — so a missing patientRef throws loudly (a regression
 * surfaces via retry/dead-letter, never a silently-dropped entry).
 */
export function createTimelineProjectionConsumer(
  pool: Pool
): DomainEventConsumer<Record<string, unknown>> {
  return {
    name: "timeline-projection",
    consume: async (event: OutboxEventRecord<Record<string, unknown>>) => {
      const kind = TIMELINE_POLICY[event.eventType];
      if (!kind) {
        return;
      }
      const patientRef = readString(event.payload, "patientRef");
      if (!patientRef) {
        throw new Error(
          `Timeline-included event ${event.eventType} (${event.eventId}) has no patientRef in its payload`
        );
      }
      const client = await pool.connect();
      try {
        await insertTimelineEntry(client, {
          entryId: randomUUID(),
          sourceEventRef: event.eventId,
          patientRef,
          resourceDomain: kind.resourceDomain,
          entryType: kind.entryType,
          aggregateRef: event.aggregateId,
          organizationRef: readString(event.payload, "organizationRef"),
          occurredAt: event.createdAt
        });
      } finally {
        client.release();
      }
    }
  };
}

/**
 * Rebuild (ADR-0013): re-derive the projection from the append-only audit trail —
 * the durable event archive (the outbox is drained). Non-destructive reconcile:
 * truncate, then re-insert one entry per committed, timeline-mapped command audit.
 * Equivalence with the incremental fold is by FACT (patient/domain/type/aggregate) —
 * source_event_ref (audit id vs event id) and the ms-level occurred_at legitimately
 * differ between the two sources. The audit safeDetails.patientRef + aggregate_id +
 * occurred_at consumed here are a CONTRACT (rebuild map is their enforcement).
 */
export async function rebuildTimelineFromAudit(client: ClientBase): Promise<{ rebuilt: number }> {
  await client.query("TRUNCATE nelyo_timeline.timeline_entry");
  const commandNames = Object.keys(TIMELINE_REBUILD_MAP);
  const result = await client.query<{
    audit_id: string;
    command_name: string;
    aggregate_id: string;
    safe_details: Record<string, unknown>;
    occurred_at: string | Date;
  }>(
    `SELECT audit_id, command_name, aggregate_id, safe_details, occurred_at
       FROM nelyo_foundation.audit_event
      WHERE command_name = ANY($1::text[]) AND outcome = 'committed'`,
    [commandNames]
  );
  let rebuilt = 0;
  for (const row of result.rows) {
    const kind = TIMELINE_REBUILD_MAP[row.command_name];
    const patientRef = readString(row.safe_details, "patientRef");
    if (!kind || !patientRef) {
      // Pre-fix audit rows (KL-003) may lack patientRef for the 9 late-added types;
      // those cannot be keyed and are intentionally skipped (documented gap).
      continue;
    }
    const occurredAt =
      row.occurred_at instanceof Date ? row.occurred_at.toISOString() : row.occurred_at;
    await insertTimelineEntry(client, {
      entryId: randomUUID(),
      sourceEventRef: row.audit_id,
      patientRef,
      resourceDomain: kind.resourceDomain,
      entryType: kind.entryType,
      aggregateRef: row.aggregate_id,
      organizationRef: readString(row.safe_details, "organizationRef"),
      occurredAt
    });
    rebuilt += 1;
  }
  return { rebuilt };
}

async function withClient<T>(pool: Pool, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export { withClient as withTimelineClient };
