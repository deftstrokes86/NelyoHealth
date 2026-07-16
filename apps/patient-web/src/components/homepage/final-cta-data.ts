import type { LucideIcon } from "lucide-react";
import { Building2, Globe, HeartPulse, Stethoscope } from "lucide-react";

export type LucideGlyph = LucideIcon;

export interface FinalCtaCardSpec {
  id: string;
  audience: string;
  icon: LucideGlyph;
  headlineId: string;
  bodyId: string;
  ctaId: string;
  ctaHref: string;
  secondaryId?: string;
  secondaryHref?: string;
}

export const finalCtaCards: FinalCtaCardSpec[] = [
  {
    id: "patients",
    audience: "Patients",
    icon: HeartPulse,
    headlineId: "marketing-home.final-cta.card1.headline",
    bodyId: "marketing-home.final-cta.card1.body",
    ctaId: "marketing-home.final-cta.card1.cta",
    ctaHref: "/create-account"
  },
  {
    id: "doctors",
    audience: "Healthcare Professionals",
    icon: Stethoscope,
    headlineId: "marketing-home.final-cta.card2.headline",
    bodyId: "marketing-home.final-cta.card2.body",
    ctaId: "marketing-home.final-cta.card2.cta",
    ctaHref: "/contact",
    secondaryId: "marketing-home.final-cta.card2.secondary",
    secondaryHref: "/doctors"
  },
  {
    id: "organisations",
    audience: "Healthcare Organisations",
    icon: Building2,
    headlineId: "marketing-home.final-cta.card3.headline",
    bodyId: "marketing-home.final-cta.card3.body",
    ctaId: "marketing-home.final-cta.card3.cta",
    ctaHref: "/contact"
  },
  {
    id: "diaspora",
    audience: "Diaspora Families",
    icon: Globe,
    headlineId: "marketing-home.final-cta.card4.headline",
    bodyId: "marketing-home.final-cta.card4.body",
    ctaId: "marketing-home.final-cta.card4.cta",
    ctaHref: "/create-account"
  }
];
