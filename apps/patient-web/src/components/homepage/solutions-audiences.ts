import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  FlaskConical,
  Globe,
  Hospital,
  Pill,
  ShieldPlus,
  Stethoscope,
  UserRound
} from "lucide-react";

export type LucideGlyph = LucideIcon;

export interface SolutionsAudienceSpec {
  id: string;
  icon: LucideGlyph;
  accentColor: string;
  contentPrefix: string;
  benefitIds: string[];
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
}

export const solutionsAudiences: SolutionsAudienceSpec[] = [
  {
    id: "patients",
    icon: UserRound,
    accentColor: "#16A34A",
    contentPrefix: "marketing-home.solutions.patients",
    benefitIds: [
      "marketing-home.solutions.patients.benefit1",
      "marketing-home.solutions.patients.benefit2",
      "marketing-home.solutions.patients.benefit3",
      "marketing-home.solutions.patients.benefit4"
    ],
    ctaPrimaryHref: "/create-account",
    ctaSecondaryHref: "/patients"
  },
  {
    id: "doctors",
    icon: Stethoscope,
    accentColor: "#2563EB",
    contentPrefix: "marketing-home.solutions.doctors",
    benefitIds: [
      "marketing-home.solutions.doctors.benefit1",
      "marketing-home.solutions.doctors.benefit2",
      "marketing-home.solutions.doctors.benefit3",
      "marketing-home.solutions.doctors.benefit4"
    ],
    ctaPrimaryHref: "/contact",
    ctaSecondaryHref: "/doctors"
  },
  {
    id: "hospitals",
    icon: Hospital,
    accentColor: "#1E3A8A",
    contentPrefix: "marketing-home.solutions.hospitals",
    benefitIds: [
      "marketing-home.solutions.hospitals.benefit1",
      "marketing-home.solutions.hospitals.benefit2",
      "marketing-home.solutions.hospitals.benefit3",
      "marketing-home.solutions.hospitals.benefit4"
    ],
    ctaPrimaryHref: "/contact",
    ctaSecondaryHref: "/hospitals"
  },
  {
    id: "pharmacies",
    icon: Pill,
    accentColor: "#0D9488",
    contentPrefix: "marketing-home.solutions.pharmacies",
    benefitIds: [
      "marketing-home.solutions.pharmacies.benefit1",
      "marketing-home.solutions.pharmacies.benefit2",
      "marketing-home.solutions.pharmacies.benefit3",
      "marketing-home.solutions.pharmacies.benefit4"
    ],
    ctaPrimaryHref: "/contact",
    ctaSecondaryHref: "/pharmacies"
  },
  {
    id: "laboratories",
    icon: FlaskConical,
    accentColor: "#7C3AED",
    contentPrefix: "marketing-home.solutions.laboratories",
    benefitIds: [
      "marketing-home.solutions.laboratories.benefit1",
      "marketing-home.solutions.laboratories.benefit2",
      "marketing-home.solutions.laboratories.benefit3",
      "marketing-home.solutions.laboratories.benefit4"
    ],
    ctaPrimaryHref: "/contact",
    ctaSecondaryHref: "/laboratories"
  },
  {
    id: "employers",
    icon: BriefcaseBusiness,
    accentColor: "#EA580C",
    contentPrefix: "marketing-home.solutions.employers",
    benefitIds: [
      "marketing-home.solutions.employers.benefit1",
      "marketing-home.solutions.employers.benefit2",
      "marketing-home.solutions.employers.benefit3",
      "marketing-home.solutions.employers.benefit4"
    ],
    ctaPrimaryHref: "/contact",
    ctaSecondaryHref: "/employers"
  },
  {
    id: "hmos",
    icon: ShieldPlus,
    accentColor: "#4F46E5",
    contentPrefix: "marketing-home.solutions.hmos",
    benefitIds: [
      "marketing-home.solutions.hmos.benefit1",
      "marketing-home.solutions.hmos.benefit2",
      "marketing-home.solutions.hmos.benefit3",
      "marketing-home.solutions.hmos.benefit4"
    ],
    ctaPrimaryHref: "/contact",
    ctaSecondaryHref: "/hmos"
  },
  {
    id: "diaspora",
    icon: Globe,
    accentColor: "#B45309",
    contentPrefix: "marketing-home.solutions.diaspora",
    benefitIds: [
      "marketing-home.solutions.diaspora.benefit1",
      "marketing-home.solutions.diaspora.benefit2",
      "marketing-home.solutions.diaspora.benefit3",
      "marketing-home.solutions.diaspora.benefit4"
    ],
    ctaPrimaryHref: "/create-account",
    ctaSecondaryHref: "/diaspora"
  }
];
