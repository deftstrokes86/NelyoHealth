import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  ScopeIntegrityError,
  createDatabaseClient,
  insertAppointment,
  insertAvailabilitySlot,
  loadAppointment,
  loadAvailabilitySlot,
  setAppointmentStatus,
  transitionSlotStatusIf
} from "../../packages/database/src/index.js";

const shouldRun = process.env.NELYO_RUN_DB_INTEGRATION === "1";

/**
 * M8.2 repository tenant-scope belt-and-suspenders (AM-7) against live Postgres.
 *
 * Proves the INDEPENDENT persistence guarantee — separate from the PDP: a mutation
 * addressed at a resource with a MISMATCHED organization cannot cross the tenant
 * boundary. An unconditional write fails closed (ScopeIntegrityError) and leaves the
 * row untouched; a conditional compare-and-set simply doesn't match (benign false);
 * the same write with the CORRECT organization succeeds.
 */
describe.skipIf(!shouldRun)("repository tenant-scope belt (M8.2)", () => {
  const client = createDatabaseClient();
  const orgA = randomUUID();
  const orgB = randomUUID();
  const patientRef = randomUUID();
  const clinicianRef = randomUUID();
  const appointmentId = randomUUID();
  const slotId = randomUUID();
  const nowIso = new Date().toISOString();
  const startAt = new Date(Date.now() + 3_600_000).toISOString();
  const endAt = new Date(Date.now() + 7_200_000).toISOString();

  beforeAll(async () => {
    await client.connect();
    await insertAvailabilitySlot(client, {
      slotId,
      clinicianRef,
      organizationRef: orgA,
      startAt,
      endAt,
      createdAt: nowIso,
      updatedAt: nowIso
    });
    await insertAppointment(client, {
      appointmentId,
      patientRef,
      clinicianRef,
      organizationRef: orgA,
      scheduledStart: startAt,
      scheduledEnd: endAt,
      appointmentType: "consultation",
      status: "confirmed",
      createdAt: nowIso,
      updatedAt: nowIso
    });
  });

  afterAll(async () => {
    await client.query(`DELETE FROM nelyo_appointment.appointment WHERE appointment_id = $1`, [
      appointmentId
    ]);
    await client.query(`DELETE FROM nelyo_appointment.availability_slot WHERE slot_id = $1`, [
      slotId
    ]);
    await client.end();
  });

  it("an unconditional mutation with a MISMATCHED organization fails closed and does not write", async () => {
    await expect(
      setAppointmentStatus(client, {
        appointmentId,
        organizationRef: orgB, // wrong tenant
        status: "cancelled",
        updatedAt: new Date().toISOString()
      })
    ).rejects.toBeInstanceOf(ScopeIntegrityError);
    const after = await loadAppointment(client, appointmentId);
    expect(after?.status).toBe("confirmed"); // untouched — no cross-tenant write
  });

  it("a conditional compare-and-set with a MISMATCHED organization does not match (benign false)", async () => {
    const claimed = await transitionSlotStatusIf(client, {
      slotId,
      organizationRef: orgB, // wrong tenant
      expected: "open",
      next: "booked",
      updatedAt: new Date().toISOString()
    });
    expect(claimed).toBe(false);
    const slot = await loadAvailabilitySlot(client, slotId);
    expect(slot?.status).toBe("open"); // untouched
  });

  it("the SAME writes with the CORRECT organization succeed", async () => {
    const claimed = await transitionSlotStatusIf(client, {
      slotId,
      organizationRef: orgA,
      expected: "open",
      next: "booked",
      updatedAt: new Date().toISOString()
    });
    expect(claimed).toBe(true);
    await setAppointmentStatus(client, {
      appointmentId,
      organizationRef: orgA,
      status: "cancelled",
      updatedAt: new Date().toISOString()
    });
    const after = await loadAppointment(client, appointmentId);
    expect(after?.status).toBe("cancelled");
  });
});
