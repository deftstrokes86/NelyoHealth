type BookingStatus =
  | "draft"
  | "requested"
  | "approved"
  | "denied"
  | "scheduled"
  | "completed"
  | "cancelled";

export interface BookingViewModel {
  bookingId: string;
  patientId: string;
  providerId: string;
  status: BookingStatus;
  appointmentId: string | null;
  createdAt: string | null;
  requestedAt: string | null;
  approvedAt: string | null;
  deniedAt: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export interface BookingSelectionState {
  selectedBookingId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function createBookingViewModel(draft: Partial<BookingViewModel>): BookingViewModel {
  return {
    bookingId: draft.bookingId ?? "",
    patientId: draft.patientId ?? "",
    providerId: draft.providerId ?? "",
    status: draft.status ?? "draft",
    appointmentId: draft.appointmentId ?? null,
    createdAt: draft.createdAt ?? null,
    requestedAt: draft.requestedAt ?? null,
    approvedAt: draft.approvedAt ?? null,
    deniedAt: draft.deniedAt ?? null,
    scheduledAt: draft.scheduledAt ?? null,
    completedAt: draft.completedAt ?? null,
    cancelledAt: draft.cancelledAt ?? null
  };
}

export function selectBooking(bookingId: string): BookingSelectionState {
  return {
    selectedBookingId: bookingId,
    isLoading: false,
    error: null
  };
}
