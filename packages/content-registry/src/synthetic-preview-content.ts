import type { ContentEntry } from "./schema.js";
export const syntheticPreviewContent: ContentEntry[] = [
  {
    id: "foundation.preview-banner",
    family: "foundation",
    status: "draft",
    contentClass: "public",
    surface: "preview",
    title: "Design foundation preview",
    body: "Synthetic, non-production UI foundation for NelyoHealth design tokens, motion, and content alignment.",
    cta: "Review foundation",
    evidence: ["P00-14A", "P01-FND-002"],
    syntheticOnly: true
  },
  {
    id: "provider-disclosure.prepayment-name-only",
    family: "provider-disclosure",
    status: "review",
    contentClass: "provider-protected",
    surface: "preview",
    title: "Provider match preview",
    body: "Only approved provider display name and non-identifying commercial availability are visible before successful payment.",
    cta: "Continue to payment",
    evidence: ["ADR-0001", "P00-08", "P00-13"],
    syntheticOnly: true
  },
  {
    id: "emergency-escalation.always-available",
    family: "emergency-escalation",
    status: "review",
    contentClass: "clinical-sensitive",
    surface: "preview",
    title: "Emergency escalation remains available",
    body: "Emergency paths are represented as immediate safety actions and are never blocked by payment, plan authorization, marketplace comparison, or routine booking.",
    cta: "Escalate safely",
    evidence: ["P00-09", "P00-14"],
    syntheticOnly: true
  }
];
