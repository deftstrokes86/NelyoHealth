import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-nav.${slug}`,
  family: "marketing-nav",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingNavEntries: ContentEntry[] = [
  // ---------- Top-level triggers ----------
  e("trigger.platform", "Platform", "Primary nav trigger label."),
  e("trigger.serve", "Who We Serve", "Primary nav trigger label."),
  e("trigger.resources", "Resources", "Primary nav trigger label."),
  e("trigger.company", "Company", "Primary nav trigger label."),

  // ---------- Platform mega menu ----------
  e(
    "platform.healthcare-journey.headline",
    "Healthcare Journey",
    "Platform mega menu item headline."
  ),
  e(
    "platform.healthcare-journey.body",
    "The path from first symptom to follow-up.",
    "Platform mega menu item description."
  ),
  e(
    "platform.how-it-works.headline",
    "How NelyoHealth Works",
    "Platform mega menu item headline."
  ),
  e(
    "platform.how-it-works.body",
    "Five connected stages, one record.",
    "Platform mega menu item description."
  ),
  e(
    "platform.ai-assistant.headline",
    "AI Health Assistant",
    "Platform mega menu item headline."
  ),
  e(
    "platform.ai-assistant.body",
    "Faster triage. Clinicians still decide.",
    "Platform mega menu item description."
  ),
  e(
    "platform.telemedicine.headline",
    "Telemedicine",
    "Platform mega menu item headline."
  ),
  e(
    "platform.telemedicine.body",
    "Video consults with a licensed doctor.",
    "Platform mega menu item description."
  ),
  e(
    "platform.medical-records.headline",
    "Medical Records",
    "Platform mega menu item headline."
  ),
  e(
    "platform.medical-records.body",
    "One signed chart, roles you approve.",
    "Platform mega menu item description."
  ),
  e(
    "platform.laboratory-services.headline",
    "Laboratory Services",
    "Platform mega menu item headline."
  ),
  e(
    "platform.laboratory-services.body",
    "Orders that arrive with full context.",
    "Platform mega menu item description."
  ),
  e(
    "platform.digital-prescriptions.headline",
    "Digital Prescriptions",
    "Platform mega menu item headline."
  ),
  e(
    "platform.digital-prescriptions.body",
    "Reach the pharmacy signed and verified.",
    "Platform mega menu item description."
  ),
  e(
    "platform.pharmacy-network.headline",
    "Pharmacy Network",
    "Platform mega menu item headline."
  ),
  e(
    "platform.pharmacy-network.body",
    "A verified network, not an open marketplace.",
    "Platform mega menu item description."
  ),
  e(
    "platform.family-care.headline",
    "Family Care",
    "Platform mega menu item headline."
  ),
  e(
    "platform.family-care.body",
    "Coordinate a loved one's care.",
    "Platform mega menu item description."
  ),
  e(
    "platform.care-coordination.headline",
    "Care Coordination",
    "Platform mega menu item headline."
  ),
  e(
    "platform.care-coordination.body",
    "Intake to follow-up, on one thread.",
    "Platform mega menu item description."
  ),
  e(
    "platform.security-privacy.headline",
    "Security & Privacy",
    "Platform mega menu item headline."
  ),
  e(
    "platform.security-privacy.body",
    "Consent you can see and revoke.",
    "Platform mega menu item description."
  ),
  e(
    "platform.featured.headline",
    "New to NelyoHealth?",
    "Platform mega menu featured card headline."
  ),
  e(
    "platform.featured.body",
    "See the five-stage care journey before you create an account.",
    "Platform mega menu featured card description."
  ),
  e(
    "platform.featured.cta",
    "See how it works",
    "Platform mega menu featured card CTA label."
  ),

  // ---------- Who We Serve mega menu ----------
  // Section headings
  e(
    "serve.section.individuals",
    "Individuals & Families",
    "Who We Serve column heading."
  ),
  e(
    "serve.section.professionals",
    "Healthcare Professionals",
    "Who We Serve column heading."
  ),
  e(
    "serve.section.organisations",
    "Healthcare Organisations",
    "Who We Serve column heading."
  ),
  e(
    "serve.section.partners",
    "Partners & Organisations",
    "Who We Serve column heading."
  ),
  // Shared / special labels
  e("serve.cta", "Learn More", "Default Who We Serve card CTA label."),
  e(
    "serve.cta.family-health",
    "Explore Family Health",
    "Who We Serve card CTA label for the Family Health card."
  ),
  e(
    "serve.coming-soon",
    "Coming Soon",
    "Badge shown on Who We Serve cards for audiences not yet live."
  ),
  // Column 1 — Individuals & Families
  e("serve.patient.headline", "Patient", "Who We Serve card headline."),
  e(
    "serve.patient.body",
    "Book consultations, manage your health records and receive coordinated care.",
    "Who We Serve card description."
  ),
  e("serve.family-health.headline", "Family Health", "Who We Serve card headline."),
  e(
    "serve.family-health.body",
    "Manage healthcare for your household from one secure family account.",
    "Who We Serve card description."
  ),
  e(
    "serve.parents.headline",
    "Parents & Guardians",
    "Who We Serve card headline."
  ),
  e(
    "serve.parents.body",
    "Manage appointments, medical records and healthcare decisions for your children.",
    "Who We Serve card description."
  ),
  e("serve.caregivers.headline", "Caregivers", "Who We Serve card headline."),
  e(
    "serve.caregivers.body",
    "Support elderly relatives and dependents with appropriate permissions.",
    "Who We Serve card description."
  ),
  e(
    "serve.diaspora.headline",
    "Diaspora Families",
    "Who We Serve card headline."
  ),
  e(
    "serve.diaspora.body",
    "Coordinate healthcare for loved ones in Nigeria from anywhere in the world.",
    "Who We Serve card description."
  ),
  // Column 2 — Healthcare Professionals
  e("serve.doctors.headline", "Doctors", "Who We Serve card headline."),
  e(
    "serve.doctors.body",
    "Provide consultations and coordinate ongoing patient care.",
    "Who We Serve card description."
  ),
  e("serve.specialists.headline", "Specialists", "Who We Serve card headline."),
  e(
    "serve.specialists.body",
    "Deliver specialist consultations across multiple disciplines.",
    "Who We Serve card description."
  ),
  e(
    "serve.mental-health.headline",
    "Mental Health Professionals",
    "Who We Serve card headline."
  ),
  e(
    "serve.mental-health.body",
    "Provide counselling and behavioural healthcare.",
    "Who We Serve card description."
  ),
  e(
    "serve.care-coordinators.headline",
    "Care Coordinators",
    "Who We Serve card headline (future audience)."
  ),
  e(
    "serve.care-coordinators.body",
    "Coordinate complex care across multiple providers.",
    "Who We Serve card description (future audience)."
  ),
  // Column 3 — Healthcare Organisations
  e("serve.hospitals.headline", "Hospitals", "Who We Serve card headline."),
  e(
    "serve.hospitals.body",
    "Manage patient care across departments.",
    "Who We Serve card description."
  ),
  e(
    "serve.laboratories.headline",
    "Labs/Diagnostic Centres",
    "Who We Serve card headline (labs and diagnostic centres are the same audience)."
  ),
  e(
    "serve.laboratories.body",
    "Receive digital test and imaging requests, and share results securely.",
    "Who We Serve card description."
  ),
  e("serve.pharmacies.headline", "Pharmacies", "Who We Serve card headline."),
  e(
    "serve.pharmacies.body",
    "Receive digital prescriptions and fulfil medications.",
    "Who We Serve card description."
  ),
  // Column 4 — Partners & Organisations
  e("serve.hmos.headline", "HMOs", "Who We Serve card headline."),
  e(
    "serve.hmos.body",
    "Connect members with healthcare providers.",
    "Who We Serve card description."
  ),
  e("serve.employers.headline", "Employers", "Who We Serve card headline."),
  e(
    "serve.employers.body",
    "Offer healthcare access as an employee benefit.",
    "Who We Serve card description."
  ),
  e(
    "serve.health-partners.headline",
    "Health Partners",
    "Who We Serve card headline."
  ),
  e(
    "serve.health-partners.body",
    "Collaborate with NelyoHealth to improve healthcare delivery.",
    "Who We Serve card description."
  ),
  e(
    "serve.government.headline",
    "Government & Public Health",
    "Who We Serve card headline (future audience)."
  ),
  e(
    "serve.government.body",
    "Support public health initiatives and healthcare programmes.",
    "Who We Serve card description (future audience)."
  ),
  // Bottom banner
  e(
    "serve.banner.headline",
    "One platform. Every healthcare journey.",
    "Who We Serve mega menu banner headline."
  ),
  e(
    "serve.banner.body",
    "Whether you're managing your own health, caring for a child, supporting ageing parents or running a healthcare organisation, NelyoHealth brings everyone together on one connected platform.",
    "Who We Serve mega menu banner body."
  ),
  e(
    "serve.banner.cta",
    "See How It Works",
    "Who We Serve mega menu banner CTA label."
  ),

  // ---------- Resources menu ----------
  e(
    "resources.health-library.headline",
    "Health Library",
    "Resources menu item headline."
  ),
  e(
    "resources.health-library.body",
    "Plain-language guides on conditions, tests, and treatments.",
    "Resources menu item description."
  ),
  e(
    "resources.help-centre.headline",
    "Help Centre",
    "Resources menu item headline."
  ),
  e(
    "resources.help-centre.body",
    "Find answers fast, or get routed to the right support person.",
    "Resources menu item description."
  ),
  e("resources.faqs.headline", "FAQs", "Resources menu item headline."),
  e(
    "resources.faqs.body",
    "Honest answers to what people actually ask before signing up.",
    "Resources menu item description."
  ),
  e("resources.blog.headline", "Blog", "Resources menu item headline."),
  e(
    "resources.blog.body",
    "Product updates and notes from the team.",
    "Resources menu item description."
  ),
  e(
    "resources.privacy-centre.headline",
    "Privacy Centre",
    "Resources menu item headline."
  ),
  e(
    "resources.privacy-centre.body",
    "What we collect, why, and the controls you have over it.",
    "Resources menu item description."
  ),
  e(
    "resources.accessibility.headline",
    "Accessibility",
    "Resources menu item headline."
  ),
  e(
    "resources.accessibility.body",
    "Our WCAG 2.2 AA commitments — and how to report a miss.",
    "Resources menu item description."
  ),
  e(
    "resources.status.headline",
    "System Status",
    "Resources menu item headline."
  ),
  e(
    "resources.status.body",
    "Live operating status of the platform.",
    "Resources menu item description."
  ),
  e(
    "resources.developer-api.headline",
    "Developer API",
    "Resources menu item headline."
  ),
  e(
    "resources.developer-api.body",
    "Coming soon — public API access isn't open yet.",
    "Resources menu item description."
  ),

  // ---------- Company menu ----------
  e(
    "company.about.headline",
    "About NelyoHealth",
    "Company menu item headline."
  ),
  e(
    "company.about.body",
    "Who we are and how the platform came to be.",
    "Company menu item description."
  ),
  e("company.mission.headline", "Mission", "Company menu item headline."),
  e(
    "company.mission.body",
    "Why we exist, and who we're building for.",
    "Company menu item description."
  ),
  e(
    "company.leadership.headline",
    "Leadership",
    "Company menu item headline."
  ),
  e(
    "company.leadership.body",
    "The team behind NelyoHealth.",
    "Company menu item description."
  ),
  e("company.careers.headline", "Careers", "Company menu item headline."),
  e(
    "company.careers.body",
    "Open roles — or check back as the team grows.",
    "Company menu item description."
  ),
  e("company.partners.headline", "Partners", "Company menu item headline."),
  e(
    "company.partners.body",
    "Hospitals, HMOs, employers, and pharmacies we work with.",
    "Company menu item description."
  ),
  e("company.newsroom.headline", "Newsroom", "Company menu item headline."),
  e(
    "company.newsroom.body",
    "Press mentions and company announcements.",
    "Company menu item description."
  ),
  e("company.contact.headline", "Contact", "Company menu item headline."),
  e(
    "company.contact.body",
    "Reach the right team — patients, partners, or press.",
    "Company menu item description."
  ),

  // ---------- Search / command palette ----------
  e("search.trigger-label", "Search", "Nav search trigger button label."),
  e(
    "search.placeholder",
    "Search pages, guides, and FAQs...",
    "Command palette search input placeholder."
  ),
  e(
    "search.empty",
    "Nothing matched that search.",
    "Command palette empty-state message."
  ),
  e(
    "search.hint",
    "Search the site",
    "Command palette dialog aria-label."
  ),
  e(
    "search.group.pages",
    "Pages",
    "Command palette result group heading for site pages."
  ),
  e(
    "search.group.faq",
    "Frequently asked questions",
    "Command palette result group heading for FAQ results."
  ),

  // ---------- Mobile drawer ----------
  e(
    "mobile.groups.platform",
    "Platform",
    "Mobile drawer collapsible section heading."
  ),
  e(
    "mobile.groups.serve",
    "Who We Serve",
    "Mobile drawer collapsible section heading."
  ),
  e(
    "mobile.groups.resources",
    "Resources",
    "Mobile drawer collapsible section heading."
  ),
  e(
    "mobile.groups.company",
    "Company",
    "Mobile drawer collapsible section heading."
  )
];
