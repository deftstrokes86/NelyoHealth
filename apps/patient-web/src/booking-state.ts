export interface BookingState {
  selectedBookingId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialBookingState(): BookingState {
  return {
    selectedBookingId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createBookingStateWithSelection(bookingId: string): BookingState {
  return {
    selectedBookingId: bookingId,
    isLoading: false,
    errorMessage: null
  };
}
