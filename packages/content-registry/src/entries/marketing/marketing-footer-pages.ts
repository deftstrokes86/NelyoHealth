import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-footer-pages.${slug}`,
  family: "marketing-footer-pages",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingFooterPagesEntries: ContentEntry[] = [
  // ---------- Real-content utility pages ----------
  e(
    "pricing.eyebrow",
    "Pricing",
    "Footer link: Pricing."
  ),
  e(
    "pricing.headline",
    "There's no fixed price for healthcare.",
    "Pricing page headline."
  ),
  e(
    "pricing.body",
    "Creating a NelyoHealth account is free.",
    "Creating a NelyoHealth account is free. The cost of consultations, laboratory services, medications, and other healthcare services depends on the provider and the care you receive. You'll always see any applicable fees before confirming a paid service."
  ),
  e(
    "pricing.cta",
    "Create a free account",
    "Pricing page CTA — routes to account creation."
  ),
  e(
    "book-consultation.eyebrow",
    "Book a consultation",
    "Footer link: Book Consultation."
  ),
  e(
    "book-consultation.headline",
    "Booking starts with your account.",
    "Book Consultation page headline."
  ),
  e(
    "book-consultation.body",
    "There's no separate booking step to hunt for.",
    "There's no separate booking step to hunt for. Once you create a NelyoHealth account, you can book a consultation with a licensed clinician, choose a time that works for you, and get started from there."
  ),
  e(
    "book-consultation.cta",
    "Create your account",
    "Book Consultation page CTA — routes to account creation."
  ),
  e(
    "mission.eyebrow",
    "Our mission",
    "Footer link: Our Mission."
  ),
  e(
    "mission.headline",
    "Healthcare shouldn't depend on memory, luck, or who you know.",
    "Mission page headline."
  ),
  e(
    "mission.body",
    "Too much of healthcare happens in pieces.",
    "Too much of healthcare happens in pieces — a hospital here, a pharmacy there, a phone call to a relative in between. NelyoHealth exists to close those gaps: one connected record, one coordinated team, for patients, families, clinicians, and the organisations that support them."
  ),
  e(
    "mission.cta",
    "See how it works",
    "Mission page CTA — routes to the how-it-works page."
  ),
  e(
    "partners.eyebrow",
    "Partner with us",
    "Footer link: Partner With Us."
  ),
  e(
    "partners.headline",
    "Build better healthcare together.",
    "Partners hub page headline."
  ),
  e(
    "partners.body",
    "NelyoHealth partners with hospitals, laboratories, pharmacies, HMOs, and employers to connect care around the patient.",
    "NelyoHealth partners with hospitals, laboratories, pharmacies, HMOs, and employers to connect care around the patient. Explore the partnership that fits your organisation, or reach out directly and we'll point you the right way."
  ),
  e(
    "partners.cta",
    "Contact our partnerships team",
    "Partners hub page CTA — routes to contact."
  ),
  e(
    "partners.grid.heading",
    "Choose the partnership that fits you.",
    "Partners hub page — heading above the segment grid, distinct from the hero headline to avoid repeating it."
  ),
  e(
    "help-centre.eyebrow",
    "Help centre",
    "Footer link: Help Centre."
  ),
  e(
    "help-centre.headline",
    "Find what you need, or ask us directly.",
    "Help Centre hub page headline."
  ),
  e(
    "help-centre.body",
    "Most questions people ask before and after creating an account are answered in our FAQ.",
    "Most questions people ask before and after creating an account are answered in our FAQ. For anything specific to your care, privacy, or account, our support team is glad to help."
  ),
  e(
    "help-centre.cta",
    "Browse FAQs",
    "Help Centre page primary CTA — routes to the FAQ page."
  ),
  e(
    "help-centre.secondary",
    "Contact support",
    "Help Centre page secondary CTA — routes to contact."
  ),
  e(
    "status.eyebrow",
    "System status",
    "Footer link: System Status."
  ),
  e(
    "status.headline",
    "All systems operational.",
    "Status page headline."
  ),
  e(
    "status.body",
    "This page reflects the current operating status of NelyoHealth.",
    "This page reflects the current operating status of NelyoHealth. If you're experiencing an issue that isn't reflected here, please let our support team know."
  ),
  e(
    "status.cta",
    "Contact support",
    "Status page CTA — routes to contact."
  ),
  e(
    "cookie-policy.eyebrow",
    "Cookie policy",
    "Footer link: Cookie Policy."
  ),
  e(
    "cookie-policy.headline",
    "We only use cookies that keep this site running.",
    "Cookie policy page headline."
  ),
  e(
    "cookie-policy.body",
    "This site uses essential cookies for security and session handling.",
    "This site uses essential cookies for security and session handling. We do not use analytics or advertising cookies. Essential cookies keep you signed in, protect against session fixation, and maintain security — they can't be disabled."
  ),
  e(
    "cookie-policy.cta",
    "Read our Privacy Policy",
    "Cookie policy page CTA — routes to the legal notices page."
  ),
  e(
    "consent-policy.eyebrow",
    "Consent",
    "Footer link: Consent Policy."
  ),
  e(
    "consent-policy.headline",
    "You decide who sees your health information.",
    "Consent policy page headline."
  ),
  e(
    "consent-policy.body",
    "Consent on NelyoHealth isn't a one-time checkbox.",
    "Consent on NelyoHealth isn't a one-time checkbox. You choose which family members, caregivers, or providers can access specific parts of your record, and you can grant or withdraw that access at any time from your account."
  ),
  e(
    "consent-policy.cta",
    "See our full privacy commitments",
    "Consent policy page CTA — routes to the privacy overview page."
  ),
  e(
    "data-protection.eyebrow",
    "Data protection",
    "Footer link: Data Protection."
  ),
  e(
    "data-protection.headline",
    "Your records are encrypted, protected, and never sold.",
    "Data protection page headline."
  ),
  e(
    "data-protection.body",
    "Medical records are encrypted both in transit and at rest.",
    "Medical records are encrypted both in transit and at rest. Access follows your care team and your permissions — never broader. NelyoHealth does not sell patient data, and never will."
  ),
  e(
    "data-protection.cta",
    "Read more about trust and safety",
    "Data protection page CTA — routes to the trust and safety page."
  ),

  // ---------- Coming-soon pages ----------
  e(
    "about.eyebrow",
    "About NelyoHealth",
    "Footer link: About NelyoHealth."
  ),
  e(
    "about.headline",
    "A fuller story, coming soon.",
    "About page headline."
  ),
  e(
    "about.body",
    "We're still writing the story of how NelyoHealth came to be.",
    "We're still writing the story of how NelyoHealth came to be. In the meantime, our mission page explains why we exist and who we're building for."
  ),
  e(
    "about.caveat",
    "Scope caveat",
    "This page is still in progress. Check back soon, or get in touch if you'd like to know more before then."
  ),
  e(
    "about.cta",
    "Read our mission",
    "About page CTA — routes to the mission page."
  ),
  e(
    "careers.eyebrow",
    "Careers",
    "Footer link: Careers."
  ),
  e(
    "careers.headline",
    "We're not hiring publicly just yet.",
    "Careers page headline."
  ),
  e(
    "careers.body",
    "NelyoHealth is still early.",
    "NelyoHealth is still early. When we're ready to open roles, we'll list them here first."
  ),
  e(
    "careers.caveat",
    "Scope caveat",
    "There are no open roles listed yet. If you'd like to reach out anyway, our team would still like to hear from you."
  ),
  e(
    "careers.cta",
    "Get in touch",
    "Careers page CTA — routes to contact."
  ),
  e(
    "newsroom.eyebrow",
    "Newsroom",
    "Footer link: Newsroom."
  ),
  e(
    "newsroom.headline",
    "Nothing published here yet.",
    "Newsroom page headline."
  ),
  e(
    "newsroom.body",
    "We'll share company news and announcements here as they happen.",
    "We'll share company news and announcements here as they happen."
  ),
  e(
    "newsroom.caveat",
    "Scope caveat",
    "This page is still in progress."
  ),
  e(
    "newsroom.cta",
    "Contact us",
    "Newsroom page CTA — routes to contact."
  ),
  e(
    "blog.eyebrow",
    "Blog",
    "Footer link: Blog."
  ),
  e(
    "blog.headline",
    "Our first articles are still being written.",
    "Blog page headline."
  ),
  e(
    "blog.body",
    "We're planning to share practical, honest writing about healthcare coordination here.",
    "We're planning to share practical, honest writing about healthcare coordination here. Nothing published yet."
  ),
  e(
    "blog.caveat",
    "Scope caveat",
    "This page is still in progress."
  ),
  e(
    "blog.cta",
    "Explore how NelyoHealth works",
    "Blog page CTA — routes to the how-it-works page."
  ),
  e(
    "investors.eyebrow",
    "Investor relations",
    "Footer link: Investor Relations (Coming Soon)."
  ),
  e(
    "investors.headline",
    "This page is coming soon.",
    "Investor relations page headline."
  ),
  e(
    "investors.body",
    "We're not sharing investor information publicly yet.",
    "We're not sharing investor information publicly yet. If you'd like to get in touch about NelyoHealth, our team is happy to talk."
  ),
  e(
    "investors.caveat",
    "Scope caveat",
    "Investor relations information isn't published yet."
  ),
  e(
    "investors.cta",
    "Contact us",
    "Investor relations page CTA — routes to contact."
  ),
  e(
    "health-library.eyebrow",
    "Health library",
    "Footer link: Health Library."
  ),
  e(
    "health-library.headline",
    "A health library is on its way.",
    "Health library page headline."
  ),
  e(
    "health-library.body",
    "We're planning a library of clear, practical health information to go alongside your care.",
    "We're planning a library of clear, practical health information to go alongside your care — not to replace your clinician's advice."
  ),
  e(
    "health-library.caveat",
    "Scope caveat",
    "This page is still in progress."
  ),
  e(
    "health-library.cta",
    "Talk to a clinician",
    "Health library page CTA — routes to the doctors segment page."
  ),
  e(
    "developer-api.eyebrow",
    "Developer API",
    "Footer link: Developer API (Coming Soon)."
  ),
  e(
    "developer-api.headline",
    "API access isn't open yet.",
    "Developer API page headline."
  ),
  e(
    "developer-api.body",
    "We're not offering public API access at this stage.",
    "We're not offering public API access at this stage. If you're building something that needs to integrate with NelyoHealth, reach out and let's talk."
  ),
  e(
    "developer-api.caveat",
    "Scope caveat",
    "Developer API access is designed but not yet available."
  ),
  e(
    "developer-api.cta",
    "Contact us",
    "Developer API page CTA — routes to contact."
  ),
  e(
    "community-guidelines.eyebrow",
    "Community guidelines",
    "Footer link: Community Guidelines."
  ),
  e(
    "community-guidelines.headline",
    "This page is still in progress.",
    "Community guidelines page headline."
  ),
  e(
    "community-guidelines.body",
    "NelyoHealth doesn't currently have public community or forum features.",
    "NelyoHealth doesn't currently have public community or forum features. If that changes, the guidelines for participating will appear here."
  ),
  e(
    "community-guidelines.caveat",
    "Scope caveat",
    "This page is still in progress."
  ),
  e(
    "community-guidelines.cta",
    "Contact us",
    "Community guidelines page CTA — routes to contact."
  )
];
