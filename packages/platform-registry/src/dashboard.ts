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
  }),
  // --- Diaspora + organization-type dashboards (M8.3e) ---
  dashboardSchema.parse({
    id: "sponsor-home",
    label: "Care I support",
    description: "The diaspora sponsor's home dashboard — funding and coordination only.",
    appliesToWorkspaceKinds: ["personal"],
    layout: "grid",
    widgets: [
      {
        id: "sponsored-people-widget",
        kind: "list",
        title: "Who I support",
        description: "Family members this sponsor funds care for.",
        requiresCapability: "care-circle.read",
        requiresFeature: "care-circle",
        tool: "view-care-circle",
        size: "medium",
        order: 10
      },
      {
        id: "funding-status",
        kind: "metric",
        title: "Funding",
        description: "Balance and recent top-ups for sponsored care.",
        requiresCapability: "sponsorship.read",
        requiresFeature: "diaspora-sponsorship",
        size: "medium",
        order: 20
      },
      {
        id: "sponsored-appointments",
        kind: "list",
        title: "Upcoming care",
        description: "Appointments for the people this sponsor supports.",
        requiresCapability: "appointment.read",
        requiresFeature: "appointments",
        tool: "list-appointments",
        size: "large",
        order: 30
      },
      {
        id: "sponsor-message-panel",
        kind: "action-panel",
        title: "Stay in touch",
        description: "Message the care circle at home.",
        requiresCapability: "message.send",
        requiresFeature: "messaging",
        tool: "send-message",
        size: "small",
        order: 40
      }
    ]
  }),
  dashboardSchema.parse({
    id: "pharmacy-home",
    label: "Dispensing",
    description: "The pharmacy working dashboard.",
    appliesToWorkspaceKinds: ["organization"],
    layout: "columns",
    widgets: [
      {
        id: "dispensing-queue",
        kind: "list",
        title: "Dispensing queue",
        description: "Prescriptions awaiting dispensing.",
        requiresCapability: "prescription.dispense",
        requiresFeature: "pharmacy",
        size: "large",
        order: 10
      },
      {
        id: "pharmacy-messages",
        kind: "list",
        title: "Messages",
        description: "Unread secure messages.",
        requiresCapability: "message.read",
        requiresFeature: "messaging",
        size: "small",
        order: 20
      }
    ]
  }),
  dashboardSchema.parse({
    id: "laboratory-home",
    label: "Laboratory",
    description: "The laboratory working dashboard.",
    appliesToWorkspaceKinds: ["organization"],
    layout: "columns",
    widgets: [
      {
        id: "lab-worklist-widget",
        kind: "list",
        title: "Worklist",
        description: "Specimens and results awaiting recording.",
        requiresCapability: "laboratory.record-result",
        requiresFeature: "labs",
        size: "large",
        order: 10
      },
      {
        id: "lab-recent-results",
        kind: "list",
        title: "Recent results",
        description: "Recently recorded laboratory results.",
        requiresCapability: "laboratory.read",
        requiresFeature: "labs",
        size: "medium",
        order: 20
      }
    ]
  }),
  dashboardSchema.parse({
    id: "programme-home",
    label: "Programme overview",
    description: "The sponsored health programme dashboard (employer, NGO, government).",
    appliesToWorkspaceKinds: ["organization"],
    layout: "grid",
    widgets: [
      {
        id: "programme-overview",
        kind: "metric",
        title: "Programme at a glance",
        description: "Enrolment and utilisation headlines.",
        requiresCapability: "program.administer",
        requiresFeature: "programmes",
        size: "medium",
        order: 10
      },
      {
        id: "programme-population",
        kind: "chart",
        title: "Population health",
        description: "De-identified population health reporting.",
        requiresCapability: "population-health.read",
        requiresFeature: "programmes",
        size: "large",
        order: 20
      }
    ]
  }),
  dashboardSchema.parse({
    id: "coverage-home",
    label: "Coverage",
    description: "The insurer's coverage and eligibility dashboard.",
    appliesToWorkspaceKinds: ["organization"],
    layout: "grid",
    widgets: [
      {
        id: "coverage-overview",
        kind: "metric",
        title: "Coverage at a glance",
        description: "Active plans and member eligibility.",
        requiresCapability: "coverage.read",
        requiresFeature: "coverage",
        size: "medium",
        order: 10
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
