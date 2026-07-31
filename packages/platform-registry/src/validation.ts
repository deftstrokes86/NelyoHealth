import { CAPABILITIES, capabilitySchema, isKnownCapability } from "./capability.js";
import { TOOLS, toolSchema } from "./tool.js";
import { WORKSPACES, workspaceSchema } from "./workspace.js";
import { PERSONAS, personaSchema, isKnownPersona } from "./persona.js";
import { EVENTS, eventSchema, isKnownEvent } from "./event.js";
import { FEATURES, featureSchema, isKnownFeature } from "./feature.js";
import { CARE_CIRCLE_ROLES, careCircleRoleSchema, isKnownCareCircleRole } from "./care-circle.js";
import {
  NOTIFICATION_ROUTES,
  notificationRouteSchema,
  isKnownNotificationRoute
} from "./notification.js";
import { WORKFLOWS, workflowSchema } from "./workflow.js";

/**
 * Cross-registry validation (roadmap M8.3a; extended M8.3b). Parses every entry against
 * its schema and enforces referential integrity ACROSS registries. This is what lets
 * the Platform Registry Layer eventually be edited by an administrator through a
 * platform builder: any change — developer or admin — that breaks a reference fails the
 * validation gate rather than silently producing an incoherent surface.
 *
 * Forward references to registries that land in later phases (persona/workspace →
 * dashboards / navigation / search / reports / onboarding / homepage / experience;
 * notification/workflow → content templates) are intentionally NOT validated yet — each
 * is enabled as its target registry lands.
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
  }

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

  // 5. Coherence: workspace personas apply to the workspace kind.
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
