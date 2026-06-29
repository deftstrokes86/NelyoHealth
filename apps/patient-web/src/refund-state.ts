export interface RefundState {
  selectedRefundId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function createInitialRefundState(): RefundState {
  return {
    selectedRefundId: null,
    isLoading: false,
    errorMessage: null
  };
}

export function createRefundStateWithSelection(refundId: string): RefundState {
  return {
    selectedRefundId: refundId,
    isLoading: false,
    errorMessage: null
  };
}
