import type { AppointmentDraft } from "./appointments.js";

export interface AppointmentScheduleInput {
  appointment: AppointmentDraft;
  toStatus: AppointmentDraft["status"];
  scheduledAt: string;
}

const APPOINTMENT_TRANSITIONS: Record<
  AppointmentDraft["status"],
  AppointmentDraft["status"][]
> = {
  "pending": ["scheduled", "cancelled"],
  "scheduled": ["confirmed", "cancelled", "completed"],
  "confirmed": ["completed", "cancelled"],
  "completed": [],
  "cancelled": []
};

export function scheduleAppointmentStatus(input: AppointmentScheduleInput): AppointmentDraft {
  const allowedTransitions = APPOINTMENT_TRANSITIONS[input.appointment.status];

  if (!allowedTransitions.includes(input.toStatus)) {
    throw new Error(
      `Invalid appointment transition from ${input.appointment.status} to ${input.toStatus}`
    );
  }

  return {
    ...input.appointment,
    status: input.toStatus,
    scheduledAt: input.toStatus === "scheduled" ? input.scheduledAt : input.appointment.scheduledAt,
    confirmedAt: input.toStatus === "confirmed" ? input.scheduledAt : input.appointment.confirmedAt,
    completedAt: input.toStatus === "completed" ? input.scheduledAt : input.appointment.completedAt,
    cancelledAt: input.toStatus === "cancelled" ? input.scheduledAt : input.appointment.cancelledAt
  };
}
