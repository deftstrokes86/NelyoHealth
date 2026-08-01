import type { Capability } from "./capability.js";
import { type Dashboard, type DashboardWidget, findDashboard } from "./dashboard.js";
import { type Experience, findExperience } from "./experience.js";
import {
  type NavigationItem,
  isNavigationGroup,
  navigationChildren,
  findNavigationItem
} from "./navigation.js";
import { findPersona } from "./persona.js";
import { type Report, findReport } from "./report.js";
import {
  type CompositionSubject,
  type ResolvedComposition,
  compositionHasCapability,
  resolveComposition
} from "./resolve.js";
import { type SearchScope, findSearchScope } from "./search.js";
import { type Workspace, type WorkspaceLifecycle, findWorkspace } from "./workspace.js";

/**
 * `composeSurface` — the Platform Registry Layer's composition READ (roadmap M8.3c).
 *
 * Given the workspace + persona the Context Engine already resolves, this assembles the
 * complete surface for that acting context: the navigation tree, the dashboards with
 * their widgets, the onboarding flows, the homepage sections, the experience profile,
 * and (M8.3d) the search scopes and reports — each filtered by the composition
 * capability set, the workspace's available features, and the workspace kind.
 *
 * This is the single read every VISUAL consumer uses: UI and Mobile compose from these
 * declarations rather than each re-deriving what to show, so a new organization type or
 * persona changes DATA, never rendering code. AI and Automation consume the parallel
 * `resolveToolContract` read (`consumer.ts`) over the same registries.
 *
 * Fails CLOSED throughout: an inactive composition (unknown/disabled workspace,
 * non-applicable persona) yields an empty surface, and every reference that does not
 * resolve is dropped rather than defaulted.
 *
 * INVARIANT — composition, never authorization. Everything returned here is what may be
 * OFFERED. The PDP (Authorization Platform) remains the sole authorization decision
 * point and re-decides every action at the resource door; a surface must never be
 * consulted to authorize an operation, and the absence of an item is a UX affordance,
 * not a security control.
 */

/** A navigation item with its surviving children, in declared order. */
export interface ComposedNavigationItem extends NavigationItem {
  children: ComposedNavigationItem[];
}

export interface ComposedSurface {
  workspaceId: string;
  personaId: string;
  /** The care-circle role this surface was narrowed by, when acting for another. */
  careCircleRoleId: string | null;
  /** Whether this surface was composed for the actor's own record. */
  subjectIsSelf: boolean;
  active: boolean;
  reasonCode: ResolvedComposition["reasonCode"];
  lifecycle: WorkspaceLifecycle | null;
  /** The composition capability set this surface was filtered against. */
  capabilities: Capability[];
  navigation: ComposedNavigationItem[];
  /** The persona's dashboards, widget-filtered; dashboards left empty are dropped. */
  dashboards: Dashboard[];
  /** The workspace's landing dashboard when it survived, else the first that did. */
  landingDashboard: Dashboard | null;
  /** Onboarding flows, with steps filtered to the composed capability set. */
  onboarding: Experience[];
  /** Homepage sections, in declared order. */
  homepage: Experience[];
  /** Persona preference, else the workspace default; null when neither composes. */
  experienceProfile: Experience | null;
  /** Search scopes offered to this context (M8.3d); `planned` entries never compose. */
  search: SearchScope[];
  /** Reports offered to this context (M8.3d); `planned` entries never compose. */
  reports: Report[];
}

const emptySurface = (
  workspaceId: string,
  personaId: string,
  composition: ResolvedComposition
): ComposedSurface => ({
  workspaceId,
  personaId,
  careCircleRoleId: composition.careCircleRoleId,
  subjectIsSelf: composition.subjectIsSelf,
  active: false,
  reasonCode: composition.reasonCode,
  lifecycle: composition.lifecycle,
  capabilities: [],
  navigation: [],
  dashboards: [],
  landingDashboard: null,
  onboarding: [],
  homepage: [],
  experienceProfile: null,
  search: [],
  reports: []
});

/** The three filters every composable entry passes: capability, feature, workspace kind. */
function makeFilters(workspace: Workspace, composition: ResolvedComposition) {
  const features = new Set(workspace.features);

  const capabilityOk = (capabilityId: string | null) =>
    capabilityId === null || compositionHasCapability(composition, capabilityId);
  const featureOk = (featureId: string | null) => featureId === null || features.has(featureId);
  const kindOk = (kinds: readonly string[]) => kinds.includes(workspace.kind);

  return { capabilityOk, featureOk, kindOk };
}

/**
 * Compose the full surface for a workspace + persona. The workspace-kind, capability, and
 * feature filters are applied uniformly to navigation, dashboards, and experiences.
 */
export function composeSurface(
  workspaceId: string,
  personaId: string,
  subject?: CompositionSubject
): ComposedSurface {
  const composition = resolveComposition(workspaceId, personaId, subject);
  if (!composition.active) return emptySurface(workspaceId, personaId, composition);

  // resolveComposition only reports `active` for a known workspace and persona.
  const workspace = findWorkspace(workspaceId)!;
  const persona = findPersona(personaId)!;
  const { capabilityOk, featureOk, kindOk } = makeFilters(workspace, composition);

  // --- Navigation: the persona's declared top-level items, plus surviving children.
  const composeNavigationItem = (item: NavigationItem): ComposedNavigationItem | null => {
    if (!kindOk(item.workspaceKinds)) return null;
    if (!capabilityOk(item.requiresCapability)) return null;
    if (!featureOk(item.requiresFeature)) return null;

    const children = navigationChildren(item.id)
      .map(composeNavigationItem)
      .filter((child): child is ComposedNavigationItem => child !== null);

    // A group exists only to hold children; one that opens nothing is not offered.
    if (isNavigationGroup(item) && children.length === 0) return null;

    return { ...item, children };
  };

  const navigation = persona.navigation
    .map((id) => findNavigationItem(id))
    .filter((item): item is NavigationItem => item !== undefined && item.parentId === null)
    .map(composeNavigationItem)
    .filter((item): item is ComposedNavigationItem => item !== null)
    .sort((a, b) => a.order - b.order);

  // --- Dashboards: widget-level filtering; an emptied dashboard is dropped.
  const composeDashboard = (dashboard: Dashboard): Dashboard | null => {
    if (!kindOk(dashboard.appliesToWorkspaceKinds)) return null;
    const widgets: DashboardWidget[] = dashboard.widgets
      .filter((widget) => capabilityOk(widget.requiresCapability))
      .filter((widget) => featureOk(widget.requiresFeature))
      .sort((a, b) => a.order - b.order);
    if (widgets.length === 0) return null;
    return { ...dashboard, widgets };
  };

  const dashboards = persona.defaultDashboards
    .map((id) => findDashboard(id))
    .filter((dashboard): dashboard is Dashboard => dashboard !== undefined)
    .map(composeDashboard)
    .filter((dashboard): dashboard is Dashboard => dashboard !== null);

  const declaredLanding = workspace.presentation.landingDashboard;
  const landingDashboard =
    dashboards.find((dashboard) => dashboard.id === declaredLanding) ?? dashboards[0] ?? null;

  // --- Experiences: onboarding flows, homepage sections, and the experience profile.
  const experienceOk = (experience: Experience) =>
    kindOk(experience.appliesToWorkspaceKinds) &&
    capabilityOk(experience.requiresCapability) &&
    featureOk(experience.requiresFeature);

  const resolveExperiences = (ids: readonly string[], kind: Experience["kind"]): Experience[] =>
    ids
      .map((id) => findExperience(id))
      .filter((experience): experience is Experience => experience?.kind === kind)
      .filter(experienceOk)
      .sort((a, b) => a.order - b.order);

  const onboarding = resolveExperiences(persona.onboardingFlows, "onboarding").map((flow) => ({
    ...flow,
    steps: flow.steps
      .filter((step) => capabilityOk(step.requiresCapability))
      .sort((a, b) => a.order - b.order)
  }));

  const homepage = resolveExperiences(persona.homepageComposition, "homepage-section");

  // --- Search & reports (M8.3d). A `planned` entry never composes: it is declared for
  // the roadmap, not offered to an actor.
  const search = persona.searchScopes
    .map((id) => findSearchScope(id))
    .filter((scope): scope is SearchScope => scope !== undefined && scope.status !== "planned")
    .filter(
      (scope) =>
        kindOk(scope.appliesToWorkspaceKinds) &&
        capabilityOk(scope.requiresCapability) &&
        featureOk(scope.requiresFeature)
    )
    .sort((a, b) => a.order - b.order);

  const reports = persona.reports
    .map((id) => findReport(id))
    .filter((report): report is Report => report !== undefined && report.status !== "planned")
    .filter(
      (report) =>
        kindOk(report.appliesToWorkspaceKinds) &&
        capabilityOk(report.requiresCapability) &&
        featureOk(report.requiresFeature)
    )
    .sort((a, b) => a.order - b.order);

  const profileId =
    persona.behavior.preferredLandingExperience || workspace.presentation.experienceProfile;
  const profile = profileId ? findExperience(profileId) : undefined;
  const experienceProfile =
    profile && profile.kind === "profile" && experienceOk(profile) ? profile : null;

  return {
    workspaceId,
    personaId,
    careCircleRoleId: composition.careCircleRoleId,
    subjectIsSelf: composition.subjectIsSelf,
    active: true,
    reasonCode: composition.reasonCode,
    lifecycle: composition.lifecycle,
    capabilities: composition.capabilities,
    navigation,
    dashboards,
    landingDashboard,
    onboarding,
    homepage,
    experienceProfile,
    search,
    reports
  };
}

/** Flatten a composed navigation tree to its routable items (depth-first, in order). */
export function surfaceRoutes(surface: ComposedSurface): string[] {
  const routes: string[] = [];
  const walk = (items: ComposedNavigationItem[]) => {
    for (const item of items) {
      if (item.route !== "") routes.push(item.route);
      walk(item.children);
    }
  };
  walk(surface.navigation);
  return routes;
}
