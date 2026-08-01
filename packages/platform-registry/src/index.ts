/**
 * @nelyohealth/platform-registry — the Platform Registry Layer (roadmap M8.3).
 *
 * Declarative, validated, extensible registries that are the single source of truth
 * for platform composition. M8.3a establishes the foundation: the structured
 * Capability vocabulary, the Tool Registry (the shared consumption layer for UI /
 * Mobile / AI / Automation / Integration), the Workspace Registry (with lifecycle),
 * and the Persona Registry (expanded composition). M8.3b added Care Circle / Workflow /
 * Event; M8.3c added Navigation / Dashboard / Experience and `composeSurface`, the
 * composition read a visual consumer assembles a surface from; M8.3d completes the layer
 * with Search / Report / Integration and `resolveToolContract`, the AI / Automation
 * consumer contract over the same Tool Registry.
 *
 * With M8.3d the layer has no forward references left: every id on every registry
 * resolves against a live registry under the `gates:registry` CI gate.
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
  findTool,
  isKnownTool,
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
  careCircleCompositionPriority,
  careCircleRelationshipType,
  careCircleRoleSchema,
  findCareCircleRole,
  findCareCircleRoleByRelationshipType,
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
  ORGANIZATION_TYPES,
  WORKSPACES,
  enablementStateSchema,
  findOrganizationWorkspace,
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
  NAVIGATION_ITEMS,
  findNavigationItem,
  isKnownNavigationItem,
  isNavigationGroup,
  navigationChildren,
  navigationItemSchema,
  navigationSectionSchema,
  type NavigationItem,
  type NavigationSection
} from "./navigation.js";

export {
  DASHBOARDS,
  dashboardSchema,
  dashboardWidgetKindSchema,
  dashboardWidgetSchema,
  findDashboard,
  isKnownDashboard,
  type Dashboard,
  type DashboardWidget,
  type DashboardWidgetKind
} from "./dashboard.js";

export {
  EXPERIENCES,
  experienceKindSchema,
  experienceSchema,
  experienceStepSchema,
  findExperience,
  isExperienceOfKind,
  isKnownExperience,
  type Experience,
  type ExperienceKind,
  type ExperienceStep
} from "./experience.js";

export {
  compositionHasCapability,
  isWorkspaceComposable,
  resolveComposition,
  type CompositionSubject,
  type ResolvedComposition
} from "./resolve.js";

export {
  SEARCH_SCOPES,
  findSearchScope,
  isKnownSearchScope,
  searchFieldSchema,
  searchReachSchema,
  searchScopeSchema,
  type SearchField,
  type SearchReach,
  type SearchScope
} from "./search.js";

export {
  REPORTS,
  findReport,
  isKnownReport,
  reportAggregationSchema,
  reportKindSchema,
  reportSchema,
  type Report,
  type ReportAggregation,
  type ReportKind
} from "./report.js";

export {
  INTEGRATIONS,
  findIntegration,
  integrationAuthSchema,
  integrationDirectionSchema,
  integrationProtocolSchema,
  integrationSchema,
  isKnownIntegration,
  type Integration,
  type IntegrationAuth,
  type IntegrationDirection,
  type IntegrationProtocol
} from "./integration.js";

export {
  composeSurface,
  surfaceRoutes,
  type ComposedNavigationItem,
  type ComposedSurface
} from "./surface.js";

export {
  CONSUMER_SURFACES,
  contractHasTool,
  resolveToolContract,
  type ConsumerSurface,
  type OfferedTool,
  type ResolvedToolContract,
  type WithheldReason,
  type WithheldTool
} from "./consumer.js";

export {
  assertPlatformRegistryValid,
  validatePlatformRegistry,
  type RegistryValidationIssue
} from "./validation.js";
