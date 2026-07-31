/**
 * @nelyohealth/platform-registry — the Platform Registry Layer (roadmap M8.3).
 *
 * Declarative, validated, extensible registries that are the single source of truth
 * for platform composition. M8.3a establishes the foundation: the structured
 * Capability vocabulary, the Tool Registry (the shared consumption layer for UI /
 * Mobile / AI / Automation / Integration), the Workspace Registry (with lifecycle),
 * and the Persona Registry (expanded composition). Later phases add Care Circle /
 * Workflow / Event (M8.3b), Navigation / Dashboard / Experience (M8.3c), and Search /
 * Report (M8.3d).
 *
 * Governing invariant: registries FORMALIZE what the Context Engine resolves — they do
 * not duplicate it, and they never grant authorization (the PDP remains the sole
 * authorization decision point). Everything here is data, so the layer can eventually
 * be administered through a platform builder rather than only by developers.
 */
export {
  CAPABILITIES,
  capabilityCategorySchema,
  capabilityScopeSchema,
  capabilitySchema,
  findCapability,
  isKnownCapability,
  type Capability,
  type CapabilityCategory,
  type CapabilityScope
} from "./capability.js";

export {
  TOOLS,
  toolConsumerSchema,
  toolFieldSchema,
  toolSchema,
  type Tool,
  type ToolConsumer,
  type ToolField
} from "./tool.js";

export {
  WORKSPACES,
  enablementStateSchema,
  findWorkspace,
  isKnownWorkspace,
  lifecycleStatusSchema,
  workspaceKindSchema,
  workspaceLifecycleSchema,
  workspaceSchema,
  type Workspace,
  type WorkspaceKind,
  type WorkspaceLifecycle
} from "./workspace.js";

export {
  PERSONAS,
  findPersona,
  interactionPatternsSchema,
  isKnownPersona,
  personaSchema,
  type Persona
} from "./persona.js";

export {
  compositionHasCapability,
  resolveComposition,
  type ResolvedComposition
} from "./resolve.js";

export {
  assertPlatformRegistryValid,
  validatePlatformRegistry,
  type RegistryValidationIssue
} from "./validation.js";
