import type { ReferralDraftAdvanced } from "./referral-advanced.js";
import type { PrescriptionDraftAdvanced } from "./prescription-advanced.js";

export interface ReferralStatusUpdateInput {
  referral: ReferralDraftAdvanced;
  toStatus: ReferralDraftAdvanced["status"];
  updatedAt?: string;
  transitionedAt?: string;
  receivingProviderId?: string;
}

export interface PrescriptionStatusUpdateInput {
  prescription: PrescriptionDraftAdvanced;
  toStatus: PrescriptionDraftAdvanced["status"];
  updatedAt?: string;
  transitionedAt?: string;
}

const REFERRAL_TRANSITIONS: Record<
  ReferralDraftAdvanced["status"],
  ReferralDraftAdvanced["status"][]
> = {
  pending: ["sent", "cancelled"],
  sent: ["accepted", "declined", "cancelled"],
  accepted: ["completed", "cancelled"],
  declined: ["cancelled"],
  completed: [],
  cancelled: []
};

const PRESCRIPTION_TRANSITIONS: Record<
  PrescriptionDraftAdvanced["status"],
  PrescriptionDraftAdvanced["status"][]
> = {
  prescribed: ["verified", "cancelled"],
  verified: ["dispensed", "cancelled"],
  dispensed: ["completed", "cancelled"],
  completed: [],
  cancelled: []
};

/**
 * Transition referral status with legal transition enforcement.
 */
export function transitionReferralStatus(input: ReferralStatusUpdateInput): ReferralDraftAdvanced {
  const transitionedAt = input.transitionedAt ?? input.updatedAt;
  if (!transitionedAt) {
    throw new Error("Referral transition requires transitionedAt timestamp.");
  }

  const allowedTransitions = REFERRAL_TRANSITIONS[input.referral.status];

  if (!allowedTransitions.includes(input.toStatus)) {
    throw new Error(
      `Invalid referral transition from ${input.referral.status} to ${input.toStatus}`
    );
  }

  return {
    ...input.referral,
    status: input.toStatus,
    sentAt: input.toStatus === "sent" ? transitionedAt : input.referral.sentAt,
    respondedAt: ["accepted", "declined"].includes(input.toStatus)
      ? transitionedAt
      : input.referral.respondedAt,
    completedAt: input.toStatus === "completed" ? transitionedAt : input.referral.completedAt,
    cancelledAt: input.toStatus === "cancelled" ? transitionedAt : input.referral.cancelledAt,
    receivingProviderId: input.receivingProviderId ?? input.referral.receivingProviderId
  };
}

/**
 * Transition prescription status with legal transition enforcement.
 */
export function transitionPrescriptionStatus(
  input: PrescriptionStatusUpdateInput
): PrescriptionDraftAdvanced {
  const transitionedAt = input.transitionedAt ?? input.updatedAt;
  if (!transitionedAt) {
    throw new Error("Prescription transition requires transitionedAt timestamp.");
  }

  const allowedTransitions = PRESCRIPTION_TRANSITIONS[input.prescription.status];

  if (!allowedTransitions.includes(input.toStatus)) {
    throw new Error(
      `Invalid prescription transition from ${input.prescription.status} to ${input.toStatus}`
    );
  }

  return {
    ...input.prescription,
    status: input.toStatus,
    verifiedAt: input.toStatus === "verified" ? transitionedAt : input.prescription.verifiedAt,
    dispensedAt: input.toStatus === "dispensed" ? transitionedAt : input.prescription.dispensedAt,
    completedAt: input.toStatus === "completed" ? transitionedAt : input.prescription.completedAt,
    cancelledAt: input.toStatus === "cancelled" ? transitionedAt : input.prescription.cancelledAt
  };
}
