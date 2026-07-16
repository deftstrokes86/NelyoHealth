import { notFound } from "next/navigation";
import {
  CTASection,
  EmergencyRibbon,
  FAQAccordion,
  HeroBlock,
  IllustrationSlot,
  LegalNoticeStrip,
  PreviewContentProvider,
  PricingMatrix,
  ProofStrip,
  QuoteBlock,
  SegmentGrid,
  SiteFooter,
  SiteHeader,
  StorySection,
  ThemeToggle,
  TrustBar,
  WorkflowStepper,
  illustrationIds
} from "@nelyohealth/ui-foundation";
import { galleryContent } from "../gallery-content";

const GALLERY_ENABLED = process.env.NEXT_PUBLIC_ENABLE_GALLERY === "1";

const galleryComponents = {
  "site-header": {
    label: "SiteHeader",
    render: () => (
      <SiteHeader
        brandId="marketing.gallery.brand.name"
        brandHref="/"
        activeSegment="general"
        navItems={[
          { id: "marketing.gallery.nav.home", href: "/", segment: "general" },
          {
            id: "marketing.gallery.nav.patients",
            href: "/patient",
            segment: "patient"
          },
          {
            id: "marketing.gallery.nav.providers",
            href: "/for-doctors",
            segment: "provider"
          },
          {
            id: "marketing.gallery.nav.organizations",
            href: "/for-employers",
            segment: "organization"
          }
        ]}
        primaryCtaLabelId="marketing.gallery.cta.primary"
        primaryCtaHref="/register"
        secondaryCtaLabelId="marketing.gallery.cta.secondary"
        secondaryCtaHref="/login"
      />
    )
  },
  "site-footer": {
    label: "SiteFooter",
    render: () => (
      <SiteFooter
        brandId="marketing.gallery.footer.brand"
        brandDescriptionId="marketing.gallery.footer.brand"
        brandHref="/"
        legalNoticeId="marketing.gallery.footer.legal"
        groups={[
          {
            id: "marketing.gallery.footer.group.platform",
            links: [
              { id: "marketing.gallery.footer.link.how", href: "/how-it-works" },
              { id: "marketing.gallery.footer.link.pricing", href: "/pricing" }
            ]
          },
          {
            id: "marketing.gallery.footer.group.company",
            links: [
              { id: "marketing.gallery.footer.link.about", href: "/about" },
              { id: "marketing.gallery.footer.link.contact", href: "/help" }
            ]
          }
        ]}
      />
    )
  },
  "emergency-ribbon": {
    label: "EmergencyRibbon",
    render: () => (
      <EmergencyRibbon
        headlineId="marketing.gallery.emergency.headline"
        actionLabelId="marketing.gallery.emergency.action"
        actionHref="/trust-safety"
      />
    )
  },
  "hero-block": {
    label: "HeroBlock",
    render: () => (
      <>
        <HeroBlock
          variant="universal"
          eyebrowId="marketing.gallery.hero.eyebrow.universal"
          headlineId="marketing.gallery.hero.headline.universal"
          bodyId="marketing.gallery.hero.body.universal"
          primaryCtaLabelId="marketing.gallery.cta.primary"
          primaryCtaHref="/register"
          secondaryCtaLabelId="marketing.gallery.cta.secondary"
          secondaryCtaHref="/login"
          illustrationId="hero-universal-network"
        />
        <HeroBlock
          variant="patient"
          eyebrowId="marketing.gallery.hero.eyebrow.patient"
          headlineId="marketing.gallery.hero.headline.patient"
          bodyId="marketing.gallery.hero.body.patient"
          primaryCtaLabelId="marketing.gallery.cta.primary"
          primaryCtaHref="/register"
          illustrationId="hero-patient-journey"
        />
        <HeroBlock
          variant="family-diaspora"
          eyebrowId="marketing.gallery.hero.eyebrow.family"
          headlineId="marketing.gallery.hero.headline.family"
          bodyId="marketing.gallery.hero.body.family"
          primaryCtaLabelId="marketing.gallery.cta.primary"
          primaryCtaHref="/for-diaspora"
          illustrationId="hero-family-diaspora-bridge"
        />
        <HeroBlock
          variant="provider"
          eyebrowId="marketing.gallery.hero.eyebrow.provider"
          headlineId="marketing.gallery.hero.headline.provider"
          bodyId="marketing.gallery.hero.body.provider"
          primaryCtaLabelId="marketing.gallery.cta.primary"
          primaryCtaHref="/for-doctors"
          illustrationId="hero-provider-clinic"
        />
        <HeroBlock
          variant="organization"
          eyebrowId="marketing.gallery.hero.eyebrow.organization"
          headlineId="marketing.gallery.hero.headline.organization"
          bodyId="marketing.gallery.hero.body.organization"
          primaryCtaLabelId="marketing.gallery.cta.primary"
          primaryCtaHref="/for-employers"
          illustrationId="hero-organization-partnership"
        />
      </>
    )
  },
  "story-section": {
    label: "StorySection",
    render: () => (
      <>
        <StorySection
          eyebrowId="marketing.gallery.story.eyebrow"
          headlineId="marketing.gallery.story.headline"
          bodyId="marketing.gallery.story.body"
          illustrationId="trust-coordination"
          align="right"
        />
        <StorySection
          eyebrowId="marketing.gallery.story.eyebrow"
          headlineId="marketing.gallery.story.headline"
          bodyId="marketing.gallery.story.body"
          illustrationId="family-diaspora-narrative"
          align="left"
        />
      </>
    )
  },
  "proof-strip": {
    label: "ProofStrip",
    render: () => (
      <ProofStrip
        headingId="marketing.gallery.proof.heading"
        items={[
          { id: "marketing.gallery.proof.followups", value: "3× on-time" },
          { id: "marketing.gallery.proof.handoffs", value: "Fewer errors" },
          { id: "marketing.gallery.proof.visibility", value: "Approved-only" }
        ]}
      />
    )
  },
  "workflow-stepper": {
    label: "WorkflowStepper",
    render: () => (
      <WorkflowStepper
        headingId="marketing.gallery.workflow.heading"
        steps={[
          {
            id: "marketing.gallery.workflow.intake",
            illustrationId: "workflow-intake"
          },
          {
            id: "marketing.gallery.workflow.triage",
            illustrationId: "workflow-triage"
          },
          {
            id: "marketing.gallery.workflow.consult",
            illustrationId: "workflow-consult"
          },
          {
            id: "marketing.gallery.workflow.fulfilment",
            illustrationId: "workflow-fulfilment"
          },
          {
            id: "marketing.gallery.workflow.followup",
            illustrationId: "workflow-followup"
          }
        ]}
      />
    )
  },
  "segment-grid": {
    label: "SegmentGrid",
    render: () => (
      <SegmentGrid
        headingId="marketing.gallery.segments.heading"
        cards={[
          { id: "marketing.gallery.segments.patients", href: "/patient" },
          { id: "marketing.gallery.segments.family", href: "/for-diaspora" },
          { id: "marketing.gallery.segments.providers", href: "/for-doctors" },
          {
            id: "marketing.gallery.segments.organizations",
            href: "/for-employers"
          }
        ]}
      />
    )
  },
  "trust-bar": {
    label: "TrustBar",
    render: () => (
      <TrustBar
        items={[
          {
            id: "marketing.gallery.trust.privacy",
            icon: (
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path d="M10 2 L16 5 v5 c0 4.5 -3 7 -6 8 c-3 -1 -6 -3.5 -6 -8 v-5 z" />
              </svg>
            )
          },
          {
            id: "marketing.gallery.trust.verified",
            icon: (
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path d="M4 11 l4 4 l8 -9 l-2 -2 l-6 7 l-2 -2 z" />
              </svg>
            )
          },
          {
            id: "marketing.gallery.trust.coordination",
            icon: (
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <circle cx="10" cy="10" r="3" />
                <circle cx="4" cy="4" r="2" />
                <circle cx="16" cy="4" r="2" />
                <circle cx="4" cy="16" r="2" />
                <circle cx="16" cy="16" r="2" />
              </svg>
            )
          }
        ]}
      />
    )
  },
  "faq-accordion": {
    label: "FAQAccordion",
    render: () => (
      <FAQAccordion
        headingId="marketing.gallery.faq.heading"
        items={[
          { id: "marketing.gallery.faq.who" },
          { id: "marketing.gallery.faq.data" },
          { id: "marketing.gallery.faq.payment" }
        ]}
      />
    )
  },
  "cta-section": {
    label: "CTASection",
    render: () => (
      <CTASection
        headlineId="marketing.gallery.cta.headline"
        bodyId="marketing.gallery.cta.body"
        primaryCtaLabelId="marketing.gallery.cta.primary"
        primaryCtaHref="/register"
        secondaryCtaLabelId="marketing.gallery.cta.secondary"
        secondaryCtaHref="/login"
        reassuranceId="marketing.gallery.cta.reassurance"
      />
    )
  },
  "pricing-matrix": {
    label: "PricingMatrix",
    render: () => (
      <PricingMatrix
        headingId="marketing.gallery.pricing.heading"
        disclaimerId="marketing.gallery.pricing.disclaimer"
        plans={[
          {
            id: "marketing.gallery.pricing.plan.individual",
            priceLabelId: "marketing.gallery.pricing.plan.individual.price",
            ctaLabelId: "marketing.gallery.pricing.cta.individual",
            ctaHref: "/register"
          },
          {
            id: "marketing.gallery.pricing.plan.family",
            emphasized: true,
            priceLabelId: "marketing.gallery.pricing.plan.family.price",
            ctaLabelId: "marketing.gallery.pricing.cta.family",
            ctaHref: "/register"
          },
          {
            id: "marketing.gallery.pricing.plan.organization",
            priceLabelId: "marketing.gallery.pricing.plan.organization.price",
            ctaLabelId: "marketing.gallery.pricing.cta.organization",
            ctaHref: "/help"
          }
        ]}
        features={[
          {
            id: "marketing.gallery.pricing.feature.booking",
            cells: [
              {
                planId: "marketing.gallery.pricing.plan.individual",
                value: "Included"
              },
              {
                planId: "marketing.gallery.pricing.plan.family",
                value: "Included"
              },
              {
                planId: "marketing.gallery.pricing.plan.organization",
                value: "Included"
              }
            ]
          },
          {
            id: "marketing.gallery.pricing.feature.records",
            cells: [
              {
                planId: "marketing.gallery.pricing.plan.individual",
                value: "Included"
              },
              {
                planId: "marketing.gallery.pricing.plan.family",
                value: "Included"
              },
              {
                planId: "marketing.gallery.pricing.plan.organization",
                value: "Included"
              }
            ]
          },
          {
            id: "marketing.gallery.pricing.feature.followup",
            cells: [
              {
                planId: "marketing.gallery.pricing.plan.individual",
                value: "Manual"
              },
              {
                planId: "marketing.gallery.pricing.plan.family",
                value: "Automated"
              },
              {
                planId: "marketing.gallery.pricing.plan.organization",
                value: "Automated"
              }
            ]
          },
          {
            id: "marketing.gallery.pricing.feature.family",
            cells: [
              {
                planId: "marketing.gallery.pricing.plan.individual",
                value: "—"
              },
              {
                planId: "marketing.gallery.pricing.plan.family",
                value: "Included"
              },
              {
                planId: "marketing.gallery.pricing.plan.organization",
                value: "Add-on"
              }
            ]
          },
          {
            id: "marketing.gallery.pricing.feature.audit",
            cells: [
              {
                planId: "marketing.gallery.pricing.plan.individual",
                value: "—"
              },
              {
                planId: "marketing.gallery.pricing.plan.family",
                value: "—"
              },
              {
                planId: "marketing.gallery.pricing.plan.organization",
                value: "Included"
              }
            ]
          }
        ]}
      />
    )
  },
  "quote-block": {
    label: "QuoteBlock",
    render: () => (
      <QuoteBlock
        quoteId="marketing.gallery.quote.body"
        attributionId="marketing.gallery.quote.attribution"
      />
    )
  },
  "legal-notice-strip": {
    label: "LegalNoticeStrip",
    render: () => (
      <LegalNoticeStrip
        noticeId="marketing.gallery.legal.body"
        approvalStatus="draft"
        effectiveDate="TBD"
      />
    )
  },
  "theme-toggle": {
    label: "ThemeToggle",
    render: () => <ThemeToggle />
  },
  "illustration-slot": {
    label: "IllustrationSlot",
    render: () => (
      <div className="nh-illustration-gallery">
        {illustrationIds.map((id) => (
          <div key={id} className="nh-illustration-gallery__item">
            <IllustrationSlot illustrationId={id} label={id} />
            <p>{id}</p>
          </div>
        ))}
      </div>
    )
  }
} as const;

export function generateStaticParams() {
  return Object.keys(galleryComponents).map((component) => ({ component }));
}

export const dynamic = "force-static";

export default async function GalleryPage({
  params
}: {
  params: Promise<{ component: string }>;
}) {
  if (!GALLERY_ENABLED) notFound();
  const { component } = await params;
  const entry =
    galleryComponents[component as keyof typeof galleryComponents];
  if (!entry) notFound();
  return (
    <PreviewContentProvider entries={galleryContent}>
      <main className="nh-gallery" data-component={component}>
        <header className="nh-gallery__header">
          <p className="nh-gallery__breadcrumb">Gallery / Marketing</p>
          <h1 className="nh-gallery__title">{entry.label}</h1>
        </header>
        <section className="nh-gallery__stage" data-theme-scope="light">
          <h2 className="nh-gallery__theme-title">Light theme</h2>
          <div className="nh-gallery__frame" data-theme="light">
            {entry.render()}
          </div>
        </section>
        <section className="nh-gallery__stage" data-theme-scope="dark">
          <h2 className="nh-gallery__theme-title">Dark theme</h2>
          <div className="nh-gallery__frame" data-theme="dark">
            {entry.render()}
          </div>
        </section>
      </main>
    </PreviewContentProvider>
  );
}
