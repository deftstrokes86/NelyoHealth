import type { Metadata } from "next";
import "./tailwind.css";
import "@nelyohealth/ui-foundation/styles.css";
import {
  ContentProvider,
  EmergencyRibbon,
  SiteFooter,
  SiteHeader
} from "@nelyohealth/ui-foundation";
import { marketingContentEntries } from "@nelyohealth/content-registry";

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
    id: "marketing-microcopy.footer.group.platform",
    links: [
      {
        id: "marketing-microcopy.footer.link.how-it-works",
        href: "/how-it-works"
      },
      {
        id: "marketing-microcopy.footer.link.patients",
        href: "/patients"
      },
      {
        id: "marketing-microcopy.footer.link.family-plans",
        href: "/family-plans"
      },
      {
        id: "marketing-microcopy.footer.link.diaspora",
        href: "/diaspora"
      },
      {
        id: "marketing-microcopy.footer.link.doctors",
        href: "/doctors"
      },
      {
        id: "marketing-microcopy.footer.link.pharmacies",
        href: "/pharmacies"
      },
      {
        id: "marketing-microcopy.footer.link.laboratories",
        href: "/laboratories"
      }
    ]
  },
  {
    id: "marketing-microcopy.footer.group.trust",
    links: [
      {
        id: "marketing-microcopy.footer.link.trust-and-safety",
        href: "/trust-and-safety"
      },
      {
        id: "marketing-microcopy.footer.link.privacy-overview",
        href: "/privacy-overview"
      },
      {
        id: "marketing-microcopy.footer.link.accessibility",
        href: "/accessibility"
      },
      {
        id: "marketing-microcopy.footer.link.legal",
        href: "/legal-and-regulatory-notices"
      },
      {
        id: "marketing-microcopy.footer.link.emergency",
        href: "/emergency"
      }
    ]
  },
  {
    id: "marketing-microcopy.footer.group.company",
    links: [
      {
        id: "marketing-microcopy.footer.link.faq",
        href: "/faq"
      },
      {
        id: "marketing-microcopy.footer.link.contact",
        href: "/contact"
      }
    ]
  }
];

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
            brandId="marketing-microcopy.footer.description"
            brandHref="/"
            legalNoticeId="marketing-microcopy.footer.legal"
            groups={footerGroups}
          />
        </ContentProvider>
      </body>
    </html>
  );
}
