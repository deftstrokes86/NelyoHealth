import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-footer.${slug}`,
  family: "marketing-footer",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingFooterEntries: ContentEntry[] = [
  e(
    "support.eyebrow",
    "Need something faster?",
    "Footer support bar eyebrow."
  ),
  e(
    "support.headline",
    "Skip the scroll — go straight to what you need.",
    "Footer support bar headline."
  ),
  e(
    "newsletter.eyebrow",
    "Stay informed",
    "Footer newsletter block eyebrow."
  ),
  e(
    "newsletter.headline",
    "Product and care-coordination updates, occasionally.",
    "Footer newsletter block headline."
  ),
  e(
    "newsletter.body",
    "Footer newsletter supporting copy",
    "New features, new partner networks, and platform status — no more than once a month, and never sold to anyone."
  ),
  e(
    "newsletter.placeholder",
    "you@example.com",
    "Placeholder text for the newsletter email input."
  ),
  e(
    "newsletter.cta",
    "Notify me",
    "Footer newsletter submit button label."
  ),
  e(
    "column.platform",
    "Platform",
    "Footer link column heading — product and care segments."
  ),
  e(
    "column.company",
    "Company",
    "Footer link column heading — company and partnership pages."
  ),
  e(
    "column.resources",
    "Resources",
    "Footer link column heading — help, pricing, and knowledge pages."
  ),
  e(
    "column.legal",
    "Legal",
    "Footer link column heading — trust, privacy, and compliance pages."
  ),
  e("link.hospitals", "Hospitals", "Footer link label."),
  e("link.hmos", "HMOs", "Footer link label."),
  e("link.employers", "Employers", "Footer link label."),
  e("link.home-care", "Home care", "Footer link label."),
  e("link.mission", "Our mission", "Footer link label."),
  e("link.about", "About us", "Footer link label."),
  e("link.careers", "Careers", "Footer link label."),
  e("link.book-consultation", "Book a consultation", "Footer link label."),
  e("link.help-centre", "Help centre", "Footer link label."),
  e("link.blog", "Blog", "Footer link label."),
  e("link.cookie-policy", "Cookie policy", "Footer link label."),
  e("link.consent-policy", "Consent policy", "Footer link label."),
  e("link.data-protection", "Data protection", "Footer link label."),
  e(
    "link.community-guidelines",
    "Community guidelines",
    "Footer link label."
  ),
  e(
    "contact.heading",
    "Get in touch",
    "Footer contact information block heading."
  ),
  e("contact.email.label", "Email", "Footer contact info label."),
  e("contact.office.label", "Office", "Footer contact info label."),
  e(
    "contact.office.value",
    "Remote-first, coordinating care across Nigeria and the diaspora.",
    "Footer contact info — true positioning statement used in place of a fabricated street address, since no physical office has been established yet."
  ),
  e("contact.support.label", "Support", "Footer contact info label."),
  e(
    "contact.support.value",
    "Signed in? In-app help routes your message to a person who can already see your context.",
    "Footer contact info value."
  ),
  e(
    "bottom.copyright",
    "NelyoHealth. All rights reserved.",
    "Footer bottom bar copyright line. The year is prefixed at render time so this line never goes stale."
  ),
  e(
    "bottom.status.label",
    "Platform status",
    "Footer bottom bar link label pointing to the live status page."
  ),
  e(
    "closing.line",
    "Built with clinicians, patients, and regulators in the room from day one — not bolted on afterward.",
    "Closing trust-building microcopy line beneath the footer's bottom bar."
  )
];
