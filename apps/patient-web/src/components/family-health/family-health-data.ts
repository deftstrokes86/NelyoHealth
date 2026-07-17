import type { LucideIcon } from "lucide-react";
import {
  Baby,
  BellRing,
  Building2,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FlaskConical,
  Globe,
  HandHeart,
  HeartPulse,
  House,
  Layers,
  Lock,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Users,
  UserRound,
  Video
} from "lucide-react";

const P = "marketing-family-health";

// ---------- Section 2 — Choose your journey ----------
export interface JourneyCardSpec {
  id: string;
  icon: LucideIcon;
  headlineId: string;
  bodyId: string;
  pointIds: string[];
  ctaId: string;
  href: string;
  tone: "household" | "diaspora";
}

export const journeyCards: JourneyCardSpec[] = [
  {
    id: "household",
    icon: House,
    headlineId: `${P}.journey.household.headline`,
    bodyId: `${P}.journey.household.body`,
    pointIds: [
      `${P}.journey.household.point1`,
      `${P}.journey.household.point2`,
      `${P}.journey.household.point3`,
      `${P}.journey.household.point4`,
      `${P}.journey.household.point5`
    ],
    ctaId: `${P}.journey.household.cta`,
    href: "#household-care",
    tone: "household"
  },
  {
    id: "diaspora",
    icon: Globe,
    headlineId: `${P}.journey.diaspora.headline`,
    bodyId: `${P}.journey.diaspora.body`,
    pointIds: [
      `${P}.journey.diaspora.point1`,
      `${P}.journey.diaspora.point2`,
      `${P}.journey.diaspora.point3`,
      `${P}.journey.diaspora.point4`
    ],
    ctaId: `${P}.journey.diaspora.cta`,
    href: "#diaspora-care",
    tone: "diaspora"
  }
];

// ---------- Section 3 — Care Circle ----------
export interface CareCircleNodeSpec {
  id: string;
  icon: LucideIcon;
  /** Angle in degrees on the circle; -90 = top, clockwise. */
  angle: number;
  roleId: string;
  permissionId: string;
  responsibilityId: string;
  exampleId: string;
}

export const careCircleCenter = {
  icon: HeartPulse,
  roleId: `${P}.circle.node.patient.role`,
  permissionId: `${P}.circle.node.patient.permission`,
  responsibilityId: `${P}.circle.node.patient.responsibility`,
  exampleId: `${P}.circle.node.patient.example`
};

const node = (
  id: string,
  icon: LucideIcon,
  angle: number
): CareCircleNodeSpec => ({
  id,
  icon,
  angle,
  roleId: `${P}.circle.node.${id}.role`,
  permissionId: `${P}.circle.node.${id}.permission`,
  responsibilityId: `${P}.circle.node.${id}.responsibility`,
  exampleId: `${P}.circle.node.${id}.example`
});

export const careCircleNodes: CareCircleNodeSpec[] = [
  node("parent", Users, -90),
  node("guardian", ShieldCheck, -45),
  node("adult-child", UserRound, 0),
  node("caregiver", HandHeart, 45),
  node("doctor", Stethoscope, 90),
  node("hospital", Building2, 135),
  node("laboratory", FlaskConical, 180),
  node("pharmacy", Pill, 225)
];

// ---------- Section 4 — Permissions ----------
export interface PermissionSpec {
  id: string;
  icon: LucideIcon;
}

export const permissionItems: PermissionSpec[] = [
  { id: `${P}.perms.item.appointments`, icon: CalendarCheck },
  { id: `${P}.perms.item.book`, icon: Stethoscope },
  { id: `${P}.perms.item.reminders`, icon: BellRing },
  { id: `${P}.perms.item.pay`, icon: CreditCard },
  { id: `${P}.perms.item.join`, icon: Video },
  { id: `${P}.perms.item.labs`, icon: FlaskConical },
  { id: `${P}.perms.item.prescriptions`, icon: Pill },
  { id: `${P}.perms.item.emergency`, icon: ShieldCheck }
];

// ---------- Section 5 — Household dashboard ----------
export interface HouseholdMemberSpec {
  id: string;
  nameId: string;
  roleId: string;
  statusId: string;
  tone: "you" | "partner" | "child" | "elder";
}

export const householdMembers: HouseholdMemberSpec[] = [
  {
    id: "stephen",
    nameId: `${P}.household.member.stephen.name`,
    roleId: `${P}.household.member.stephen.role`,
    statusId: `${P}.household.member.stephen.status`,
    tone: "you"
  },
  {
    id: "sarah",
    nameId: `${P}.household.member.sarah.name`,
    roleId: `${P}.household.member.sarah.role`,
    statusId: `${P}.household.member.sarah.status`,
    tone: "partner"
  },
  {
    id: "daniel",
    nameId: `${P}.household.member.daniel.name`,
    roleId: `${P}.household.member.daniel.role`,
    statusId: `${P}.household.member.daniel.status`,
    tone: "child"
  },
  {
    id: "grace",
    nameId: `${P}.household.member.grace.name`,
    roleId: `${P}.household.member.grace.role`,
    statusId: `${P}.household.member.grace.status`,
    tone: "elder"
  }
];

export const householdTags: { id: string; icon: LucideIcon }[] = [
  { id: `${P}.household.tag.appointments`, icon: CalendarCheck },
  { id: `${P}.household.tag.medications`, icon: BellRing },
  { id: `${P}.household.tag.vaccinations`, icon: Syringe },
  { id: `${P}.household.tag.alerts`, icon: HeartPulse }
];

// ---------- Section 6 — Diaspora timeline ----------
export const diasporaSteps: { titleId: string; bodyId: string }[] = Array.from(
  { length: 8 },
  (_, i) => ({
    titleId: `${P}.diaspora.step${i + 1}.title`,
    bodyId: `${P}.diaspora.step${i + 1}.body`
  })
);

export const diasporaValues = [
  `${P}.diaspora.value.continuity`,
  `${P}.diaspora.value.transparency`,
  `${P}.diaspora.value.peace`
];

// ---------- Section 7 — Why families ----------
export interface WhySpec {
  id: string;
  icon: LucideIcon;
  titleId: string;
  bodyId: string;
}

export const whyItems: WhySpec[] = [
  { id: "account", icon: Layers, titleId: `${P}.why.item.account.title`, bodyId: `${P}.why.item.account.body` },
  { id: "permissions", icon: Lock, titleId: `${P}.why.item.permissions.title`, bodyId: `${P}.why.item.permissions.body` },
  { id: "circle", icon: Users, titleId: `${P}.why.item.circle.title`, bodyId: `${P}.why.item.circle.body` },
  { id: "reminders", icon: BellRing, titleId: `${P}.why.item.reminders.title`, bodyId: `${P}.why.item.reminders.body` },
  { id: "vaccinations", icon: Syringe, titleId: `${P}.why.item.vaccinations.title`, bodyId: `${P}.why.item.vaccinations.body` },
  { id: "appointments", icon: CalendarCheck, titleId: `${P}.why.item.appointments.title`, bodyId: `${P}.why.item.appointments.body` },
  { id: "emergency", icon: ShieldCheck, titleId: `${P}.why.item.emergency.title`, bodyId: `${P}.why.item.emergency.body` },
  { id: "history", icon: ClipboardList, titleId: `${P}.why.item.history.title`, bodyId: `${P}.why.item.history.body` },
  { id: "coordination", icon: Stethoscope, titleId: `${P}.why.item.coordination.title`, bodyId: `${P}.why.item.coordination.body` }
];

// ---------- Section 8 — Privacy ----------
export interface PrivacyPointSpec {
  id: string;
  icon: LucideIcon;
  titleId: string;
  bodyId: string;
}

export const privacyPoints: PrivacyPointSpec[] = [
  { id: "children", icon: Baby, titleId: `${P}.privacy.point.children.title`, bodyId: `${P}.privacy.point.children.body` },
  { id: "adults", icon: UserRound, titleId: `${P}.privacy.point.adults.title`, bodyId: `${P}.privacy.point.adults.body` },
  { id: "elders", icon: HandHeart, titleId: `${P}.privacy.point.elders.title`, bodyId: `${P}.privacy.point.elders.body` },
  { id: "change", icon: ShieldCheck, titleId: `${P}.privacy.point.change.title`, bodyId: `${P}.privacy.point.change.body` }
];

export const privacyBadges = [
  `${P}.privacy.badge.ndpr`,
  `${P}.privacy.badge.encrypted`,
  `${P}.privacy.badge.auditable`
];

// ---------- Section 9 — Testimonials ----------
export interface TestimonialSpec {
  id: string;
  quoteId: string;
  nameId: string;
  roleId: string;
}

export const testimonials: TestimonialSpec[] = [
  { id: "parent", quoteId: `${P}.testimonials.parent.quote`, nameId: `${P}.testimonials.parent.name`, roleId: `${P}.testimonials.parent.role` },
  { id: "diaspora", quoteId: `${P}.testimonials.diaspora.quote`, nameId: `${P}.testimonials.diaspora.name`, roleId: `${P}.testimonials.diaspora.role` },
  { id: "caregiver", quoteId: `${P}.testimonials.caregiver.quote`, nameId: `${P}.testimonials.caregiver.name`, roleId: `${P}.testimonials.caregiver.role` },
  { id: "doctor", quoteId: `${P}.testimonials.doctor.quote`, nameId: `${P}.testimonials.doctor.name`, roleId: `${P}.testimonials.doctor.role` }
];

// ---------- Section 10 — FAQ ----------
export const faqItems = [
  `${P}.faq.children`,
  `${P}.faq.sister`,
  `${P}.faq.father-remove`,
  `${P}.faq.who-sees`,
  `${P}.faq.specialist`,
  `${P}.faq.how`
];
