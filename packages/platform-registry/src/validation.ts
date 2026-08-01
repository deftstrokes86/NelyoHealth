import { CAPABILITIES, capabilitySchema, findCapability, isKnownCapability } from "./capability.js";
import { TOOLS, toolSchema, findTool, isKnownTool } from "./tool.js";
import {
  WORKSPACES,
  workspaceSchema,
  findWorkspace,
  isKnownWorkspace,
  type WorkspaceKind
} from "./workspace.js";
import { PERSONAS, personaSchema, findPersona, isKnownPersona } from "./persona.js";
import { EVENTS, eventSchema, isKnownEvent } from "./event.js";
import { FEATURES, featureSchema, isKnownFeature } from "./feature.js";
import {
  CARE_CIRCLE_ROLES,
  careCircleRelationshipType,
  careCircleRoleSchema,
  isKnownCareCircleRole
} from "./care-circle.js";
import {
  NOTIFICATION_ROUTES,
  notificationRouteSchema,
  isKnownNotificationRoute
} from "./notification.js";
import { WORKFLOWS, workflowSchema } from "./workflow.js";
import {
  NAVIGATION_ITEMS,
  navigationItemSchema,
  findNavigationItem,
  isNavigationGroup
} from "./navigation.js";
import { DASHBOARDS, dashboardSchema, findDashboard } from "./dashboard.js";
import { EXPERIENCES, experienceSchema, findExperience } from "./experience.js";
import { SEARCH_SCOPES, searchScopeSchema, findSearchScope } from "./search.js";
import { REPORTS, reportSchema, findReport } from "./report.js";
import { INTEGRATIONS, integrationSchema } from "./integration.js";
import { findEvent } from "./event.js";

/**
 * Cross-registry validation (roadmap M8.3a; extended M8.3b, M8.3c). Parses every entry
 * against its schema and enforces referential integrity ACROSS registries. This is what
 * lets the Platform Registry Layer eventually be edited by an administrator through a
 * platform builder: any change — developer or admin — that breaks a reference fails the
 * validation gate rather than silently producing an incoherent surface.
 *
 * M8.3c closed the persona/workspace composition forward references; M8.3d closes the
 * last two (`searchScopes`, `reports`) and adds the Search / Report / Integration
 * registries. **No forward reference remains in the layer** except notification and
 * workflow content templates, which point at the separate content-registry family.
 *
 * Several rules here are policy, not just referential integrity, and are stated as gate
 * failures because a reviewer will not catch them reliably: an analytics report may only
 * source events the Event Registry marks `analyticsVisible` (ADR-0010); a write tool
 * exposed to AI or automation must require approval; a search scope's capability must
 * match the resource it searches.
 */
export interface RegistryValidationIssue {
  registry: string;
  entryId: string;
  message: string;
}

export function validatePlatformRegistry(): RegistryValidationIssue[] {
  const issues: RegistryValidationIssue[] = [];
  const add = (registry: string, entryId: string, message: string) =>
    issues.push({ registry, entryId, message });

  // 1. Schema parse.
  const parseAll = <T>(
    registry: string,
    entries: readonly unknown[],
    schema: { parse: (v: unknown) => T }
  ) => {
    for (const entry of entries) {
      try {
        schema.parse(entry);
      } catch (error) {
        add(
          registry,
          (entry as { id?: string })?.id ?? "<unknown>",
          `schema: ${(error as Error).message}`
        );
      }
    }
  };
  parseAll("capability", CAPABILITIES, capabilitySchema);
  parseAll("tool", TOOLS, toolSchema);
  parseAll("workspace", WORKSPACES, workspaceSchema);
  parseAll("persona", PERSONAS, personaSchema);
  parseAll("event", EVENTS, eventSchema);
  parseAll("feature", FEATURES, featureSchema);
  parseAll("care-circle-role", CARE_CIRCLE_ROLES, careCircleRoleSchema);
  parseAll("notification-route", NOTIFICATION_ROUTES, notificationRouteSchema);
  parseAll("workflow", WORKFLOWS, workflowSchema);
  parseAll("navigation", NAVIGATION_ITEMS, navigationItemSchema);
  parseAll("dashboard", DASHBOARDS, dashboardSchema);
  parseAll("experience", EXPERIENCES, experienceSchema);
  parseAll("search-scope", SEARCH_SCOPES, searchScopeSchema);
  parseAll("report", REPORTS, reportSchema);
  parseAll("integration", INTEGRATIONS, integrationSchema);

  // 2. Unique ids within each registry.
  const assertUnique = (registry: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) add(registry, id, "duplicate id");
      seen.add(id);
    }
  };
  assertUnique(
    "capability",
    CAPABILITIES.map((e) => e.id)
  );
  assertUnique(
    "tool",
    TOOLS.map((e) => e.id)
  );
  assertUnique(
    "workspace",
    WORKSPACES.map((e) => e.id)
  );
  assertUnique(
    "persona",
    PERSONAS.map((e) => e.id)
  );
  assertUnique(
    "event",
    EVENTS.map((e) => e.id)
  );
  assertUnique(
    "feature",
    FEATURES.map((e) => e.id)
  );
  assertUnique(
    "care-circle-role",
    CARE_CIRCLE_ROLES.map((e) => e.id)
  );
  assertUnique(
    "notification-route",
    NOTIFICATION_ROUTES.map((e) => e.id)
  );
  assertUnique(
    "workflow",
    WORKFLOWS.map((e) => e.id)
  );
  assertUnique(
    "navigation",
    NAVIGATION_ITEMS.map((e) => e.id)
  );
  assertUnique(
    "dashboard",
    DASHBOARDS.map((e) => e.id)
  );
  assertUnique(
    "experience",
    EXPERIENCES.map((e) => e.id)
  );
  assertUnique(
    "search-scope",
    SEARCH_SCOPES.map((e) => e.id)
  );
  assertUnique(
    "report",
    REPORTS.map((e) => e.id)
  );
  assertUnique(
    "integration",
    INTEGRATIONS.map((e) => e.id)
  );

  const cap = (registry: string, entryId: string, ids: string[]) => {
    for (const id of ids)
      if (!isKnownCapability(id)) add(registry, entryId, `unknown capability '${id}'`);
  };
  const evt = (registry: string, entryId: string, ids: string[]) => {
    for (const id of ids) if (!isKnownEvent(id)) add(registry, entryId, `unknown event '${id}'`);
  };

  // 3. Referential integrity — capabilities.
  for (const tool of TOOLS) {
    cap("tool", tool.id, [tool.capability]);
    evt("tool", tool.id, [...tool.events.produces, ...tool.events.consumes]);
  }
  for (const workspace of WORKSPACES) {
    cap("workspace", workspace.id, workspace.capabilities);
    for (const personaId of workspace.personas) {
      if (!isKnownPersona(personaId))
        add("workspace", workspace.id, `unknown persona '${personaId}'`);
    }
    for (const featureId of workspace.features) {
      if (!isKnownFeature(featureId))
        add("workspace", workspace.id, `unknown feature '${featureId}'`);
    }
  }
  for (const persona of PERSONAS) {
    cap("persona", persona.id, persona.capabilities);
    cap("persona", persona.id, persona.interactionPatterns.primaryActions);
  }
  for (const feature of FEATURES) {
    cap("feature", feature.id, feature.capabilities);
    evt("feature", feature.id, [...feature.events.produces, ...feature.events.consumes]);
  }
  for (const role of CARE_CIRCLE_ROLES) {
    cap("care-circle-role", role.id, role.capabilities);
    evt("care-circle-role", role.id, [...role.events.produces, ...role.events.consumes]);
    // M8.3e: the composition mapping the runtime resolves against must be coherent, and
    // must be declared as a PAIR — a persona with no workspace composes nowhere.
    const { composesAsPersona, composesInWorkspace } = role;
    if (composesAsPersona !== null && !isKnownPersona(composesAsPersona)) {
      add("care-circle-role", role.id, `unknown composesAsPersona '${composesAsPersona}'`);
    }
    if (composesInWorkspace !== null && !isKnownWorkspace(composesInWorkspace)) {
      add("care-circle-role", role.id, `unknown composesInWorkspace '${composesInWorkspace}'`);
    }
    if ((composesAsPersona === null) !== (composesInWorkspace === null)) {
      add(
        "care-circle-role",
        role.id,
        "composesAsPersona and composesInWorkspace must be declared together"
      );
    }
    const persona = composesAsPersona ? findPersona(composesAsPersona) : undefined;
    const workspace = composesInWorkspace ? findWorkspace(composesInWorkspace) : undefined;
    if (persona && workspace) {
      if (!workspace.personas.includes(persona.id)) {
        add(
          "care-circle-role",
          role.id,
          `persona '${persona.id}' is not declared on workspace '${workspace.id}'`
        );
      }
      // A role narrows composition by intersection, so a role sharing no capability with
      // the persona it composes as would always compose an empty surface.
      const shared = role.capabilities.filter((id) => persona.capabilities.includes(id));
      if (role.capabilities.length > 0 && shared.length === 0) {
        add(
          "care-circle-role",
          role.id,
          `shares no capability with persona '${persona.id}' — it could only ever compose an empty surface`
        );
      }
    }
  }
  // The persisted relationship type each role maps to must be unique, or the runtime
  // lookup from a relationship to a role would be ambiguous.
  assertUnique(
    "care-circle-role-relationship-type",
    CARE_CIRCLE_ROLES.map((role) => careCircleRelationshipType(role))
  );

  // 4. Referential integrity — events, workflows, notifications.
  for (const workflow of WORKFLOWS) {
    for (const transition of workflow.transitions) {
      if (transition.requiresCapability)
        cap("workflow", workflow.id, [transition.requiresCapability]);
      evt("workflow", workflow.id, transition.emitsEvents);
      for (const routeId of transition.notificationHooks) {
        if (!isKnownNotificationRoute(routeId))
          add("workflow", workflow.id, `unknown notification route '${routeId}'`);
      }
    }
  }
  for (const route of NOTIFICATION_ROUTES) {
    evt("notification-route", route.id, [route.trigger]);
    for (const personaId of route.audience.personas) {
      if (!isKnownPersona(personaId))
        add("notification-route", route.id, `unknown persona '${personaId}'`);
    }
    for (const roleId of route.audience.careCircleRoles) {
      if (!isKnownCareCircleRole(roleId))
        add("notification-route", route.id, `unknown care-circle role '${roleId}'`);
    }
    if (route.audience.capability) cap("notification-route", route.id, [route.audience.capability]);
  }

  // 5. Referential integrity — composition surfaces (M8.3c).
  const feat = (registry: string, entryId: string, ids: (string | null)[]) => {
    for (const id of ids)
      if (id !== null && !isKnownFeature(id)) add(registry, entryId, `unknown feature '${id}'`);
  };
  const capOpt = (registry: string, entryId: string, ids: (string | null)[]) =>
    cap(
      registry,
      entryId,
      ids.filter((id): id is string => id !== null)
    );
  /** Two kind lists must overlap, or the entry could never compose. */
  const kindsOverlap = (a: readonly WorkspaceKind[], b: readonly WorkspaceKind[]) =>
    a.some((kind) => b.includes(kind));

  for (const item of NAVIGATION_ITEMS) {
    capOpt("navigation", item.id, [item.requiresCapability]);
    feat("navigation", item.id, [item.requiresFeature]);
    if (item.badgeSource && !isKnownNotificationRoute(item.badgeSource)) {
      add("navigation", item.id, `unknown notification route '${item.badgeSource}'`);
    }
    if (item.parentId !== null) {
      const parent = findNavigationItem(item.parentId);
      if (!parent) {
        add("navigation", item.id, `unknown parent '${item.parentId}'`);
      } else if (item.parentId === item.id) {
        add("navigation", item.id, "item is its own parent");
      } else if (parent.parentId !== null) {
        // One level of nesting keeps composition (and the UI) tractable, and makes
        // parent cycles structurally impossible.
        add("navigation", item.id, `parent '${parent.id}' is itself nested (max depth 2)`);
      } else if (!kindsOverlap(item.workspaceKinds, parent.workspaceKinds)) {
        add(
          "navigation",
          item.id,
          `workspace kinds do not overlap parent '${parent.id}' — it could never compose`
        );
      }
    }
    if (isNavigationGroup(item) && !NAVIGATION_ITEMS.some((e) => e.parentId === item.id)) {
      add("navigation", item.id, "group item has no route and no children");
    }
  }

  for (const dashboard of DASHBOARDS) {
    assertUnique(
      `dashboard:${dashboard.id}`,
      dashboard.widgets.map((w) => w.id)
    );
    for (const widget of dashboard.widgets) {
      capOpt("dashboard", `${dashboard.id}/${widget.id}`, [widget.requiresCapability]);
      feat("dashboard", `${dashboard.id}/${widget.id}`, [widget.requiresFeature]);
      if (widget.tool === null) continue;
      if (!isKnownTool(widget.tool)) {
        add("dashboard", `${dashboard.id}/${widget.id}`, `unknown tool '${widget.tool}'`);
        continue;
      }
      // A widget must require the capability its tool exposes, or the filter would offer
      // a widget whose tool the PDP will refuse.
      const toolCapability = findTool(widget.tool)!.capability;
      if (widget.requiresCapability !== null && widget.requiresCapability !== toolCapability) {
        add(
          "dashboard",
          `${dashboard.id}/${widget.id}`,
          `requiresCapability '${widget.requiresCapability}' does not match tool '${widget.tool}' capability '${toolCapability}'`
        );
      }
    }
  }

  for (const experience of EXPERIENCES) {
    capOpt("experience", experience.id, [experience.requiresCapability]);
    feat("experience", experience.id, [experience.requiresFeature]);
    assertUnique(
      `experience:${experience.id}`,
      experience.steps.map((s) => s.id)
    );
    for (const step of experience.steps) {
      capOpt("experience", `${experience.id}/${step.id}`, [step.requiresCapability]);
      if (step.tool !== null && !isKnownTool(step.tool)) {
        add("experience", `${experience.id}/${step.id}`, `unknown tool '${step.tool}'`);
      }
    }
  }

  // 5b. Search / Report / Integration + the Tool safety rule (M8.3d).
  const capabilityResources = new Set(CAPABILITIES.map((entry) => entry.resource));

  for (const tool of TOOLS) {
    // An unattended consumer must never be handed a silent write.
    const unattended = tool.compatibility.supportsAI || tool.compatibility.supportsAutomation;
    if (tool.effect === "write" && unattended && !tool.compatibility.requiresApproval) {
      add(
        "tool",
        tool.id,
        "a write tool exposed to AI or automation must set compatibility.requiresApproval"
      );
    }
  }

  for (const scope of SEARCH_SCOPES) {
    capOpt("search-scope", scope.id, [scope.requiresCapability]);
    feat("search-scope", scope.id, [scope.requiresFeature]);
    if (scope.tool !== null && !isKnownTool(scope.tool)) {
      add("search-scope", scope.id, `unknown tool '${scope.tool}'`);
    }
    if (!capabilityResources.has(scope.resource)) {
      add("search-scope", scope.id, `resource '${scope.resource}' is not a capability resource`);
    }
    // Searching a resource under a capability for a different resource would let a scope
    // claim reach its capability does not cover.
    if (scope.requiresCapability !== null) {
      const capability = findCapability(scope.requiresCapability);
      if (capability && capability.resource !== scope.resource) {
        add(
          "search-scope",
          scope.id,
          `capability '${capability.id}' covers resource '${capability.resource}', not '${scope.resource}'`
        );
      }
    }
  }

  for (const report of REPORTS) {
    capOpt("report", report.id, [report.requiresCapability]);
    feat("report", report.id, [report.requiresFeature]);
    evt("report", report.id, report.sourceEvents);
    if (report.kind !== "analytics") continue;
    // ADR-0010: analytics may only be projected from events cleared for analytics.
    for (const eventId of report.sourceEvents) {
      const event = findEvent(eventId);
      if (event && !event.analyticsVisible) {
        add(
          "report",
          report.id,
          `analytics report sources '${eventId}', which is not analyticsVisible (ADR-0010)`
        );
      }
    }
  }

  for (const integration of INTEGRATIONS) {
    capOpt("integration", integration.id, [integration.requiresCapability]);
    evt("integration", integration.id, [
      ...integration.events.produces,
      ...integration.events.consumes
    ]);
  }

  // 6. Referential integrity — persona / workspace composition declarations (M8.3c/d).
  for (const persona of PERSONAS) {
    for (const id of persona.defaultDashboards) {
      const dashboard = findDashboard(id);
      if (!dashboard) {
        add("persona", persona.id, `unknown dashboard '${id}'`);
      } else if (
        !kindsOverlap(dashboard.appliesToWorkspaceKinds, persona.appliesToWorkspaceKinds)
      ) {
        add("persona", persona.id, `dashboard '${id}' does not apply to this persona's workspaces`);
      }
    }
    for (const id of persona.navigation) {
      const item = findNavigationItem(id);
      if (!item) {
        add("persona", persona.id, `unknown navigation item '${id}'`);
      } else if (item.parentId !== null) {
        add(
          "persona",
          persona.id,
          `navigation item '${id}' is nested — declare its top-level parent '${item.parentId}'`
        );
      } else if (!kindsOverlap(item.workspaceKinds, persona.appliesToWorkspaceKinds)) {
        add(
          "persona",
          persona.id,
          `navigation item '${id}' does not apply to this persona's workspaces`
        );
      }
    }
    const experienceRef = (id: string, kind: "onboarding" | "homepage-section" | "profile") => {
      const experience = findExperience(id);
      if (!experience) {
        add("persona", persona.id, `unknown experience '${id}'`);
        return;
      }
      if (experience.kind !== kind) {
        add(
          "persona",
          persona.id,
          `experience '${id}' is kind '${experience.kind}', expected '${kind}'`
        );
        return;
      }
      if (!kindsOverlap(experience.appliesToWorkspaceKinds, persona.appliesToWorkspaceKinds)) {
        add(
          "persona",
          persona.id,
          `experience '${id}' does not apply to this persona's workspaces`
        );
      }
    };
    for (const id of persona.onboardingFlows) experienceRef(id, "onboarding");
    for (const id of persona.homepageComposition) experienceRef(id, "homepage-section");
    if (persona.behavior.preferredLandingExperience) {
      experienceRef(persona.behavior.preferredLandingExperience, "profile");
    }
    if (
      persona.behavior.defaultSearchPreference &&
      !findSearchScope(persona.behavior.defaultSearchPreference)
    ) {
      add(
        "persona",
        persona.id,
        `unknown default search scope '${persona.behavior.defaultSearchPreference}'`
      );
    }
    if (
      persona.behavior.defaultReportPreference &&
      !findReport(persona.behavior.defaultReportPreference)
    ) {
      add(
        "persona",
        persona.id,
        `unknown default report '${persona.behavior.defaultReportPreference}'`
      );
    }
    for (const id of persona.searchScopes) {
      const scope = findSearchScope(id);
      if (!scope) {
        add("persona", persona.id, `unknown search scope '${id}'`);
      } else if (!kindsOverlap(scope.appliesToWorkspaceKinds, persona.appliesToWorkspaceKinds)) {
        add(
          "persona",
          persona.id,
          `search scope '${id}' does not apply to this persona's workspaces`
        );
      }
    }
    for (const id of persona.reports) {
      const report = findReport(id);
      if (!report) {
        add("persona", persona.id, `unknown report '${id}'`);
      } else if (!kindsOverlap(report.appliesToWorkspaceKinds, persona.appliesToWorkspaceKinds)) {
        add("persona", persona.id, `report '${id}' does not apply to this persona's workspaces`);
      }
    }
  }

  for (const workspace of WORKSPACES) {
    const landing = workspace.presentation.landingDashboard;
    if (landing) {
      const dashboard = findDashboard(landing);
      if (!dashboard) {
        add("workspace", workspace.id, `unknown landing dashboard '${landing}'`);
      } else if (!dashboard.appliesToWorkspaceKinds.includes(workspace.kind)) {
        add(
          "workspace",
          workspace.id,
          `landing dashboard '${landing}' does not apply to kind '${workspace.kind}'`
        );
      }
    }
    const profileId = workspace.presentation.experienceProfile;
    if (profileId) {
      const profile = findExperience(profileId);
      if (!profile) {
        add("workspace", workspace.id, `unknown experience profile '${profileId}'`);
      } else if (profile.kind !== "profile") {
        add(
          "workspace",
          workspace.id,
          `experience '${profileId}' is kind '${profile.kind}', expected 'profile'`
        );
      } else if (!profile.appliesToWorkspaceKinds.includes(workspace.kind)) {
        add(
          "workspace",
          workspace.id,
          `experience profile '${profileId}' does not apply to kind '${workspace.kind}'`
        );
      }
    }
  }

  // 7. Coherence: workspace personas apply to the workspace kind.
  for (const workspace of WORKSPACES) {
    for (const personaId of workspace.personas) {
      const persona = PERSONAS.find((entry) => entry.id === personaId);
      if (persona && !persona.appliesToWorkspaceKinds.includes(workspace.kind)) {
        add(
          "workspace",
          workspace.id,
          `persona '${personaId}' does not apply to workspace kind '${workspace.kind}'`
        );
      }
    }
  }

  return issues;
}

/** Throw if the registry layer is not coherent. Used by the CI validation gate. */
export function assertPlatformRegistryValid(): void {
  const issues = validatePlatformRegistry();
  if (issues.length > 0) {
    const lines = issues.map((issue) => `  [${issue.registry}:${issue.entryId}] ${issue.message}`);
    throw new Error(`Platform Registry validation failed:\n${lines.join("\n")}`);
  }
}
