import { CAPABILITIES, capabilitySchema, isKnownCapability } from "./capability.js";
import { TOOLS, toolSchema } from "./tool.js";
import { WORKSPACES, workspaceSchema } from "./workspace.js";
import { PERSONAS, personaSchema, isKnownPersona } from "./persona.js";

/**
 * Cross-registry validation (roadmap M8.3a). Parses every entry against its schema and
 * enforces referential integrity ACROSS registries. This is what lets the Platform
 * Registry Layer eventually be edited by an administrator through a platform builder:
 * any change — by a developer or a future admin — that breaks a reference fails the
 * validation gate rather than silently producing an incoherent surface.
 *
 * Forward references to registries that land in later phases (persona dashboards /
 * navigation / search / reports / onboarding / homepage) are intentionally NOT
 * validated here yet — those checks are added as each target registry lands.
 */
export interface RegistryValidationIssue {
  registry: string;
  entryId: string;
  message: string;
}

export function validatePlatformRegistry(): RegistryValidationIssue[] {
  const issues: RegistryValidationIssue[] = [];

  // 1. Schema parse (throws on structural violation — surfaced as an issue).
  const parseAll = <T>(
    registry: string,
    entries: readonly unknown[],
    schema: { parse: (v: unknown) => T }
  ) => {
    for (const entry of entries) {
      try {
        schema.parse(entry);
      } catch (error) {
        issues.push({
          registry,
          entryId: (entry as { id?: string })?.id ?? "<unknown>",
          message: `schema: ${(error as Error).message}`
        });
      }
    }
  };
  parseAll("capability", CAPABILITIES, capabilitySchema);
  parseAll("tool", TOOLS, toolSchema);
  parseAll("workspace", WORKSPACES, workspaceSchema);
  parseAll("persona", PERSONAS, personaSchema);

  // 2. Unique ids within each registry.
  const assertUnique = (registry: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) issues.push({ registry, entryId: id, message: "duplicate id" });
      seen.add(id);
    }
  };
  assertUnique(
    "capability",
    CAPABILITIES.map((entry) => entry.id)
  );
  assertUnique(
    "tool",
    TOOLS.map((entry) => entry.id)
  );
  assertUnique(
    "workspace",
    WORKSPACES.map((entry) => entry.id)
  );
  assertUnique(
    "persona",
    PERSONAS.map((entry) => entry.id)
  );

  // 3. Referential integrity across the live registries.
  for (const tool of TOOLS) {
    if (!isKnownCapability(tool.capability)) {
      issues.push({
        registry: "tool",
        entryId: tool.id,
        message: `unknown capability '${tool.capability}'`
      });
    }
  }
  for (const workspace of WORKSPACES) {
    for (const capabilityId of workspace.capabilities) {
      if (!isKnownCapability(capabilityId)) {
        issues.push({
          registry: "workspace",
          entryId: workspace.id,
          message: `unknown capability '${capabilityId}'`
        });
      }
    }
    for (const personaId of workspace.personas) {
      if (!isKnownPersona(personaId)) {
        issues.push({
          registry: "workspace",
          entryId: workspace.id,
          message: `unknown persona '${personaId}'`
        });
      }
    }
  }
  for (const persona of PERSONAS) {
    for (const capabilityId of persona.capabilities) {
      if (!isKnownCapability(capabilityId)) {
        issues.push({
          registry: "persona",
          entryId: persona.id,
          message: `unknown capability '${capabilityId}'`
        });
      }
    }
    for (const capabilityId of persona.interactionPatterns.primaryActions) {
      if (!isKnownCapability(capabilityId)) {
        issues.push({
          registry: "persona",
          entryId: persona.id,
          message: `primaryAction references unknown capability '${capabilityId}'`
        });
      }
    }
  }

  // 4. Coherence: every persona a workspace lists must apply to that workspace's kind.
  for (const workspace of WORKSPACES) {
    for (const personaId of workspace.personas) {
      const persona = PERSONAS.find((entry) => entry.id === personaId);
      if (persona && !persona.appliesToWorkspaceKinds.includes(workspace.kind)) {
        issues.push({
          registry: "workspace",
          entryId: workspace.id,
          message: `persona '${personaId}' does not apply to workspace kind '${workspace.kind}'`
        });
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
