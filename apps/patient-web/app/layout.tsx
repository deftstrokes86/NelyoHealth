import type { Metadata } from "next";
import "./tailwind.css";
import "@nelyohealth/ui-foundation/styles.css";
import {
  ContentProvider,
  EmergencyRibbon,
  HelpWidget,
  SiteFooter,
  SiteHeader
} from "@nelyohealth/ui-foundation";
import type { HelpWidgetCard, HelpWidgetSearchItem } from "@nelyohealth/ui-foundation";
import { marketingContentById, marketingContentEntries } from "@nelyohealth/content-registry";
import {
  Accessibility,
  AlertTriangle,
  Bug,
  CalendarPlus,
  CircleHelp,
  LifeBuoy,
  Mail,
  MessageCircle,
  ShieldAlert
} from "lucide-react";

export const metadata: Metadata = {
  title: "NelyoHealth — Coordinated care that follows the patient.",
  description:
    "Coordinated care from intake to follow-up on one secure surface. For patients, families, providers, and organisations in Nigeria and the diaspora."
};

const primaryNav = [
  {
    id: "marketing-microcopy.nav.home",
    href: "/",
    segment: "general" as const
  },
  {
    id: "marketing-microcopy.nav.how-it-works",
    href: "/how-it-works",
    segment: "general" as const
  },
  {
    id: "marketing-microcopy.nav.patients",
    href: "/patients",
    segment: "patient" as const
  },
  {
    id: "marketing-microcopy.nav.doctors",
    href: "/doctors",
    segment: "provider" as const
  },
  {
    id: "marketing-microcopy.nav.trust-and-safety",
    href: "/trust-and-safety",
    segment: "general" as const
  }
];

const footerGroups = [
  {
    id: "marketing-footer.column.platform",
    links: [
      { id: "marketing-microcopy.footer.link.how-it-works", href: "/how-it-works" },
      { id: "marketing-microcopy.footer.link.patients", href: "/patients" },
      { id: "marketing-microcopy.footer.link.family-plans", href: "/family-plans" },
      { id: "marketing-microcopy.footer.link.diaspora", href: "/diaspora" },
      { id: "marketing-microcopy.footer.link.doctors", href: "/doctors" },
      { id: "marketing-microcopy.footer.link.pharmacies", href: "/pharmacies" },
      { id: "marketing-microcopy.footer.link.laboratories", href: "/laboratories" },
      { id: "marketing-footer.link.hospitals", href: "/hospitals" },
      { id: "marketing-footer.link.hmos", href: "/hmos" },
      { id: "marketing-footer.link.employers", href: "/employers" },
      { id: "marketing-footer.link.home-care", href: "/home-care" }
    ]
  },
  {
    id: "marketing-footer.column.company",
    links: [
      { id: "marketing-footer.link.mission", href: "/mission" },
      { id: "marketing-footer.link.about", href: "/about" },
      { id: "marketing-footer.link.careers", href: "/careers" }
    ]
  },
  {
    id: "marketing-footer.column.resources",
    links: [
      { id: "marketing-footer.link.book-consultation", href: "/book-consultation" },
      { id: "marketing-footer.link.help-centre", href: "/help-centre" },
      { id: "marketing-microcopy.footer.link.faq", href: "/faq" },
      { id: "marketing-footer.link.blog", href: "/blog" }
    ]
  },
  {
    id: "marketing-footer.column.legal",
    links: [
      { id: "marketing-microcopy.footer.link.trust-and-safety", href: "/trust-and-safety" },
      { id: "marketing-microcopy.footer.link.privacy-overview", href: "/privacy-overview" },
      { id: "marketing-microcopy.footer.link.accessibility", href: "/accessibility" },
      { id: "marketing-microcopy.footer.link.legal", href: "/legal-and-regulatory-notices" },
      { id: "marketing-footer.link.cookie-policy", href: "/cookie-policy" },
      { id: "marketing-footer.link.consent-policy", href: "/consent-policy" },
      { id: "marketing-footer.link.data-protection", href: "/data-protection" },
      { id: "marketing-footer.link.community-guidelines", href: "/community-guidelines" },
      { id: "marketing-microcopy.footer.link.emergency", href: "/emergency" }
    ]
  }
];

const footerSupportBar = {
  eyebrowId: "marketing-footer.support.eyebrow",
  headlineId: "marketing-footer.support.headline",
  links: [
    {
      id: "marketing-footer.link.help-centre",
      href: "/help-centre",
      icon: <LifeBuoy size={16} strokeWidth={1.9} aria-hidden />
    },
    {
      id: "marketing-microcopy.footer.link.contact",
      href: "/contact",
      icon: <Mail size={16} strokeWidth={1.9} aria-hidden />
    },
    {
      id: "marketing-microcopy.footer.link.emergency",
      href: "/emergency",
      icon: <AlertTriangle size={16} strokeWidth={1.9} aria-hidden />
    }
  ]
};

const footerNewsletter = {
  eyebrowId: "marketing-footer.newsletter.eyebrow",
  headlineId: "marketing-footer.newsletter.headline",
  bodyId: "marketing-footer.newsletter.body",
  placeholderId: "marketing-footer.newsletter.placeholder",
  ctaLabelId: "marketing-footer.newsletter.cta",
  contactEmail: "hello@nelyohealth.example"
};

const footerContact = {
  headingId: "marketing-footer.contact.heading",
  email: {
    labelId: "marketing-footer.contact.email.label",
    address: "hello@nelyohealth.example"
  },
  office: {
    labelId: "marketing-footer.contact.office.label",
    valueId: "marketing-footer.contact.office.value"
  },
  support: {
    labelId: "marketing-footer.contact.support.label",
    valueId: "marketing-footer.contact.support.value"
  }
};

const footerBottom = {
  copyrightId: "marketing-footer.bottom.copyright",
  taglineId: "marketing-microcopy.brand.tagline",
  statusLabelId: "marketing-footer.bottom.status.label",
  statusHref: "/status"
};

const helpWidgetCards: HelpWidgetCard[] = [
  {
    id: "marketing-help-widget.card.book-consultation.headline",
    bodyId: "marketing-help-widget.card.book-consultation.body",
    icon: <CalendarPlus size={20} strokeWidth={1.9} aria-hidden />,
    href: "/book-consultation"
  },
  {
    id: "marketing-help-widget.card.help-centre.headline",
    bodyId: "marketing-help-widget.card.help-centre.body",
    icon: <CircleHelp size={20} strokeWidth={1.9} aria-hidden />,
    href: "/help-centre"
  },
  {
    id: "marketing-help-widget.card.contact-support.headline",
    bodyId: "marketing-help-widget.card.contact-support.body",
    icon: <MessageCircle size={20} strokeWidth={1.9} aria-hidden />,
    href: "/contact"
  },
  {
    id: "marketing-help-widget.card.emergency.headline",
    bodyId: "marketing-help-widget.card.emergency.body",
    icon: <ShieldAlert size={20} strokeWidth={1.9} aria-hidden />,
    view: "emergency"
  },
  {
    id: "marketing-help-widget.card.accessibility.headline",
    bodyId: "marketing-help-widget.card.accessibility.body",
    icon: <Accessibility size={20} strokeWidth={1.9} aria-hidden />,
    href: "/accessibility"
  },
  {
    id: "marketing-help-widget.card.report-problem.headline",
    bodyId: "marketing-help-widget.card.report-problem.body",
    icon: <Bug size={20} strokeWidth={1.9} aria-hidden />,
    href: "mailto:support@nelyohealth.com?subject=Problem%20report"
  }
];

const searchItem = (id: string, href: string): HelpWidgetSearchItem => {
  const entry = marketingContentById.get(id);
  return { id, href, title: entry?.title ?? id, body: entry?.body ?? "" };
};

const cardSearchItem = (
  headlineId: string,
  bodyId: string,
  href: string
): HelpWidgetSearchItem => ({
  id: headlineId,
  href,
  title: marketingContentById.get(headlineId)?.title ?? headlineId,
  body: marketingContentById.get(bodyId)?.title ?? ""
});

const helpWidgetSearchItems: HelpWidgetSearchItem[] = [
  cardSearchItem(
    "marketing-help-widget.card.book-consultation.headline",
    "marketing-help-widget.card.book-consultation.body",
    "/book-consultation"
  ),
  cardSearchItem(
    "marketing-help-widget.card.help-centre.headline",
    "marketing-help-widget.card.help-centre.body",
    "/help-centre"
  ),
  cardSearchItem(
    "marketing-help-widget.card.contact-support.headline",
    "marketing-help-widget.card.contact-support.body",
    "/contact"
  ),
  cardSearchItem(
    "marketing-help-widget.card.accessibility.headline",
    "marketing-help-widget.card.accessibility.body",
    "/accessibility"
  ),
  cardSearchItem(
    "marketing-help-widget.card.report-problem.headline",
    "marketing-help-widget.card.report-problem.body",
    "/contact"
  ),
  searchItem("marketing-faq.q.who", "/faq"),
  searchItem("marketing-faq.q.data", "/faq"),
  searchItem("marketing-faq.q.payment", "/faq"),
  searchItem("marketing-faq.q.emergency", "/faq"),
  searchItem("marketing-faq.q.family", "/faq"),
  searchItem("marketing-faq.q.provider-details", "/faq")
];

const helpWidgetEmergency = {
  backLabelId: "marketing-help-widget.emergency.back",
  headlineId: "marketing-help-widget.emergency.headline",
  bodyId: "marketing-help-widget.emergency.body",
  findHospitalsLabelId: "marketing-help-widget.emergency.find-hospitals",
  findHospitalsHref: "/emergency",
  callServicesLabelId: "marketing-help-widget.emergency.call-services",
  callServicesHref: "tel:112",
  followupId: "marketing-help-widget.emergency.followup"
};

const helpWidgetContact = {
  headingId: "marketing-help-widget.contact.heading",
  emailLabelId: "marketing-help-widget.contact.email.label",
  email: "support@nelyohealth.com",
  hoursLabelId: "marketing-help-widget.contact.hours.label",
  hoursValueId: "marketing-help-widget.contact.hours.value"
};

const contentEntries = marketingContentEntries.map((entry) => ({
  id: entry.id,
  title: entry.title,
  body: entry.body,
  cta: entry.cta,
  status: entry.status
}));

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ContentProvider entries={contentEntries}>
          <EmergencyRibbon
            headlineId="marketing-emergency.ribbon.headline"
            actionLabelId="marketing-emergency.ribbon.action"
            actionHref="/emergency"
          />
          <SiteHeader
            brandId="marketing-microcopy.brand.name"
            brandHref="/"
            navItems={primaryNav}
            primaryCtaLabelId="marketing-cta.create-account"
            primaryCtaHref="/create-account"
            secondaryCtaLabelId="marketing-cta.sign-in"
            secondaryCtaHref="/sign-in"
          />
          <main id="main">{children}</main>
          <SiteFooter
            brandId="marketing-microcopy.brand.name"
            brandDescriptionId="marketing-microcopy.footer.description"
            brandHref="/"
            legalNoticeId="marketing-microcopy.footer.legal"
            supportBar={footerSupportBar}
            newsletter={footerNewsletter}
            groups={footerGroups}
            contact={footerContact}
            bottom={footerBottom}
            closingLineId="marketing-footer.closing.line"
          />
          <HelpWidget
            triggerLabelId="marketing-help-widget.trigger.label"
            headerHeadlineId="marketing-help-widget.header.headline"
            headerBodyId="marketing-help-widget.header.body"
            searchPlaceholderId="marketing-help-widget.search.placeholder"
            searchEmptyId="marketing-help-widget.search.no-results"
            cards={helpWidgetCards}
            searchItems={helpWidgetSearchItems}
            emergency={helpWidgetEmergency}
            contact={helpWidgetContact}
            microcopyHeadlineId="marketing-help-widget.microcopy.headline"
            microcopyBodyId="marketing-help-widget.microcopy.body"
          />
        </ContentProvider>
      </body>
    </html>
  );
}
