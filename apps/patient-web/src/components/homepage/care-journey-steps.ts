import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Bot,
  CalendarCheck,
  CheckCircle2,
  FlaskConical,
  History,
  Share2,
  Smartphone,
  Stethoscope,
  Thermometer,
  Users,
  Video
} from "lucide-react";

export type LucideGlyph = LucideIcon;

export interface CareJourneyIconSpec {
  icon: LucideGlyph;
  label: string;
}

export interface CareJourneyStepSpec {
  id: string;
  contentPrefix: string;
  ctaHref: string;
  icons: CareJourneyIconSpec[];
  illustrationIcon: LucideGlyph;
}

export const careJourneySteps: CareJourneyStepSpec[] = [
  {
    id: "notice",
    contentPrefix: "marketing-home.journey.step1",
    ctaHref: "/create-account",
    icons: [
      { icon: CalendarCheck, label: "Calendar" },
      { icon: CheckCircle2, label: "Health indicator" }
    ],
    illustrationIcon: Thermometer
  },
  {
    id: "understand",
    contentPrefix: "marketing-home.journey.step2",
    ctaHref: "/create-account",
    icons: [
      { icon: CheckCircle2, label: "AI-assisted" },
      { icon: CheckCircle2, label: "Medical notes" }
    ],
    illustrationIcon: Bot
  },
  {
    id: "clinician",
    contentPrefix: "marketing-home.journey.step3",
    ctaHref: "/doctors",
    icons: [
      { icon: CheckCircle2, label: "Verified doctor" },
      { icon: Video, label: "Video consultation" }
    ],
    illustrationIcon: Stethoscope
  },
  {
    id: "handoff",
    contentPrefix: "marketing-home.journey.step4",
    ctaHref: "/create-account",
    icons: [
      { icon: CheckCircle2, label: "Prescription" },
      { icon: CheckCircle2, label: "Lab request" }
    ],
    illustrationIcon: Share2
  },
  {
    id: "treatment",
    contentPrefix: "marketing-home.journey.step5",
    ctaHref: "/pharmacies",
    icons: [
      { icon: CheckCircle2, label: "Lab" },
      { icon: CheckCircle2, label: "Medication" }
    ],
    illustrationIcon: FlaskConical
  },
  {
    id: "followup",
    contentPrefix: "marketing-home.journey.step6",
    ctaHref: "/create-account",
    icons: [
      { icon: Bell, label: "Reminder" },
      { icon: CalendarCheck, label: "Follow-up" }
    ],
    illustrationIcon: Smartphone
  },
  {
    id: "family",
    contentPrefix: "marketing-home.journey.step7",
    ctaHref: "/family-health",
    icons: [
      { icon: CheckCircle2, label: "Consent" },
      { icon: Bell, label: "Caregiver update" }
    ],
    illustrationIcon: Users
  },
  {
    id: "record",
    contentPrefix: "marketing-home.journey.step8",
    ctaHref: "/create-account",
    icons: [
      { icon: CheckCircle2, label: "Timeline" },
      { icon: CheckCircle2, label: "Health record" }
    ],
    illustrationIcon: History
  }
];
