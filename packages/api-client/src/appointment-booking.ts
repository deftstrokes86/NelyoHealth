export interface AppointmentScheduleDto {
  appointmentId: string;
  patientId: string;
  status: "pending" | "scheduled" | "confirmed" | "completed" | "cancelled";
  scheduledAt: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface BookingDto {
  bookingId: string;
  patientId: string;
  providerId: string;
  status: "draft" | "requested" | "approved" | "denied" | "scheduled" | "completed" | "cancelled";
  appointmentId: string | null;
  createdAt: string | null;
  requestedAt: string | null;
  approvedAt: string | null;
  deniedAt: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export function createAppointmentScheduleDto(input: Partial<AppointmentScheduleDto>): AppointmentScheduleDto {
  return {
    appointmentId: input.appointmentId ?? "",
    patientId: input.patientId ?? "",
    status: input.status ?? "pending",
    scheduledAt: input.scheduledAt ?? null,
    confirmedAt: input.confirmedAt ?? null,
    completedAt: input.completedAt ?? null,
    cancelledAt: input.cancelledAt ?? null
  };
}

export function createBookingDto(input: Partial<BookingDto>): BookingDto {
  return {
    bookingId: input.bookingId ?? "",
    patientId: input.patientId ?? "",
    providerId: input.providerId ?? "",
    status: input.status ?? "draft",
    appointmentId: input.appointmentId ?? null,
    createdAt: input.createdAt ?? null,
    requestedAt: input.requestedAt ?? null,
    approvedAt: input.approvedAt ?? null,
    deniedAt: input.deniedAt ?? null,
    scheduledAt: input.scheduledAt ?? null,
    completedAt: input.completedAt ?? null,
    cancelledAt: input.cancelledAt ?? null
  };
}
