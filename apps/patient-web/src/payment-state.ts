export interface PaymentState {
  selectedPaymentId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialPaymentState(): PaymentState {
  return {
    selectedPaymentId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createPaymentStateWithSelection(paymentId: string): PaymentState {
  return {
    selectedPaymentId: paymentId,
    isLoading: false,
    errorMessage: null
  };
}
