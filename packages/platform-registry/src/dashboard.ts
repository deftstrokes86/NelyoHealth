import { z } from "zod";
import { workspaceKindSchema } from "./workspace.js";

/**
 * Dashboard Registry (roadmap M8.3c).
 *
 * A dashboard is a DECLARED composition of widgets, not a hand-built page per persona.
 * Each widget states the capability it requires, the feature it belongs to, and — where
 * it reads data — the Tool Registry tool that supplies it. Because widgets filter
 * individually, one dashboard serves several personas: a patient, a caregiver, and a
 * guardian all open `patient-home` and each sees the subset their composition set
 * supports, with no per-persona page.
 *
 * A dashboard with no surviving widget is dropped from the composed surface rather than
 * rendered empty.
 *
 * INVARIANT: composition, never authorization. A widget surviving the filter does not
 * grant its data; its tool's capability is authorized by the PDP at invocation.
 */
export const dashboardWidgetKindSchema = z.enum([
  "metric",
  "list",
  "timeline",
  "calendar",
  "action-panel",
  "chart"
]);
export type DashboardWidgetKind = z.infer<typeof dashboardWidgetKindSchema>;

export const dashboardWidgetSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  kind: dashboardWidgetKindSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  /** Capability ref required to compose this widget (declaration; the PDP decides). */
  requiresCapability: z.string().nullable().default(null),
  /** Feature Registry ref that must be available to the workspace. */
  requiresFeature: z.string().nullable().default(null),
  /** Tool Registry ref supplying this widget's data, when it reads any. */
  tool: z.string().nullable().default(null),
  size: z.enum(["small", "medium", "large", "full"]).default("medium"),
  order: z.number().int().default(0),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type DashboardWidget = z.infer<typeof dashboardWidgetSchema>;

export const dashboardSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/),
  label: z.string().min(1),
  description: z.string().min(1),
  appliesToWorkspaceKinds: z.array(workspaceKindSchema).min(1),
  layout: z.enum(["grid", "stack", "columns"]).default("grid"),
  widgets: z.array(dashboardWidgetSchema).min(1),
  metadata: z.record(z.string(), z.unknown()).default({})
});
export type Dashboard = z.infer<typeof dashboardSchema>;

/**
 * The dashboard catalog. `patient-home` is shared by every personal-workspace persona;
 * `clinician-home` and `organization-admin-home` serve the organization workspace.
 * New org types add dashboards as data, not as code.
 */
export const DASHBOARDS: readonly Dashboard[] = [
  dashboardSchema.parse({
    id: "patient-home",
    label: "My health",
    description: "The personal workspace home dashboard.",
    appliesToWorkspaceKinds: ["personal"],
    layout: "grid",
    widgets: [
      {
        id: "upcoming-appointments",
        kind: "list",
        title: "Upcoming appointments",
        description: "The next scheduled appointments.",
        requiresCapability: "appointment.read",
        requiresFeature: "appointments",
        tool: "list-appointments",
        size: "medium",
        order: 10
      },
      {
        id: "quick-book",
        kind: "action-panel",
        title: "Book an appointment",
        description: "Book into an open availability slot.",
        requiresCapability: "appointment.book",
        requiresFeature: "appointments",
        tool: "book-appointment",
        size: "small",
        order: 20
      },
      {
        id: "care-circle-summary",
        kind: "list",
        title: "Care circle",
        description: "Who is involved in this person's care.",
        requiresCapability: "care-circle.read",
        requiresFeature: "care-circle",
        tool: "view-care-circle",
        size: "small",
        order: 30
      },
      {
        id: "health-timeline",
        kind: "timeline",
        title: "Recent activity",
        description: "The longitudinal health timeline.",
        requiresCapability: "timeline.read",
        tool: "view-timeline",
        size: "large",
        order: 40
      },
      {
        id: "unread-messages",
        kind: "list",
        title: "Messages",
        description: "Unread secure messages.",
        requiresCapability: "message.read",
        requiresFeature: "messaging",
        size: "small",
        order: 50
      },
      {
        id: "reply-to-message",
        kind: "action-panel",
        title: "Reply",
        description: "Reply on an open message thread.",
        requiresCapability: "message.send",
        requiresFeature: "messaging",
        tool: "send-message",
        size: "small",
        order: 60
      }
    ]
  }),
  dashboardSchema.parse({
    id: "clinician-home",
    label: "My clinic day",
    description: "The clinician's working dashboard.",
    appliesToWorkspaceKinds: ["organization"],
    layout: "columns",
    widgets: [
      {
        id: "todays-schedule",
        kind: "calendar",
        title: "Today's schedule",
        description: "Appointments scheduled for today.",
        requiresCapability: "appointment.read",
        requiresFeature: "appointments",
        tool: "list-appointments",
        size: "large",
        order: 10
      },
      {
        id: "open-consultations",
        kind: "list",
        title: "Open consultations",
        description: "Consultations awaiting completion.",
        requiresCapability: "consultation.conduct",
        requiresFeature: "consultations",
        size: "medium",
        order: 20
      },
      {
        id: "patient-timeline-access",
        kind: "timeline",
        title: "Patient timeline",
        description: "The timeline of the patient in context.",
        requiresCapability: "timeline.read",
        tool: "view-timeline",
        size: "medium",
        order: 30
      },
      {
        id: "clinician-messages",
        kind: "list",
        title: "Messages",
        description: "Unread secure messages.",
        requiresCapability: "message.read",
        requiresFeature: "messaging",
        size: "small",
        order: 40
      },
      {
        id: "clinician-reply",
        kind: "action-panel",
        title: "Reply",
        description: "Reply on an open message thread.",
        requiresCapability: "message.send",
        requiresFeature: "messaging",
        tool: "send-message",
        size: "small",
        order: 50
      }
    ]
  }),
  dashboardSchema.parse({
    id: "organization-admin-home",
    label: "Organization overview",
    description: "The organization administrator's dashboard.",
    appliesToWorkspaceKinds: ["organization"],
    layout: "grid",
    widgets: [
      {
        id: "org-overview",
        kind: "metric",
        title: "Organization at a glance",
        description: "Headline organization metrics.",
        requiresCapability: "organization.administer",
        size: "medium",
        order: 10
      },
      {
        id: "schedule-coverage",
        kind: "metric",
        title: "Schedule coverage",
        description: "Published availability against demand.",
        requiresCapability: "availability-slot.open",
        requiresFeature: "appointments",
        size: "medium",
        order: 20
      },
      {
        id: "org-activity",
        kind: "list",
        title: "Recent activity",
        description: "Recent administrative activity in the organization.",
        requiresCapability: "organization.administer",
        size: "large",
        order: 30
      }
    ]
  })
] as const;

const DASHBOARD_IDS = new Set(DASHBOARDS.map((entry) => entry.id));

export function isKnownDashboard(id: string): boolean {
  return DASHBOARD_IDS.has(id);
}

export function findDashboard(id: string): Dashboard | undefined {
  return DASHBOARDS.find((entry) => entry.id === id);
}
