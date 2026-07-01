export interface AppointmentDraft {
  appointmentId: string;
  bookingId?: string | null;
  patientId?: string;
  providerId?: string;
  scheduledFor: string | null;
  status: "pending" | "scheduled" | "confirmed" | "completed" | "cancelled";
  scheduledAt?: string | null;
  confirmedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
}

export interface AppointmentDraftInput {
  appointmentId: string;
  bookingId?: string | null;
  patientId?: string;
  providerId?: string;
  scheduledFor?: string | null;
  status: "pending" | "scheduled" | "confirmed" | "completed" | "cancelled";
  scheduledAt?: string | null;
  confirmedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
}

export function createAppointmentDraft(input: AppointmentDraftInput): AppointmentDraft {
  return {
    appointmentId: input.appointmentId,
    bookingId: input.bookingId ?? null,
    patientId: input.patientId,
    providerId: input.providerId,
    scheduledFor: input.scheduledFor ?? null,
    status: input.status,
    scheduledAt: input.scheduledAt ?? null,
    confirmedAt: input.confirmedAt ?? null,
    completedAt: input.completedAt ?? null,
    cancelledAt: input.cancelledAt ?? null
  };
}
