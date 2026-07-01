export interface BookingDraft {
  bookingId: string;
  patientId: string;
  providerId: string;
  scheduledAt: string | null;
  appointmentId?: string | null;
  createdAt?: string | null;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "draft"
    | "requested"
    | "approved"
    | "denied"
    | "scheduled"
    | "completed";
  requestedAt?: string | null;
  approvedAt?: string | null;
  deniedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
}

export interface BookingDraftInput {
  bookingId: string;
  patientId: string;
  providerId: string;
  scheduledAt: string | null;
  appointmentId?: string | null;
  createdAt?: string | null;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "draft"
    | "requested"
    | "approved"
    | "denied"
    | "scheduled"
    | "completed";
  requestedAt?: string | null;
  approvedAt?: string | null;
  deniedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
}

export function createBookingDraft(input: BookingDraftInput): BookingDraft {
  return {
    bookingId: input.bookingId,
    patientId: input.patientId,
    providerId: input.providerId,
    scheduledAt: input.scheduledAt,
    appointmentId: input.appointmentId ?? null,
    createdAt: input.createdAt ?? null,
    status: input.status,
    requestedAt: input.requestedAt ?? null,
    approvedAt: input.approvedAt ?? null,
    deniedAt: input.deniedAt ?? null,
    completedAt: input.completedAt ?? null,
    cancelledAt: input.cancelledAt ?? null
  };
}
