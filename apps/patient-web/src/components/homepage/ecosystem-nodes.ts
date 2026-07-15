import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  FileHeart,
  FlaskConical,
  HeartHandshake,
  Hospital,
  Pill,
  ShieldPlus,
  Siren,
  Stethoscope,
  Users
} from "lucide-react";

export type LucideGlyph = LucideIcon;

export interface EcosystemNodeSpec {
  id: string;
  contentPrefix: string;
  icon: LucideGlyph;
}

export const orbitNodes: EcosystemNodeSpec[] = [
  { id: "doctor", contentPrefix: "marketing-home.ecosystem.node.doctor", icon: Stethoscope },
  { id: "hospital", contentPrefix: "marketing-home.ecosystem.node.hospital", icon: Hospital },
  { id: "pharmacy", contentPrefix: "marketing-home.ecosystem.node.pharmacy", icon: Pill },
  { id: "laboratory", contentPrefix: "marketing-home.ecosystem.node.laboratory", icon: FlaskConical },
  { id: "records", contentPrefix: "marketing-home.ecosystem.node.records", icon: FileHeart },
  { id: "emergency", contentPrefix: "marketing-home.ecosystem.node.emergency", icon: Siren },
  { id: "hmo", contentPrefix: "marketing-home.ecosystem.node.hmo", icon: ShieldPlus },
  { id: "employer", contentPrefix: "marketing-home.ecosystem.node.employer", icon: BriefcaseBusiness },
  { id: "family", contentPrefix: "marketing-home.ecosystem.node.family", icon: Users },
  { id: "caregiver", contentPrefix: "marketing-home.ecosystem.node.caregiver", icon: HeartHandshake }
];
