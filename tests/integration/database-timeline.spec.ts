import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  createTimelineProjectionConsumer,
  listTimelineForPatient,
  rebuildTimelineFromAudit,
  TIMELINE_ENTRY_KINDS,
  type OutboxEventRecord
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  createPgTimelineServiceDeps,
  readPatientTimeline,
  type TimelineAccessContext
} from "../../apps/api/src/timeline-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

/**
 * M6.5 timeline projection + read-time per-domain filtering (ADR-0013). Proves:
 * payload-fold idempotency; per-domain filtering incl. the messaging metadata-leak
 * guard (a care-circle member with all consent still sees no message entries); live
 * revocation; and rebuild-from-audit fact-equivalence.
 */
describe.skipIf(!shouldRun)("timeline projection + per-domain filtering", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const consentDeps = createPgConsentServiceDeps(pool);
  const timelineDeps = createPgTimelineServiceDeps(pool);
  const consumer = createTimelineProjectionConsumer(pool);

  const run = `tl-${Date.now()}`;
  const patientRefs: string[] = [];
  const correlationIds: string[] = [];

  function safeContext(tag: string) {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      requestId: `req-${run}-${tag}`,
      correlationId,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "t"
    };
  }

  function event(
    eventType: string,
    patientRef: string,
    organizationRef: string,
    aggregateRef: string,
    createdAt?: string
  ): OutboxEventRecord<Record<string, unknown>> {
    return {
      eventId: randomUUID(),
      eventType,
      aggregateId: aggregateRef,
      safeContext: {
        requestId: `req-${run}`,
        correlationId: `corr-${run}`,
        idempotencyKey: `idem-${run}`,
        operationTag: "t"
      },
      payload: { patientRef, organizationRef, aggregateRef },
      createdAt: createdAt ?? new Date().toISOString(),
      dispatchStatus: "pending",
      dispatchAttempts: 0,
      lastError: null,
      dispatchedAt: null
    };
  }

  function newPatient() {
    const patientRef = randomUUID();
    patientRefs.push(patientRef);
    return { patientRef, organizationRef: randomUUID() };
  }

  async function grantBaseline(patientRef: string, organizationRef: string, tag: string) {
    await grantConsent(consentDeps, {
      patientRef,
      organizationRef,
      grantedDomains: [],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor: {
        accountRef: patientRef,
        personaKind: "personal",
        actorRole: "patient",
        tenantRef: null
      },
      safeContext: safeContext(`${tag}-consent`)
    });
  }

  function readerAccess(
    actorId: string,
    actorRole: "patient" | "caregiver",
    patientRef: string,
    organizationRef: string
  ): TimelineAccessContext {
    return {
      decisionRequestId: `dr-${run}-${randomUUID()}`,
      actorId,
      actorRole,
      actorType: actorRole,
      patientId: patientRef,
      organizationId: organizationRef,
      purpose: "care-coordination",
      requiresRelationship: false,
      relationshipType: "none",
      requestedConsentDomains: [],
      sessionStatus: "active",
      sameTenant: true,
      emergencyStatus: "none",
      activeEncounter: true,
      evaluatedAt: new Date().toISOString()
    };
  }

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const patientRef of patientRefs) {
      await client.query(`DELETE FROM nelyo_timeline.timeline_entry WHERE patient_ref = $1`, [
        patientRef
      ]);
      await client.query(
        `DELETE FROM nelyo_consent.consent_version WHERE consent_id IN
           (SELECT consent_id FROM nelyo_consent.consent_record WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_consent.consent_record WHERE patient_ref = $1`, [
        patientRef
      ]);
      await client.query(
        `DELETE FROM nelyo_foundation.audit_event WHERE safe_details->>'patientRef' = $1`,
        [patientRef]
      );
    }
    for (const correlationId of correlationIds) {
      await client.query(`DELETE FROM nelyo_foundation.audit_event WHERE correlation_id = $1`, [
        correlationId
      ]);
      await client.query(
        `DELETE FROM nelyo_foundation.transactional_outbox WHERE correlation_id = $1`,
        [correlationId]
      );
    }
    await client.end();
    await pool.end();
  });

  it("folds a policy-matched event into a reference-only entry, idempotently", async () => {
    const { patientRef, organizationRef } = newPatient();
    const apptId = randomUUID();
    const evt = event("AppointmentBooked", patientRef, organizationRef, apptId);
    await consumer.consume(evt);
    await consumer.consume(evt); // redelivery

    const entries = await listTimelineForPatient(client, { patientRef });
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      resourceDomain: "appointment",
      entryType: "appointment-booked",
      aggregateRef: apptId,
      patientRef
    });
    // Reference-only: no clinical content column exists on the entry.
    expect(JSON.stringify(entries[0])).not.toMatch(/reason|note|diagnosis|clinical|body/i);
  });

  it("filters per domain: self sees all incl. message; a consented care-circle member sees NO message entries", async () => {
    const { patientRef, organizationRef } = newPatient();
    await grantBaseline(patientRef, organizationRef, "filter");
    await consumer.consume(event("AppointmentBooked", patientRef, organizationRef, randomUUID()));
    await consumer.consume(event("PrescriptionIssued", patientRef, organizationRef, randomUUID()));
    await consumer.consume(event("MessagePosted", patientRef, organizationRef, randomUUID()));

    // The patient (self) sees all three domains.
    const asPatient = await readPatientTimeline(timelineDeps, {
      access: readerAccess(patientRef, "patient", patientRef, organizationRef)
    });
    expect(asPatient.status).toBe("allowed");
    if (asPatient.status === "allowed") {
      const domains = new Set(asPatient.entries.map((e) => e.resourceDomain));
      expect(domains).toEqual(new Set(["appointment", "medication", "message"]));
    }

    // A care-circle member WITH all consent still sees NO message entries — the
    // messaging metadata-leak guard (message is participant/self-scoped, not consent).
    const asCaregiver = await readPatientTimeline(timelineDeps, {
      access: readerAccess(randomUUID(), "caregiver", patientRef, organizationRef)
    });
    expect(asCaregiver.status).toBe("allowed");
    if (asCaregiver.status === "allowed") {
      const domains = new Set(asCaregiver.entries.map((e) => e.resourceDomain));
      expect(domains.has("message")).toBe(false);
      expect(domains.has("appointment")).toBe(true);
      expect(domains.has("medication")).toBe(true);
    }
  });

  it("propagates consent withdrawal to the next filtered read", async () => {
    const { patientRef, organizationRef } = newPatient();
    await grantBaseline(patientRef, organizationRef, "revoke");
    await consumer.consume(event("AppointmentBooked", patientRef, organizationRef, randomUUID()));
    const caregiver = randomUUID();

    const before = await readPatientTimeline(timelineDeps, {
      access: readerAccess(caregiver, "caregiver", patientRef, organizationRef)
    });
    expect(before.status === "allowed" && before.entries.length).toBeGreaterThan(0);

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: {
        accountRef: patientRef,
        personaKind: "personal",
        actorRole: "patient",
        tenantRef: null
      },
      safeContext: safeContext("revoke-withdraw")
    });

    const after = await readPatientTimeline(timelineDeps, {
      access: readerAccess(caregiver, "caregiver", patientRef, organizationRef)
    });
    // Consent gone -> the timeline ACCESS decision itself now denies.
    expect(after.status).toBe("denied");
  });

  it("rebuild-from-audit equals the incremental fold by FACT and preserves display order", async () => {
    const { patientRef, organizationRef } = newPatient();
    // A sample of kinds across domains; incremental via events + matching audit rows.
    const sample = TIMELINE_ENTRY_KINDS.filter((k) =>
      ["AppointmentBooked", "PrescriptionDispensed", "LabResultReported", "MessagePosted"].includes(
        k.eventType
      )
    );
    // DISTINCT timestamp sources (ADR-0013 §5.2): the incremental fold reads the event's
    // `createdAt`; the rebuild reads the audit row's `occurred_at`. We model production —
    // audit stamp always ≥ event stamp within a transaction — by offsetting the audit
    // occurred_at +300ms after the event createdAt, while spacing the events 2s apart so
    // the two sources still yield the SAME chronological order (the bounded guarantee).
    const base = Date.now();
    const facts: string[] = [];
    for (let i = 0; i < sample.length; i += 1) {
      const kind = sample[i];
      const aggregateRef = randomUUID();
      const eventCreatedAt = new Date(base + i * 2000).toISOString();
      const auditOccurredAt = new Date(base + i * 2000 + 300).toISOString(); // ≥ event stamp
      await consumer.consume(
        event(kind.eventType, patientRef, organizationRef, aggregateRef, eventCreatedAt)
      );
      facts.push(`${kind.resourceDomain}|${kind.entryType}|${aggregateRef}`);
      // A matching committed audit row (the rebuild source) with its OWN timestamp source.
      await client.query(
        `INSERT INTO nelyo_foundation.audit_event
           (audit_id, command_name, aggregate_id, action, outcome, actor_account_ref,
            actor_persona_kind, actor_role, tenant_ref, correlation_id, request_id,
            idempotency_key, safe_details, occurred_at)
         VALUES ($1,$2,$3,'x','committed','a','staff','clinician',NULL,$4,$4,$4,$5,$6::timestamptz)`,
        [
          randomUUID(),
          kind.commandName,
          aggregateRef,
          `corr-${run}-rebuild-${aggregateRef}`,
          JSON.stringify({ patientRef, organizationRef }),
          auditOccurredAt
        ]
      );
      correlationIds.push(`corr-${run}-rebuild-${aggregateRef}`);
    }

    const toFact = (e: { resourceDomain: string; entryType: string; aggregateRef: string }) =>
      `${e.resourceDomain}|${e.entryType}|${e.aggregateRef}`;

    // Order as returned by the feed (occurred_at DESC, entry_id DESC) — newest first.
    const incrementalOrder = (await listTimelineForPatient(client, { patientRef, limit: 200 })).map(
      toFact
    );

    await rebuildTimelineFromAudit(client);

    const rebuiltOrder = (await listTimelineForPatient(client, { patientRef, limit: 200 })).map(
      toFact
    );

    // (a) By-FACT equivalence — the multiset matches (occurred_at excluded, it differs by source).
    expect([...incrementalOrder].sort()).toEqual([...facts].sort());
    expect([...rebuiltOrder].sort()).toEqual([...incrementalOrder].sort());
    // (b) Order-preservation — despite the two distinct occurred_at sources, well-separated
    // events display in the SAME chronological order after a rebuild (ADR-0013 §5.2).
    expect(rebuiltOrder).toEqual(incrementalOrder);
  });
});
