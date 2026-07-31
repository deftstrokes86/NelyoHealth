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
  capabilityDomainSchema,
  capabilityScopeSchema,
  capabilitySchema,
  findCapability,
  isKnownCapability,
  type Capability,
  type CapabilityCategory,
  type CapabilityDomain,
  type CapabilityScope
} from "./capability.js";

export {
  TOOLS,
  toolCompatibilitySchema,
  toolFieldSchema,
  toolSchema,
  type Tool,
  type ToolCompatibility,
  type ToolField
} from "./tool.js";

export {
  EVENTS,
  dataClassificationSchema,
  deadLetterSchema,
  eventSchema,
  findEvent,
  isKnownEvent,
  retryPolicySchema,
  type PlatformEvent
} from "./event.js";

export { FEATURES, featureSchema, findFeature, isKnownFeature, type Feature } from "./feature.js";

export {
  CARE_CIRCLE_ROLES,
  careCircleCollaborationSchema,
  careCircleRoleSchema,
  findCareCircleRole,
  isKnownCareCircleRole,
  type CareCircleCollaboration,
  type CareCircleRole
} from "./care-circle.js";

export {
  NOTIFICATION_ROUTES,
  findNotificationRoute,
  isKnownNotificationRoute,
  notificationChannelSchema,
  notificationRouteSchema,
  type NotificationRoute
} from "./notification.js";

export {
  WORKFLOWS,
  findWorkflow,
  isKnownWorkflow,
  workflowSchema,
  workflowTransitionSchema,
  type Workflow,
  type WorkflowTransition
} from "./workflow.js";

export {
  WORKSPACES,
  enablementStateSchema,
  findWorkspace,
  isKnownWorkspace,
  lifecycleStatusSchema,
  workspaceKindSchema,
  workspaceLifecycleSchema,
  workspacePresentationSchema,
  workspaceSchema,
  type Workspace,
  type WorkspaceKind,
  type WorkspaceLifecycle,
  type WorkspacePresentation
} from "./workspace.js";

export {
  PERSONAS,
  findPersona,
  interactionPatternsSchema,
  isKnownPersona,
  personaBehaviorSchema,
  personaSchema,
  type Persona,
  type PersonaBehavior
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
