import type { ContentEntry } from "../../schema.js";

const e = (slug: string, title: string, body: string): ContentEntry => ({
  id: `marketing-help-widget.${slug}`,
  family: "marketing-help-widget",
  status: "draft",
  contentClass: "public",
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingHelpWidgetEntries: ContentEntry[] = [
  e("trigger.label", "Help", "Floating help widget trigger button label."),
  e(
    "header.headline",
    "How can we help?",
    "Floating help widget panel header headline."
  ),
  e(
    "header.body",
    "Panel header supporting copy",
    "Whether you have questions about using NelyoHealth, need support, or aren't sure what to do next, we're here to help."
  ),
  e(
    "search.placeholder",
    "Search for help...",
    "Placeholder text for the help widget's quick-search field."
  ),
  e(
    "search.no-results",
    "Nothing matched that search.",
    "Try one of the categories below, or contact support directly."
  ),
  e(
    "card.book-consultation.headline",
    "Book a Consultation",
    "Help widget action card headline."
  ),
  e(
    "card.book-consultation.body",
    "Find the right healthcare professional and schedule an appointment.",
    "Help widget action card description."
  ),
  e(
    "card.help-centre.headline",
    "Help Centre",
    "Help widget action card headline."
  ),
  e(
    "card.help-centre.body",
    "Browse answers to common questions.",
    "Help widget action card description."
  ),
  e(
    "card.contact-support.headline",
    "Contact Support",
    "Help widget action card headline."
  ),
  e(
    "card.contact-support.body",
    "Talk to our customer support team.",
    "Help widget action card description."
  ),
  e(
    "card.emergency.headline",
    "Medical Emergency",
    "Help widget action card headline."
  ),
  e(
    "card.emergency.body",
    "Emergency symptoms require immediate attention.",
    "Help widget action card description."
  ),
  e(
    "card.accessibility.headline",
    "Accessibility Support",
    "Help widget action card headline."
  ),
  e(
    "card.accessibility.body",
    "Get help using NelyoHealth with accessibility features.",
    "Help widget action card description."
  ),
  e(
    "card.report-problem.headline",
    "Report a Problem",
    "Help widget action card headline."
  ),
  e(
    "card.report-problem.body",
    "Report technical issues or unexpected behaviour.",
    "Help widget action card description."
  ),
  e(
    "emergency.back",
    "Back",
    "Label for the control that returns from the emergency sub-panel to the main help menu."
  ),
  e(
    "emergency.headline",
    "Medical emergency?",
    "Emergency sub-panel headline."
  ),
  e(
    "emergency.body",
    "NelyoHealth is not an emergency response service",
    "If you or someone nearby is experiencing a medical emergency, contact your local emergency services or go to the nearest emergency department immediately."
  ),
  e(
    "emergency.find-hospitals",
    "Find Emergency Hospitals",
    "Emergency sub-panel button label."
  ),
  e(
    "emergency.call-services",
    "Call Emergency Services",
    "Emergency sub-panel button label."
  ),
  e(
    "emergency.followup",
    "After the emergency has been treated, NelyoHealth can help coordinate follow-up care.",
    "Emergency sub-panel closing reassurance line, shown only as a quiet afterthought below the two action buttons."
  ),
  e(
    "contact.heading",
    "Get in touch",
    "Help widget support-contact block heading."
  ),
  e("contact.email.label", "Email", "Help widget support-contact label."),
  e(
    "contact.hours.label",
    "Business hours",
    "Help widget support-contact label."
  ),
  e(
    "contact.hours.value",
    "Monday–Friday, 8:00 AM–6:00 PM WAT",
    "Help widget support-contact business hours value."
  ),
  e(
    "microcopy.headline",
    "Need immediate help?",
    "Closing microcopy at the bottom of the help widget panel."
  ),
  e(
    "microcopy.body",
    "Our team is ready to guide you to the right resources.",
    "Closing microcopy at the bottom of the help widget panel."
  )
];
