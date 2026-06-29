/**
 * Referral and Prescription boundary contracts.
 * These modules are shared contract definitions that ensure API and client DTOs stay aligned.
 */

export {
  createReferralDraftAdvanced,
  type ReferralDraftAdvanced,
  type ReferralDraftAdvancedInput
} from "./referral-advanced.js";
export {
  createPrescriptionDraftAdvanced,
  type PrescriptionDraftAdvanced,
  type PrescriptionDraftAdvancedInput
} from "./prescription-advanced.js";
export {
  transitionReferralStatus,
  transitionPrescriptionStatus,
  type ReferralStatusUpdateInput,
  type PrescriptionStatusUpdateInput
} from "./referral-prescription-handlers.js";
