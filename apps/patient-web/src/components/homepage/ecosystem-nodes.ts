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
  href: string;
}

export const orbitNodes: EcosystemNodeSpec[] = [
  { id: "doctor", contentPrefix: "marketing-home.ecosystem.node.doctor", icon: Stethoscope, href: "/doctors" },
  { id: "hospital", contentPrefix: "marketing-home.ecosystem.node.hospital", icon: Hospital, href: "/hospitals" },
  { id: "pharmacy", contentPrefix: "marketing-home.ecosystem.node.pharmacy", icon: Pill, href: "/pharmacies" },
  { id: "laboratory", contentPrefix: "marketing-home.ecosystem.node.laboratory", icon: FlaskConical, href: "/laboratories" },
  { id: "records", contentPrefix: "marketing-home.ecosystem.node.records", icon: FileHeart, href: "/medical-records" },
  { id: "emergency", contentPrefix: "marketing-home.ecosystem.node.emergency", icon: Siren, href: "/emergency" },
  { id: "hmo", contentPrefix: "marketing-home.ecosystem.node.hmo", icon: ShieldPlus, href: "/hmos" },
  { id: "employer", contentPrefix: "marketing-home.ecosystem.node.employer", icon: BriefcaseBusiness, href: "/employers" },
  { id: "family", contentPrefix: "marketing-home.ecosystem.node.family", icon: Users, href: "/family-health" },
  { id: "caregiver", contentPrefix: "marketing-home.ecosystem.node.caregiver", icon: HeartHandshake, href: "/home-care" }
];
