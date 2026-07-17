import type { SiteHeaderMenu, CommandPaletteItem } from "@nelyohealth/ui-foundation";
import { marketingContentById } from "@nelyohealth/content-registry";
import {
  Accessibility,
  Activity,
  Baby,
  Bot,
  BookOpen,
  Brain,
  Briefcase,
  BriefcaseBusiness,
  Building,
  Building2,
  Code2,
  Compass,
  FileText,
  FlaskConical,
  Globe,
  HandHeart,
  HeartHandshake,
  HeartPulse,
  Landmark,
  Lock,
  Megaphone,
  Newspaper,
  GitMerge,
  Pill,
  Route,
  Handshake,
  LifeBuoy,
  CircleHelp,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Users,
  UsersRound,
  Video,
  Workflow
} from "lucide-react";

const iconProps = { size: 20, strokeWidth: 1.9, "aria-hidden": true } as const;

export const platformMenu: SiteHeaderMenu = {
  triggerLabelId: "marketing-nav.trigger.platform",
  columns: 3,
  items: [
    {
      id: "marketing-nav.platform.healthcare-journey.headline",
      bodyId: "marketing-nav.platform.healthcare-journey.body",
      icon: <Route {...iconProps} />,
      href: "/patients"
    },
    {
      id: "marketing-nav.platform.how-it-works.headline",
      bodyId: "marketing-nav.platform.how-it-works.body",
      icon: <Workflow {...iconProps} />,
      href: "/how-it-works"
    },
    {
      id: "marketing-nav.platform.ai-assistant.headline",
      bodyId: "marketing-nav.platform.ai-assistant.body",
      icon: <Bot {...iconProps} />,
      href: "/how-it-works"
    },
    {
      id: "marketing-nav.platform.telemedicine.headline",
      bodyId: "marketing-nav.platform.telemedicine.body",
      icon: <Video {...iconProps} />,
      href: "/doctors"
    },
    {
      id: "marketing-nav.platform.medical-records.headline",
      bodyId: "marketing-nav.platform.medical-records.body",
      icon: <FileText {...iconProps} />,
      href: "/medical-records"
    },
    {
      id: "marketing-nav.platform.laboratory-services.headline",
      bodyId: "marketing-nav.platform.laboratory-services.body",
      icon: <FlaskConical {...iconProps} />,
      href: "/laboratories"
    },
    {
      id: "marketing-nav.platform.digital-prescriptions.headline",
      bodyId: "marketing-nav.platform.digital-prescriptions.body",
      icon: <Pill {...iconProps} />,
      href: "/pharmacies"
    },
    {
      id: "marketing-nav.platform.pharmacy-network.headline",
      bodyId: "marketing-nav.platform.pharmacy-network.body",
      icon: <Store {...iconProps} />,
      href: "/pharmacies"
    },
    {
      id: "marketing-nav.platform.family-care.headline",
      bodyId: "marketing-nav.platform.family-care.body",
      icon: <HeartHandshake {...iconProps} />,
      href: "/family-health"
    },
    {
      id: "marketing-nav.platform.care-coordination.headline",
      bodyId: "marketing-nav.platform.care-coordination.body",
      icon: <GitMerge {...iconProps} />,
      href: "/how-it-works"
    },
    {
      id: "marketing-nav.platform.security-privacy.headline",
      bodyId: "marketing-nav.platform.security-privacy.body",
      icon: <ShieldCheck {...iconProps} />,
      href: "/trust-and-safety"
    }
  ],
  featured: {
    headlineId: "marketing-nav.platform.featured.headline",
    bodyId: "marketing-nav.platform.featured.body",
    ctaLabelId: "marketing-nav.platform.featured.cta",
    href: "/how-it-works",
    icon: <Sparkles {...iconProps} />
  }
};

export const serveMenu: SiteHeaderMenu = {
  triggerLabelId: "marketing-nav.trigger.serve",
  columns: 4,
  items: [],
  itemCtaLabelId: "marketing-nav.serve.cta",
  comingSoonLabelId: "marketing-nav.serve.coming-soon",
  groups: [
    {
      headingId: "marketing-nav.serve.section.individuals",
      items: [
        {
          id: "marketing-nav.serve.patient.headline",
          bodyId: "marketing-nav.serve.patient.body",
          icon: <HeartPulse {...iconProps} />,
          href: "/patients"
        },
        {
          id: "marketing-nav.serve.family-health.headline",
          bodyId: "marketing-nav.serve.family-health.body",
          icon: <UsersRound {...iconProps} />,
          href: "/family-health",
          ctaLabelId: "marketing-nav.serve.cta.family-health"
        },
        {
          id: "marketing-nav.serve.parents.headline",
          bodyId: "marketing-nav.serve.parents.body",
          icon: <Baby {...iconProps} />,
          href: "/family-health"
        },
        {
          id: "marketing-nav.serve.caregivers.headline",
          bodyId: "marketing-nav.serve.caregivers.body",
          icon: <HandHeart {...iconProps} />,
          href: "/family-health"
        },
        {
          id: "marketing-nav.serve.diaspora.headline",
          bodyId: "marketing-nav.serve.diaspora.body",
          icon: <Globe {...iconProps} />,
          href: "/diaspora"
        }
      ]
    },
    {
      headingId: "marketing-nav.serve.section.professionals",
      items: [
        {
          id: "marketing-nav.serve.doctors.headline",
          bodyId: "marketing-nav.serve.doctors.body",
          icon: <Stethoscope {...iconProps} />,
          href: "/doctors"
        },
        {
          id: "marketing-nav.serve.specialists.headline",
          bodyId: "marketing-nav.serve.specialists.body",
          icon: <Brain {...iconProps} />,
          href: "/doctors"
        },
        {
          id: "marketing-nav.serve.mental-health.headline",
          bodyId: "marketing-nav.serve.mental-health.body",
          icon: <HeartHandshake {...iconProps} />,
          href: "/doctors"
        },
        {
          id: "marketing-nav.serve.care-coordinators.headline",
          bodyId: "marketing-nav.serve.care-coordinators.body",
          icon: <Workflow {...iconProps} />,
          comingSoon: true
        }
      ]
    },
    {
      headingId: "marketing-nav.serve.section.organisations",
      items: [
        {
          id: "marketing-nav.serve.hospitals.headline",
          bodyId: "marketing-nav.serve.hospitals.body",
          icon: <Building2 {...iconProps} />,
          href: "/hospitals"
        },
        {
          id: "marketing-nav.serve.laboratories.headline",
          bodyId: "marketing-nav.serve.laboratories.body",
          icon: <FlaskConical {...iconProps} />,
          href: "/laboratories"
        },
        {
          id: "marketing-nav.serve.pharmacies.headline",
          bodyId: "marketing-nav.serve.pharmacies.body",
          icon: <Pill {...iconProps} />,
          href: "/pharmacies"
        }
      ]
    },
    {
      headingId: "marketing-nav.serve.section.partners",
      items: [
        {
          id: "marketing-nav.serve.hmos.headline",
          bodyId: "marketing-nav.serve.hmos.body",
          icon: <ShieldCheck {...iconProps} />,
          href: "/hmos"
        },
        {
          id: "marketing-nav.serve.employers.headline",
          bodyId: "marketing-nav.serve.employers.body",
          icon: <BriefcaseBusiness {...iconProps} />,
          href: "/employers"
        },
        {
          id: "marketing-nav.serve.health-partners.headline",
          bodyId: "marketing-nav.serve.health-partners.body",
          icon: <Handshake {...iconProps} />,
          href: "/partners"
        },
        {
          id: "marketing-nav.serve.government.headline",
          bodyId: "marketing-nav.serve.government.body",
          icon: <Landmark {...iconProps} />,
          comingSoon: true
        }
      ]
    }
  ],
  banner: {
    headlineId: "marketing-nav.serve.banner.headline",
    bodyId: "marketing-nav.serve.banner.body",
    ctaLabelId: "marketing-nav.serve.banner.cta",
    href: "/how-it-works"
  }
};

export const resourcesMenu: SiteHeaderMenu = {
  triggerLabelId: "marketing-nav.trigger.resources",
  columns: 2,
  items: [
    {
      id: "marketing-nav.resources.health-library.headline",
      bodyId: "marketing-nav.resources.health-library.body",
      icon: <BookOpen {...iconProps} />,
      href: "/health-library"
    },
    {
      id: "marketing-nav.resources.help-centre.headline",
      bodyId: "marketing-nav.resources.help-centre.body",
      icon: <LifeBuoy {...iconProps} />,
      href: "/help-centre"
    },
    {
      id: "marketing-nav.resources.faqs.headline",
      bodyId: "marketing-nav.resources.faqs.body",
      icon: <CircleHelp {...iconProps} />,
      href: "/faq"
    },
    {
      id: "marketing-nav.resources.blog.headline",
      bodyId: "marketing-nav.resources.blog.body",
      icon: <Newspaper {...iconProps} />,
      href: "/blog"
    },
    {
      id: "marketing-nav.resources.privacy-centre.headline",
      bodyId: "marketing-nav.resources.privacy-centre.body",
      icon: <Lock {...iconProps} />,
      href: "/privacy-overview"
    },
    {
      id: "marketing-nav.resources.accessibility.headline",
      bodyId: "marketing-nav.resources.accessibility.body",
      icon: <Accessibility {...iconProps} />,
      href: "/accessibility"
    },
    {
      id: "marketing-nav.resources.status.headline",
      bodyId: "marketing-nav.resources.status.body",
      icon: <Activity {...iconProps} />,
      href: "/status"
    },
    {
      id: "marketing-nav.resources.developer-api.headline",
      bodyId: "marketing-nav.resources.developer-api.body",
      icon: <Code2 {...iconProps} />,
      href: "/developer-api"
    }
  ]
};

export const companyMenu: SiteHeaderMenu = {
  triggerLabelId: "marketing-nav.trigger.company",
  columns: 2,
  items: [
    {
      id: "marketing-nav.company.about.headline",
      bodyId: "marketing-nav.company.about.body",
      icon: <Building {...iconProps} />,
      href: "/about"
    },
    {
      id: "marketing-nav.company.mission.headline",
      bodyId: "marketing-nav.company.mission.body",
      icon: <Compass {...iconProps} />,
      href: "/mission"
    },
    {
      id: "marketing-nav.company.leadership.headline",
      bodyId: "marketing-nav.company.leadership.body",
      icon: <Users {...iconProps} />,
      href: "/leadership"
    },
    {
      id: "marketing-nav.company.careers.headline",
      bodyId: "marketing-nav.company.careers.body",
      icon: <Briefcase {...iconProps} />,
      href: "/careers"
    },
    {
      id: "marketing-nav.company.partners.headline",
      bodyId: "marketing-nav.company.partners.body",
      icon: <Handshake {...iconProps} />,
      href: "/partners"
    },
    {
      id: "marketing-nav.company.newsroom.headline",
      bodyId: "marketing-nav.company.newsroom.body",
      icon: <Megaphone {...iconProps} />,
      href: "/newsroom"
    },
    {
      id: "marketing-nav.company.contact.headline",
      bodyId: "marketing-nav.company.contact.body",
      icon: <HeartHandshake {...iconProps} />,
      href: "/contact"
    }
  ]
};

const searchItem = (
  id: string,
  href: string,
  group: CommandPaletteItem["group"]
): CommandPaletteItem => {
  const entry = marketingContentById.get(id);
  return { id, href, group, title: entry?.title ?? id, body: entry?.body ?? "" };
};

const cardSearchItem = (
  headlineId: string,
  bodyId: string,
  href: string,
  group: CommandPaletteItem["group"]
): CommandPaletteItem => ({
  id: headlineId,
  href,
  group,
  title: marketingContentById.get(headlineId)?.title ?? headlineId,
  body: marketingContentById.get(bodyId)?.title ?? ""
});

const serveMenuItems = (serveMenu.groups ?? []).flatMap((group) => group.items);

const allMenuItems = [
  ...platformMenu.items,
  ...serveMenuItems,
  ...resourcesMenu.items,
  ...companyMenu.items
];

// Only navigable items are searchable; "Coming Soon" cards have no destination.
const navigableItems = allMenuItems.filter(
  (item): item is typeof item & { href: string } => typeof item.href === "string"
);

export const navSearchItems: CommandPaletteItem[] = [
  ...navigableItems.map((item) => cardSearchItem(item.id, item.bodyId, item.href, "pages")),
  searchItem("marketing-faq.q.who", "/faq", "faq"),
  searchItem("marketing-faq.q.data", "/faq", "faq"),
  searchItem("marketing-faq.q.payment", "/faq", "faq"),
  searchItem("marketing-faq.q.emergency", "/faq", "faq"),
  searchItem("marketing-faq.q.family", "/faq", "faq"),
  searchItem("marketing-faq.q.provider-details", "/faq", "faq")
];
