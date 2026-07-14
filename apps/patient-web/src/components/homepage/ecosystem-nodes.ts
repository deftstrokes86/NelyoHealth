import type { ComponentType, SVGProps } from "react";
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
  UserRound,
  Users
} from "lucide-react";

export type LucideGlyph = ComponentType<SVGProps<SVGSVGElement>>;

export interface EcosystemNodeSpec {
  id: string;
  contentPrefix: string;
  icon: LucideGlyph;
  angleDegrees: number;
}

export const CENTER = { x: 500, y: 380 };
export const ORBIT_RADIUS = 300;
export const CANVAS = { width: 1000, height: 760 };

export const centerNode = {
  id: "patient",
  contentPrefix: "marketing-home.ecosystem.patient",
  icon: UserRound
};

export const orbitNodes: EcosystemNodeSpec[] = [
  { id: "doctor", contentPrefix: "marketing-home.ecosystem.node.doctor", icon: Stethoscope, angleDegrees: 270 },
  { id: "hospital", contentPrefix: "marketing-home.ecosystem.node.hospital", icon: Hospital, angleDegrees: 306 },
  { id: "pharmacy", contentPrefix: "marketing-home.ecosystem.node.pharmacy", icon: Pill, angleDegrees: 342 },
  { id: "laboratory", contentPrefix: "marketing-home.ecosystem.node.laboratory", icon: FlaskConical, angleDegrees: 18 },
  { id: "records", contentPrefix: "marketing-home.ecosystem.node.records", icon: FileHeart, angleDegrees: 54 },
  { id: "emergency", contentPrefix: "marketing-home.ecosystem.node.emergency", icon: Siren, angleDegrees: 90 },
  { id: "hmo", contentPrefix: "marketing-home.ecosystem.node.hmo", icon: ShieldPlus, angleDegrees: 126 },
  { id: "employer", contentPrefix: "marketing-home.ecosystem.node.employer", icon: BriefcaseBusiness, angleDegrees: 162 },
  { id: "family", contentPrefix: "marketing-home.ecosystem.node.family", icon: Users, angleDegrees: 198 },
  { id: "caregiver", contentPrefix: "marketing-home.ecosystem.node.caregiver", icon: HeartHandshake, angleDegrees: 234 }
];

export const positionForAngle = (angleDegrees: number) => {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: CENTER.x + ORBIT_RADIUS * Math.cos(radians),
    y: CENTER.y + ORBIT_RADIUS * Math.sin(radians)
  };
};

export const allNodeSpecs = [
  { id: centerNode.id, contentPrefix: centerNode.contentPrefix, icon: centerNode.icon },
  ...orbitNodes.map(({ id, contentPrefix, icon }) => ({ id, contentPrefix, icon }))
];
