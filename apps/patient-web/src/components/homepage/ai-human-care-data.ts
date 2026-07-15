import type { LucideIcon } from "lucide-react";
import {
  Bot,
  ClipboardList,
  Eye,
  FileText,
  FlaskConical,
  Lock,
  Network,
  Pill,
  Smartphone,
  Stethoscope,
  UserCheck,
  UserRound
} from "lucide-react";

export type LucideGlyph = LucideIcon;

export interface AiNetworkNodeSpec {
  id: string;
  label: string;
  icon: LucideGlyph;
  angleDegrees: number;
  isCenter?: boolean;
}

/**
 * AI sits at the centre as the efficient coordinating layer — not a robot,
 * not a decision-maker, just the fast connective layer between the people
 * and records that make up care. Satellites are the ecosystem it speeds up.
 */
export const aiNetworkCenter: AiNetworkNodeSpec = {
  id: "ai",
  label: "AI",
  icon: Bot,
  angleDegrees: 0,
  isCenter: true
};

export const aiNetworkSatellites: AiNetworkNodeSpec[] = [
  { id: "patient", label: "Patient", icon: UserRound, angleDegrees: 270 },
  { id: "doctor", label: "Doctor", icon: Stethoscope, angleDegrees: 342 },
  { id: "laboratory", label: "Laboratory", icon: FlaskConical, angleDegrees: 54 },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, angleDegrees: 126 },
  { id: "records", label: "Records", icon: FileText, angleDegrees: 198 }
];

export interface AiFeatureGroupSpec {
  id: string;
  contentPrefix: string;
  icon: LucideGlyph;
  bulletIds: string[];
}

export const aiFeatureGroups: AiFeatureGroupSpec[] = [
  {
    id: "patients",
    contentPrefix: "marketing-home.ai.group1",
    icon: Smartphone,
    bulletIds: [
      "marketing-home.ai.group1.bullet1",
      "marketing-home.ai.group1.bullet2",
      "marketing-home.ai.group1.bullet3"
    ]
  },
  {
    id: "clinicians",
    contentPrefix: "marketing-home.ai.group2",
    icon: ClipboardList,
    bulletIds: [
      "marketing-home.ai.group2.bullet1",
      "marketing-home.ai.group2.bullet2",
      "marketing-home.ai.group2.bullet3"
    ]
  },
  {
    id: "ecosystem",
    contentPrefix: "marketing-home.ai.group3",
    icon: Network,
    bulletIds: [
      "marketing-home.ai.group3.bullet1",
      "marketing-home.ai.group3.bullet2",
      "marketing-home.ai.group3.bullet3"
    ]
  }
];

export interface AiTrustBadgeSpec {
  id: string;
  contentId: string;
  icon: LucideGlyph;
}

export const aiTrustBadges: AiTrustBadgeSpec[] = [
  { id: "clinicians", contentId: "marketing-home.ai.trust.badge1", icon: UserCheck },
  { id: "supports", contentId: "marketing-home.ai.trust.badge2", icon: Bot },
  { id: "privacy", contentId: "marketing-home.ai.trust.badge3", icon: Lock },
  { id: "oversight", contentId: "marketing-home.ai.trust.badge4", icon: Eye }
];
