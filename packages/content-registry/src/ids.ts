export const contentFamilies = [
  "foundation",
  "registration",
  "authentication",
  "patient-onboarding",
  "family-guardian",
  "diaspora-sponsorship",
  "appointment-booking",
  "payment",
  "consultation",
  "pharmacy-matching",
  "laboratory-matching",
  "provider-disclosure",
  "emergency-escalation",
  "accessibility"
] as const;
export type ContentFamily = (typeof contentFamilies)[number];
export type ContentId = string;
export const makeContentId = <T extends ContentFamily>(family: T, slug: string): ContentId => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Invalid content slug: " + slug);
  return family + "." + slug;
};
