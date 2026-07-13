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
  e("ribbon.action", "See emergency guidance", "Emergency escalation help."),
  e(
    "hero.headline",
    "Emergency guidance.",
    "What to do when the situation cannot wait."
  ),
  e(
    "hero.body",
    "Emergency guidance overview",
    "If you or someone with you is experiencing an emergency, contact your local emergency service immediately. Emergency care is never blocked by payment, plan authorisation, or account status."
  ),
  e(
    "guidance.call",
    "Call your local emergency service.",
    "In Nigeria, call 112. Local numbers vary by state — contact the service you know locally."
  ),
  e(
    "guidance.stay",
    "Stay with the person if it is safe.",
    "Keep the person calm and monitor them until responders arrive."
  ),
  e(
    "guidance.info",
    "Share the location and situation.",
    "Give the dispatcher a clear location and describe what you observe."
  ),
  e(
    "note.platform",
    "This platform does not dispatch emergency services.",
    "Coordinated care is not the same as emergency response. Always contact your local emergency service directly for emergencies."
  )
];
