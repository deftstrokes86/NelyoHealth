import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  FileHeart,
  Heart,
  Network,
  Pill,
  ShieldCheck
} from "lucide-react";

export type LucideGlyph = LucideIcon;

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
