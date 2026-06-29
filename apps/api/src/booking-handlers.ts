import type { BookingDraft } from "./bookings.js";
import type { AppointmentDraft } from "./appointments.js";

export interface BookingCreateInput {
  booking: BookingDraft;
  appointment: AppointmentDraft;
  createdAt: string;
}

export interface BookingCompleteInput {
  booking: BookingDraft;
  completedAt: string;
}

const BOOKING_TRANSITIONS: Record<
  BookingDraft["status"],
  BookingDraft["status"][]
> = {
  "draft": ["requested"],
  "requested": ["approved", "denied"],
  "approved": ["scheduled", "cancelled"],
  "denied": [],
  "scheduled": ["completed", "cancelled"],
  "completed": [],
  "cancelled": []
};

/**
 * Create a booking with an appointment reference.
 * Validates that the appointment is in a valid state for booking.
 */
export function createBookingWithAppointment(input: BookingCreateInput): BookingDraft {
  const validAppointmentStates: AppointmentDraft["status"][] = [
    "pending",
    "scheduled",
    "confirmed"
  ];

  if (!validAppointmentStates.includes(input.appointment.status)) {
    throw new Error(
      `Cannot create booking for appointment in ${input.appointment.status} state`
    );
  }

  return {
    ...input.booking,
    status: "requested",
    appointmentId: input.appointment.appointmentId,
    createdAt: input.createdAt,
    requestedAt: input.createdAt
  };
}

/**
 * Transition booking status with legal transition enforcement.
 */
export function transitionBookingStatus(
  booking: BookingDraft,
  toStatus: BookingDraft["status"],
  transitionedAt: string
): BookingDraft {
  const allowedTransitions = BOOKING_TRANSITIONS[booking.status];

  if (!allowedTransitions.includes(toStatus)) {
    throw new Error(
      `Invalid booking transition from ${booking.status} to ${toStatus}`
    );
  }

  return {
    ...booking,
    status: toStatus,
    requestedAt: toStatus === "requested" ? transitionedAt : booking.requestedAt,
    approvedAt: toStatus === "approved" ? transitionedAt : booking.approvedAt,
    deniedAt: toStatus === "denied" ? transitionedAt : booking.deniedAt,
    scheduledAt: toStatus === "scheduled" ? transitionedAt : booking.scheduledAt,
    completedAt: toStatus === "completed" ? transitionedAt : booking.completedAt,
    cancelledAt: toStatus === "cancelled" ? transitionedAt : booking.cancelledAt
  };
}
