import type { ContentEntry } from "../../schema.js";

const e = (
  slug: string,
  title: string,
  body: string,
  contentClass: ContentEntry["contentClass"] = "clinical-sensitive"
): ContentEntry => ({
  id: `marketing-emergency.${slug}`,
  family: "marketing-emergency",
  status: "draft",
  contentClass,
  surface: "public-site",
  title,
  body,
  evidence: ["DEC-P05-MKT-004"],
  syntheticOnly: true
});

export const marketingEmergencyEntries: ContentEntry[] = [
  e(
    "ribbon.headline",
    "In an emergency, call your local emergency service.",
    "This platform is not a substitute for emergency medical care."
  ),
  e("ribbon.action", "Emergency guidance", "Steps to take when care can't wait."),
  e(
    "hero.headline",
    "If care can't wait, here's exactly what to do.",
    "Clear steps for the moment, not a marketing page."
  ),
  e(
    "hero.body",
    "Emergency guidance overview",
    "If you or someone with you is having a medical emergency, contact your local emergency service immediately. Emergency care is never blocked by payment, plan authorisation, or account status. This page is guidance — it does not dispatch help."
  ),
  e(
    "guidance.call",
    "Call your local emergency service now.",
    "In Nigeria, the national number is 112. Local numbers vary by state — use the number you know locally, and don't wait to find the perfect one."
  ),
  e(
    "guidance.stay",
    "Stay with the person if it's safe.",
    "Keep them calm. Monitor breathing and consciousness until responders arrive. Note anything that changes — timing matters when the team gets there."
  ),
  e(
    "guidance.info",
    "Share location and what you're seeing.",
    "Give the dispatcher a specific address or landmark and describe what you observe: is the person conscious, breathing, bleeding, in pain? Concrete detail helps them send the right team."
  ),
  e(
    "note.platform",
    "This platform does not dispatch emergency services.",
    "NelyoHealth coordinates care after emergencies stabilise — it is not an emergency response service. In an emergency, always call your local service directly."
  )
];
