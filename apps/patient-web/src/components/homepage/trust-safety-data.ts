import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  HeartHandshake,
  LockKeyhole,
  Shield,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  UserRound,
  Users
} from "lucide-react";

export type LucideGlyph = LucideIcon;

export interface TrustCardSpec {
  id: string;
  icon: LucideGlyph;
  headlineId: string;
  bodyId: string;
  expandedId: string;
}

export const trustCards: TrustCardSpec[] = [
  {
    id: "privacy",
    icon: ShieldCheck,
    headlineId: "marketing-home.trust-safety.card1.headline",
    bodyId: "marketing-home.trust-safety.card1.body",
    expandedId: "marketing-home.trust-safety.card1.expanded"
  },
  {
    id: "consent",
    icon: UserCheck,
    headlineId: "marketing-home.trust-safety.card2.headline",
    bodyId: "marketing-home.trust-safety.card2.body",
    expandedId: "marketing-home.trust-safety.card2.expanded"
  },
  {
    id: "verified",
    icon: BadgeCheck,
    headlineId: "marketing-home.trust-safety.card3.headline",
    bodyId: "marketing-home.trust-safety.card3.body",
    expandedId: "marketing-home.trust-safety.card3.expanded"
  },
  {
    id: "secure",
    icon: LockKeyhole,
    headlineId: "marketing-home.trust-safety.card4.headline",
    bodyId: "marketing-home.trust-safety.card4.body",
    expandedId: "marketing-home.trust-safety.card4.expanded"
  },
  {
    id: "governance",
    icon: HeartHandshake,
    headlineId: "marketing-home.trust-safety.card5.headline",
    bodyId: "marketing-home.trust-safety.card5.body",
    expandedId: "marketing-home.trust-safety.card5.expanded"
  },
  {
    id: "nigeria",
    icon: Shield,
    headlineId: "marketing-home.trust-safety.card6.headline",
    bodyId: "marketing-home.trust-safety.card6.body",
    expandedId: "marketing-home.trust-safety.card6.expanded"
  }
];

export const trustGovernancePrincipleIds = [
  "marketing-home.trust-safety.governance.principle1",
  "marketing-home.trust-safety.governance.principle2",
  "marketing-home.trust-safety.governance.principle3"
];

export interface TrustMetricSpec {
  id: string;
  valueId: string;
  labelId: string;
}

export const trustMetrics: TrustMetricSpec[] = [
  {
    id: "clinicians",
    valueId: "marketing-home.trust-safety.metric1.value",
    labelId: "marketing-home.trust-safety.metric1.label"
  },
  {
    id: "consent",
    valueId: "marketing-home.trust-safety.metric2.value",
    labelId: "marketing-home.trust-safety.metric2.label"
  },
  {
    id: "monitoring",
    valueId: "marketing-home.trust-safety.metric3.value",
    labelId: "marketing-home.trust-safety.metric3.label"
  },
  {
    id: "encryption",
    valueId: "marketing-home.trust-safety.metric4.value",
    labelId: "marketing-home.trust-safety.metric4.label"
  }
];

export interface PrivacyChainNodeSpec {
  id: string;
  label: string;
  icon: LucideGlyph;
}

export const privacyChainNodes: PrivacyChainNodeSpec[] = [
  { id: "patient", label: "Patient", icon: UserRound },
  { id: "permission", label: "Permission", icon: ShieldCheck },
  { id: "doctor", label: "Doctor", icon: Stethoscope },
  { id: "family", label: "Family", icon: Users }
];

export const trustFinalLineIds = [
  "marketing-home.trust-safety.final.line1",
  "marketing-home.trust-safety.final.line2",
  "marketing-home.trust-safety.final.line3",
  "marketing-home.trust-safety.final.line4",
  "marketing-home.trust-safety.final.line5",
  "marketing-home.trust-safety.final.line6"
];
