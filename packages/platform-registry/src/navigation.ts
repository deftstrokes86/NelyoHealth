import { z } from "zod";
import { workspaceKindSchema } from "./workspace.js";

/**
 * Navigation Registry (roadmap M8.3c).
 *
 * Navigation is DECLARED, not coded: each item states the route it opens, the workspace
 * kinds it belongs to, the capability it requires, and the feature that must be
 * available. `composeSurface` filters these against the composition capability set the
 * Context Engine resolves, so a hospital, a pharmacy, and an employer differ only in
 * registry data — never in a code branch that renders a menu.
 *
 * Hierarchy is expressed by `parentId`. An item with an empty `route` is a GROUP: it
 * exists to hold children and is dropped from the composed surface when none of its
 * children survive filtering (a group that opens nothing must never be offered).
 *
 * INVARIANT: navigation is composition, never authorization. An item appearing here — or
 * surviving the filter — does not grant its route; the PDP re-decides at the resource
 * door. Hiding a menu item is a UX affordance, not a security control.
 */
export const navigationSectionSchema = z.enum(["primary", "secondary", "utility", "admin"]);
export type NavigationSection = z.infer<typeof navigationSectionSchema>;

export const navigationItemSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  label: z.string().min(1),
  description: z.string().min(1),
  /** Route this item opens; empty means the item is a group (children only). */
  route: z.string().default(""),
  /** Lucide icon name — the platform's icon vocabulary. */
  icon: z.string().default(""),
  section: navigationSectionSchema.default("primary"),
  /** Parent Navigation Registry id, or null for a top-level item. */
  parentId: z.string().nullable().default(null),
  /** Sort order within the parent (or within the section, when top-level). */
  order: z.number().int().default(0),
  /** Workspace kinds this item belongs to. */
  workspaceKinds: z.array(workspaceKindSchema).min(1),
  /** Capability ref required to compose this item (declaration; the PDP decides). */
  requiresCapability: z.string().nullable().default(null),
  /** Feature Registry ref that must be available to the workspace. */
  requiresFeature: z.string().nullable().default(null),
  /** Notification Registry route whose count badges this item. */
  badgeSource: z.string().nullable().default(null),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type NavigationItem = z.infer<typeof navigationItemSchema>;

/**
 * The navigation catalog. Personal-workspace items serve patient / caregiver / guardian;
 * organization items serve clinician / organization-admin. Which of them a given actor
 * actually sees is decided entirely by capability + feature filtering at compose time.
 */
export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  // Personal workspace
  navigationItemSchema.parse({
    id: "home",
    label: "Home",
    description: "The personal workspace landing surface.",
    route: "/",
    icon: "house",
    order: 10,
    workspaceKinds: ["personal"]
  }),
  navigationItemSchema.parse({
    id: "appointments",
    label: "Appointments",
    description: "Upcoming and past appointments.",
    route: "/appointments",
    icon: "calendar-days",
    order: 20,
    workspaceKinds: ["personal"],
    requiresCapability: "appointment.read",
    requiresFeature: "appointments",
    badgeSource: "appointment-confirmed"
  }),
  navigationItemSchema.parse({
    id: "care-circle",
    label: "Care circle",
    description: "The people involved in this person's care.",
    route: "/care-circle",
    icon: "users-round",
    order: 30,
    workspaceKinds: ["personal"],
    requiresCapability: "care-circle.read",
    requiresFeature: "care-circle"
  }),
  navigationItemSchema.parse({
    id: "messages",
    label: "Messages",
    description: "Secure care messaging.",
    route: "/messages",
    icon: "message-circle",
    order: 40,
    workspaceKinds: ["personal"],
    requiresCapability: "message.read",
    requiresFeature: "messaging",
    badgeSource: "message-received"
  }),
  navigationItemSchema.parse({
    id: "personal-health",
    label: "Health record",
    description: "Group: the person's own health information.",
    icon: "heart-pulse",
    order: 50,
    workspaceKinds: ["personal"]
  }),
  navigationItemSchema.parse({
    id: "timeline",
    label: "Timeline",
    description: "The longitudinal health timeline.",
    route: "/timeline",
    icon: "activity",
    parentId: "personal-health",
    order: 10,
    workspaceKinds: ["personal"],
    requiresCapability: "timeline.read"
  }),
  navigationItemSchema.parse({
    id: "documents",
    label: "Documents",
    description: "Uploaded and shared clinical documents.",
    route: "/documents",
    icon: "file-text",
    parentId: "personal-health",
    order: 20,
    workspaceKinds: ["personal"],
    requiresCapability: "document.read",
    requiresFeature: "clinical-records"
  }),
  navigationItemSchema.parse({
    id: "prescriptions",
    label: "Prescriptions",
    description: "Prescriptions and dispensing history.",
    route: "/prescriptions",
    icon: "pill",
    parentId: "personal-health",
    order: 30,
    workspaceKinds: ["personal"],
    requiresCapability: "prescription.read",
    requiresFeature: "pharmacy"
  }),
  navigationItemSchema.parse({
    id: "settings",
    label: "Settings",
    description: "Profile, consent, and notification settings.",
    route: "/settings",
    icon: "settings",
    section: "utility",
    order: 90,
    workspaceKinds: ["personal"]
  }),
  navigationItemSchema.parse({
    id: "settings-profile",
    label: "Profile",
    description: "Personal and patient profile details.",
    route: "/settings/profile",
    icon: "user-round",
    section: "utility",
    parentId: "settings",
    order: 10,
    workspaceKinds: ["personal"],
    requiresCapability: "patient-profile.read"
  }),
  navigationItemSchema.parse({
    id: "settings-consent",
    label: "Consent",
    description: "Granted consents and withdrawals.",
    route: "/settings/consent",
    icon: "shield-check",
    section: "utility",
    parentId: "settings",
    order: 20,
    workspaceKinds: ["personal"],
    requiresCapability: "consent.grant"
  }),
  navigationItemSchema.parse({
    id: "settings-notifications",
    label: "Notifications",
    description: "Notification channels and preferences.",
    route: "/settings/notifications",
    icon: "bell",
    section: "utility",
    parentId: "settings",
    order: 30,
    workspaceKinds: ["personal"],
    requiresCapability: "notification.read"
  }),

  // Organization workspace
  navigationItemSchema.parse({
    id: "org-home",
    label: "Overview",
    description: "The organization workspace landing surface.",
    route: "/",
    icon: "layout-dashboard",
    order: 10,
    workspaceKinds: ["organization"]
  }),
  navigationItemSchema.parse({
    id: "org-schedule",
    label: "Schedule",
    description: "Clinician availability and the appointment schedule.",
    route: "/schedule",
    icon: "calendar-clock",
    order: 20,
    workspaceKinds: ["organization"],
    requiresCapability: "availability-slot.open",
    requiresFeature: "appointments"
  }),
  navigationItemSchema.parse({
    id: "org-clinical",
    label: "Clinical",
    description: "Group: clinical work surfaces.",
    icon: "stethoscope",
    order: 30,
    workspaceKinds: ["organization"]
  }),
  navigationItemSchema.parse({
    id: "org-patients",
    label: "Patients",
    description: "Patients under this organization's care.",
    route: "/patients",
    icon: "users",
    parentId: "org-clinical",
    order: 10,
    workspaceKinds: ["organization"],
    requiresCapability: "clinical-record.read",
    requiresFeature: "clinical-records"
  }),
  navigationItemSchema.parse({
    id: "org-consultations",
    label: "Consultations",
    description: "Scheduled and in-progress consultations.",
    route: "/consultations",
    icon: "clipboard-list",
    parentId: "org-clinical",
    order: 20,
    workspaceKinds: ["organization"],
    requiresCapability: "consultation.conduct",
    requiresFeature: "consultations"
  }),
  navigationItemSchema.parse({
    id: "org-messages",
    label: "Messages",
    description: "Secure messaging with patients and colleagues.",
    route: "/messages",
    icon: "message-circle",
    order: 40,
    workspaceKinds: ["organization"],
    requiresCapability: "message.read",
    requiresFeature: "messaging",
    badgeSource: "message-received"
  }),
  navigationItemSchema.parse({
    id: "org-admin",
    label: "Administration",
    description: "Organization administration.",
    route: "/admin",
    icon: "building-2",
    section: "admin",
    order: 80,
    workspaceKinds: ["organization"],
    requiresCapability: "organization.administer"
  }),
  navigationItemSchema.parse({
    id: "org-admin-members",
    label: "Members",
    description: "Organization membership and role assignment.",
    route: "/admin/members",
    icon: "user-cog",
    section: "admin",
    parentId: "org-admin",
    order: 10,
    workspaceKinds: ["organization"],
    requiresCapability: "organization.administer"
  }),
  navigationItemSchema.parse({
    id: "org-admin-settings",
    label: "Organization settings",
    description: "Organization profile, facilities, and service configuration.",
    route: "/admin/settings",
    icon: "sliders-horizontal",
    section: "admin",
    parentId: "org-admin",
    order: 20,
    workspaceKinds: ["organization"],
    requiresCapability: "organization.administer"
  })
] as const;

const NAVIGATION_IDS = new Set(NAVIGATION_ITEMS.map((entry) => entry.id));

export function isKnownNavigationItem(id: string): boolean {
  return NAVIGATION_IDS.has(id);
}

export function findNavigationItem(id: string): NavigationItem | undefined {
  return NAVIGATION_ITEMS.find((entry) => entry.id === id);
}

/** Direct children of a navigation item, in declared order. */
export function navigationChildren(parentId: string): NavigationItem[] {
  return NAVIGATION_ITEMS.filter((entry) => entry.parentId === parentId).sort(
    (a, b) => a.order - b.order
  );
}

/** An item with no route exists only to hold children. */
export function isNavigationGroup(item: NavigationItem): boolean {
  return item.route === "";
}
