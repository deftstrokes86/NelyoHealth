import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarCheck,
  FileHeart,
  FileText,
  FlaskConical,
  Heart,
  Network,
  Pill,
  ShieldCheck,
  Stethoscope,
  UsersRound
} from "lucide-react";

export type LucideGlyph = LucideIcon;

export interface FamilyAbroadProviderSpec {
  id: string;
  label: string;
  icon: LucideGlyph;
  status: string;
  angleDegrees: number;
}

export const familyAbroadProviders: FamilyAbroadProviderSpec[] = [
  { id: "doctor", label: "Doctor", icon: Stethoscope, status: "Consultation completed", angleDegrees: -90 },
  { id: "hospital", label: "Hospital", icon: Building2, status: "Visit completed", angleDegrees: -30 },
  { id: "laboratory", label: "Laboratory", icon: FlaskConical, status: "Lab results ready", angleDegrees: 30 },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, status: "Medication collected", angleDegrees: 90 },
  { id: "record", label: "Medical Record", icon: FileText, status: "Record updated", angleDegrees: 150 },
  { id: "caregiver", label: "Caregiver", icon: UsersRound, status: "Support confirmed", angleDegrees: 210 }
];

export interface FamilyAbroadNotificationSpec {
  id: string;
  text: string;
  time: string;
}

export const familyAbroadNotifications: FamilyAbroadNotificationSpec[] = [
  { id: "consult", text: "Mum completed today's consultation.", time: "2 min ago" },
  { id: "medication", text: "Medication collected from pharmacy.", time: "35 min ago" },
  { id: "labs", text: "Lab results are ready for review.", time: "1 hr ago" },
  { id: "appointment", text: "Next appointment booked.", time: "Tomorrow, 10:00 AM" }
];

export interface FamilyAbroadCardSpec {
  id: string;
  icon: LucideGlyph;
  headlineId: string;
  bodyId: string;
}

export const familyAbroadCards: FamilyAbroadCardSpec[] = [
  {
    id: "book",
    icon: CalendarCheck,
    headlineId: "marketing-home.family-abroad.card1.headline",
    bodyId: "marketing-home.family-abroad.card1.body"
  },
  {
    id: "consent",
    icon: ShieldCheck,
    headlineId: "marketing-home.family-abroad.card2.headline",
    bodyId: "marketing-home.family-abroad.card2.body"
  },
  {
    id: "ongoing",
    icon: Pill,
    headlineId: "marketing-home.family-abroad.card3.headline",
    bodyId: "marketing-home.family-abroad.card3.body"
  },
  {
    id: "network",
    icon: Network,
    headlineId: "marketing-home.family-abroad.card4.headline",
    bodyId: "marketing-home.family-abroad.card4.body"
  },
  {
    id: "history",
    icon: FileHeart,
    headlineId: "marketing-home.family-abroad.card5.headline",
    bodyId: "marketing-home.family-abroad.card5.body"
  },
  {
    id: "peace",
    icon: Heart,
    headlineId: "marketing-home.family-abroad.card6.headline",
    bodyId: "marketing-home.family-abroad.card6.body"
  }
];

export const familyAbroadStoryLineIds = [
  "marketing-home.family-abroad.story.line1",
  "marketing-home.family-abroad.story.line2",
  "marketing-home.family-abroad.story.line3",
  "marketing-home.family-abroad.story.line4",
  "marketing-home.family-abroad.story.line5",
  "marketing-home.family-abroad.story.line6",
  "marketing-home.family-abroad.story.line7",
  "marketing-home.family-abroad.story.line8",
  "marketing-home.family-abroad.story.line9"
];

export const familyAbroadTrustBadgeIds = [
  "marketing-home.family-abroad.trust.badge1",
  "marketing-home.family-abroad.trust.badge2",
  "marketing-home.family-abroad.trust.badge3",
  "marketing-home.family-abroad.trust.badge4"
];
