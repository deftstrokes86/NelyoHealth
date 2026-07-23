import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createDatabaseClient,
  createDatabasePool,
  loadAppointment,
  loadAvailabilitySlot
} from "../../packages/database/src/index.js";
import {
  createPgConsentServiceDeps,
  grantConsent,
  withdrawConsent
} from "../../apps/api/src/consent-service.js";
import {
  bookAppointment,
  cancelAppointment,
  createPgAppointmentServiceDeps,
  openAvailabilitySlot,
  readAppointment,
  rescheduleAppointment,
  transitionAppointmentStatus,
  type AppointmentAccessContext
} from "../../apps/api/src/appointment-service.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";
const SENTINEL_REASON = "SENSITIVE chest pain since this morning";

/**
 * M5.2 appointment persistence + lifecycle + full-pipeline governance against
 * live Postgres. Proves atomic commands, conflict-free booking, no reason-for-
 * visit in events, decide-before-write booking + decide-before-load reads wired
 * to real persisted consent, and consent-withdrawal propagation.
 */
describe.skipIf(!shouldRun)("appointment persistence + lifecycle + access", () => {
  const client = createDatabaseClient();
  const pool = createDatabasePool();
  const appt = createPgAppointmentServiceDeps(pool);
  const consentDeps = createPgConsentServiceDeps(pool);

  const run = `appt-${Date.now()}`;
  const clinicianRefs: string[] = [];
  const patientRefs: string[] = [];
  const correlationIds: string[] = [];

  const staffActor = {
    accountRef: "org-admin-1",
    personaKind: "staff",
    actorRole: "organization-admin",
    tenantRef: null
  } as const;

  function safeContext(tag: string) {
    const correlationId = `corr-${run}-${tag}`;
    correlationIds.push(correlationId);
    return {
      requestId: `req-${run}-${tag}`,
      correlationId,
      idempotencyKey: `idem-${run}-${tag}`,
      operationTag: "appointment.booking.book"
    };
  }

  function patientActor(patientRef: string) {
    return {
      accountRef: patientRef,
      personaKind: "personal",
      actorRole: "patient",
      tenantRef: null
    } as const;
  }

  function bookingAccess(patientRef: string, organizationRef: string): AppointmentAccessContext {
    return {
      decisionRequestId: `dr-${run}`,
      actorId: patientRef,
      actorRole: "patient",
      actorType: "patient",
      patientId: patientRef,
      organizationId: organizationRef,
      purpose: "care-delivery",
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

  async function grantBaselineConsent(patientRef: string, organizationRef: string, tag: string) {
    await grantConsent(consentDeps, {
      patientRef,
      organizationRef,
      grantedDomains: [],
      effectiveDate: "2026-01-01T00:00:00.000Z",
      actor: patientActor(patientRef),
      safeContext: safeContext(tag)
    });
  }

  async function openSlot(
    clinicianRef: string,
    organizationRef: string,
    tag: string,
    start: string,
    end: string
  ) {
    const opened = await openAvailabilitySlot(appt, {
      clinicianRef,
      organizationRef,
      startAt: start,
      endAt: end,
      actor: staffActor,
      safeContext: safeContext(tag)
    });
    return opened.slotId;
  }

  function newSubjects() {
    const clinicianRef = randomUUID();
    const patientRef = randomUUID();
    const organizationRef = randomUUID();
    clinicianRefs.push(clinicianRef);
    patientRefs.push(patientRef);
    return { clinicianRef, patientRef, organizationRef };
  }

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    for (const clinicianRef of clinicianRefs) {
      await client.query(`DELETE FROM nelyo_appointment.appointment WHERE clinician_ref = $1`, [
        clinicianRef
      ]);
      await client.query(
        `DELETE FROM nelyo_appointment.availability_slot WHERE clinician_ref = $1`,
        [clinicianRef]
      );
    }
    for (const patientRef of patientRefs) {
      await client.query(
        `DELETE FROM nelyo_consent.consent_version WHERE consent_id IN
           (SELECT consent_id FROM nelyo_consent.consent_record WHERE patient_ref = $1)`,
        [patientRef]
      );
      await client.query(`DELETE FROM nelyo_consent.consent_record WHERE patient_ref = $1`, [
        patientRef
      ]);
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

  it("books a slot with gated authorization, keeps reason-for-visit out of events, and blocks double-booking", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "book-consent");
    const slotId = await openSlot(
      clinicianRef,
      organizationRef,
      "book-slot",
      "2026-08-01T09:00:00.000Z",
      "2026-08-01T09:30:00.000Z"
    );

    const ctx = safeContext("book");
    const booked = await bookAppointment(appt, {
      slotId,
      appointmentType: "consultation",
      reasonForVisit: SENTINEL_REASON,
      access: bookingAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: ctx
    });
    expect(booked.status).toBe("booked");
    const appointmentId = booked.status === "booked" ? booked.appointmentId : "";

    // State: appointment confirmed, slot booked, reason persisted.
    const appointment = await loadAppointment(client, appointmentId);
    expect(appointment).toMatchObject({ status: "confirmed", appointmentType: "consultation" });
    expect(appointment?.reasonForVisit).toBe(SENTINEL_REASON);
    const slot = await loadAvailabilitySlot(client, slotId);
    expect(slot?.status).toBe("booked");

    // Event + audit carry no reason-for-visit.
    const outbox = await client.query(
      `SELECT event_type, payload_json::text AS payload FROM nelyo_foundation.transactional_outbox
        WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(outbox.rows[0].event_type).toBe("AppointmentBooked");
    expect(outbox.rows[0].payload).not.toContain("SENSITIVE");
    const audit = await client.query(
      `SELECT safe_details::text AS details FROM nelyo_foundation.audit_event WHERE correlation_id = $1`,
      [ctx.correlationId]
    );
    expect(audit.rows[0].details).not.toContain("SENSITIVE");

    // A second booking against the same (now booked) slot is refused.
    const again = await bookAppointment(appt, {
      slotId,
      appointmentType: "consultation",
      access: bookingAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: safeContext("book-again")
    });
    expect(again.status).toBe("slot-unavailable");
  });

  it("denies an unauthorized booking (no consent) and leaves the slot open", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    const slotId = await openSlot(
      clinicianRef,
      organizationRef,
      "deny-slot",
      "2026-08-02T09:00:00.000Z",
      "2026-08-02T09:30:00.000Z"
    );

    const outcome = await bookAppointment(appt, {
      slotId,
      appointmentType: "consultation",
      access: bookingAccess(patientRef, organizationRef), // no consent granted
      actor: patientActor(patientRef),
      safeContext: safeContext("deny-book")
    });
    expect(outcome.status).toBe("denied");
    if (outcome.status === "denied") {
      expect(outcome.decision.reasonCode).toBe("consent-missing");
    }
    // The slot was never claimed.
    const slot = await loadAvailabilitySlot(client, slotId);
    expect(slot?.status).toBe("open");
  });

  it("governs an appointment read and propagates consent withdrawal", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "read-consent");
    const slotId = await openSlot(
      clinicianRef,
      organizationRef,
      "read-slot",
      "2026-08-03T09:00:00.000Z",
      "2026-08-03T09:30:00.000Z"
    );
    const booked = await bookAppointment(appt, {
      slotId,
      appointmentType: "consultation",
      reasonForVisit: SENTINEL_REASON,
      access: bookingAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: safeContext("read-book")
    });
    const appointmentId = booked.status === "booked" ? booked.appointmentId : "";

    const allowed = await readAppointment(appt, {
      appointmentId,
      access: bookingAccess(patientRef, organizationRef)
    });
    expect(allowed.status).toBe("allowed");
    if (allowed.status === "allowed") {
      expect(allowed.appointment.reasonForVisit).toBe(SENTINEL_REASON);
    }

    await withdrawConsent(consentDeps, {
      patientRef,
      organizationRef,
      revocationReason: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("read-withdraw")
    });

    const denied = await readAppointment(appt, {
      appointmentId,
      access: bookingAccess(patientRef, organizationRef)
    });
    expect(denied.status).toBe("denied");
    expect(denied).not.toHaveProperty("appointment");
  });

  it("cancels an appointment and frees the slot", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "cancel-consent");
    const slotId = await openSlot(
      clinicianRef,
      organizationRef,
      "cancel-slot",
      "2026-08-04T09:00:00.000Z",
      "2026-08-04T09:30:00.000Z"
    );
    const booked = await bookAppointment(appt, {
      slotId,
      appointmentType: "consultation",
      access: bookingAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: safeContext("cancel-book")
    });
    const appointmentId = booked.status === "booked" ? booked.appointmentId : "";

    const cancelled = await cancelAppointment(appt, {
      appointmentId,
      cancellationReasonCode: "patient-request",
      actor: patientActor(patientRef),
      safeContext: safeContext("cancel")
    });
    expect(cancelled.status).toBe("cancelled");
    expect((await loadAppointment(client, appointmentId))?.status).toBe("cancelled");
    expect((await loadAvailabilitySlot(client, slotId))?.status).toBe("open");
  });

  it("reschedules to a new slot, freeing the old one", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "resched-consent");
    const slotA = await openSlot(
      clinicianRef,
      organizationRef,
      "resched-a",
      "2026-08-05T09:00:00.000Z",
      "2026-08-05T09:30:00.000Z"
    );
    const slotB = await openSlot(
      clinicianRef,
      organizationRef,
      "resched-b",
      "2026-08-05T10:00:00.000Z",
      "2026-08-05T10:30:00.000Z"
    );
    const booked = await bookAppointment(appt, {
      slotId: slotA,
      appointmentType: "consultation",
      access: bookingAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: safeContext("resched-book")
    });
    const appointmentId = booked.status === "booked" ? booked.appointmentId : "";

    const rescheduled = await rescheduleAppointment(appt, {
      appointmentId,
      newSlotId: slotB,
      actor: patientActor(patientRef),
      safeContext: safeContext("resched")
    });
    expect(rescheduled.status).toBe("rescheduled");
    expect((await loadAppointment(client, appointmentId))?.slotRef).toBe(slotB);
    expect((await loadAvailabilitySlot(client, slotA))?.status).toBe("open");
    expect((await loadAvailabilitySlot(client, slotB))?.status).toBe("booked");
  });

  it("advances status through the lifecycle and rejects invalid transitions", async () => {
    const { clinicianRef, patientRef, organizationRef } = newSubjects();
    await grantBaselineConsent(patientRef, organizationRef, "status-consent");
    const slotId = await openSlot(
      clinicianRef,
      organizationRef,
      "status-slot",
      "2026-08-06T09:00:00.000Z",
      "2026-08-06T09:30:00.000Z"
    );
    const booked = await bookAppointment(appt, {
      slotId,
      appointmentType: "consultation",
      access: bookingAccess(patientRef, organizationRef),
      actor: patientActor(patientRef),
      safeContext: safeContext("status-book")
    });
    const appointmentId = booked.status === "booked" ? booked.appointmentId : "";

    expect(
      (
        await transitionAppointmentStatus(appt, {
          appointmentId,
          toStatus: "checked-in",
          actor: staffActor,
          safeContext: safeContext("status-checkin")
        })
      ).status
    ).toBe("transitioned");
    expect(
      (
        await transitionAppointmentStatus(appt, {
          appointmentId,
          toStatus: "completed",
          actor: staffActor,
          safeContext: safeContext("status-complete")
        })
      ).status
    ).toBe("transitioned");
    // Completed is terminal: no further transitions.
    const invalid = await transitionAppointmentStatus(appt, {
      appointmentId,
      toStatus: "cancelled",
      actor: staffActor,
      safeContext: safeContext("status-invalid")
    });
    expect(invalid.status).toBe("invalid-transition");
  });
});
