import type { RefundDraft } from "./refunds.js";

const allowedRefundTransitions: Record<RefundDraft["status"], ReadonlyArray<RefundDraft["status"]>> = {
  requested: ["eligibility-review", "failed"],
  "eligibility-review": ["approved", "failed"],
  approved: ["processing", "failed"],
  processing: ["completed", "failed"],
  completed: [],
  failed: []
};

export interface RefundTransitionInput {
  refund: RefundDraft;
  toStatus: RefundDraft["status"];
  transitionedAt: string;
}

export function transitionRefundStatus(input: RefundTransitionInput): RefundDraft {
  const allowed = allowedRefundTransitions[input.refund.status];

  if (!allowed.includes(input.toStatus)) {
    throw new Error(`Invalid refund transition from ${input.refund.status} to ${input.toStatus}`);
  }

  return {
    ...input.refund,
    status: input.toStatus,
    completedAt: input.toStatus === "completed" ? input.transitionedAt : input.refund.completedAt
  };
}
