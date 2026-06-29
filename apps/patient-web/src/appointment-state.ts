export interface AppointmentState {
  selectedAppointmentId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialAppointmentState(): AppointmentState {
  return {
    selectedAppointmentId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createAppointmentStateWithSelection(appointmentId: string): AppointmentState {
  return {
    selectedAppointmentId: appointmentId,
    isLoading: false,
    errorMessage: null
  };
}
