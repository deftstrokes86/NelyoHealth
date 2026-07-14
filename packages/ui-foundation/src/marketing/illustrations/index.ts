import type { ComponentType } from "react";
import { HeroConnectedCareEcosystem } from "./hero-connected-care-ecosystem.js";
import { HeroUniversalNetwork } from "./hero-universal-network.js";
import { HeroPatientJourney } from "./hero-patient-journey.js";
import { HeroFamilyDiasporaBridge } from "./hero-family-diaspora-bridge.js";
import { HeroProviderClinic } from "./hero-provider-clinic.js";
import { HeroOrganizationPartnership } from "./hero-organization-partnership.js";
import { WorkflowIntake } from "./workflow-intake.js";
import { WorkflowTriage } from "./workflow-triage.js";
import { WorkflowConsult } from "./workflow-consult.js";
import { WorkflowFulfilment } from "./workflow-fulfilment.js";
import { WorkflowFollowup } from "./workflow-followup.js";
import { TrustPrivacy } from "./trust-privacy.js";
import { TrustVerified } from "./trust-verified.js";
import { TrustCoordination } from "./trust-coordination.js";
import { FamilyDiasporaNarrative } from "./family-diaspora-narrative.js";
import { ProviderNarrative } from "./provider-narrative.js";
import { NeutralPlaceholder } from "./neutral-placeholder.js";

export type IllustrationId =
  | "hero-connected-care-ecosystem"
  | "hero-universal-network"
  | "hero-patient-journey"
  | "hero-family-diaspora-bridge"
  | "hero-provider-clinic"
  | "hero-organization-partnership"
  | "workflow-intake"
  | "workflow-triage"
  | "workflow-consult"
  | "workflow-fulfilment"
  | "workflow-followup"
  | "trust-privacy"
  | "trust-verified"
  | "trust-coordination"
  | "family-diaspora-narrative"
  | "provider-narrative"
  | "neutral-placeholder";

export const illustrationRegistry: Record<IllustrationId, ComponentType> = {
  "hero-connected-care-ecosystem": HeroConnectedCareEcosystem,
  "hero-universal-network": HeroUniversalNetwork,
  "hero-patient-journey": HeroPatientJourney,
  "hero-family-diaspora-bridge": HeroFamilyDiasporaBridge,
  "hero-provider-clinic": HeroProviderClinic,
  "hero-organization-partnership": HeroOrganizationPartnership,
  "workflow-intake": WorkflowIntake,
  "workflow-triage": WorkflowTriage,
  "workflow-consult": WorkflowConsult,
  "workflow-fulfilment": WorkflowFulfilment,
  "workflow-followup": WorkflowFollowup,
  "trust-privacy": TrustPrivacy,
  "trust-verified": TrustVerified,
  "trust-coordination": TrustCoordination,
  "family-diaspora-narrative": FamilyDiasporaNarrative,
  "provider-narrative": ProviderNarrative,
  "neutral-placeholder": NeutralPlaceholder
};

export const illustrationIds = Object.keys(
  illustrationRegistry
) as IllustrationId[];

export const resolveIllustration = (id: string): ComponentType => {
  const known = illustrationRegistry[id as IllustrationId];
  return known ?? NeutralPlaceholder;
};
