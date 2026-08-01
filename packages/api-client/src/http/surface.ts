/**
 * Surface + tool-contract DTOs (roadmap M8.3e).
 *
 * The wire shape of the platform's two composition reads. These are deliberately a
 * FLATTENED, id-bearing projection of the Platform Registry's composed output: a client
 * renders from ids, labels, routes, and ordering, and never re-derives what to show.
 *
 * No clinical content crosses this boundary — a surface is structure (what may be
 * offered), not data. Every actual read still goes through its own endpoint and the PDP.
 */

export interface SurfaceNavigationItemDto {
  id: string;
  label: string;
  route: string;
  icon: string;
  section: string;
  order: number;
  badgeSource: string | null;
  children: SurfaceNavigationItemDto[];
}

export interface SurfaceWidgetDto {
  id: string;
  kind: string;
  title: string;
  description: string;
  size: string;
  order: number;
  /** Tool Registry id supplying this widget's data, when it reads any. */
  tool: string | null;
}

export interface SurfaceDashboardDto {
  id: string;
  label: string;
  description: string;
  layout: string;
  widgets: SurfaceWidgetDto[];
}

export interface SurfaceExperienceStepDto {
  id: string;
  label: string;
  description: string;
  optional: boolean;
  order: number;
}

export interface SurfaceExperienceDto {
  id: string;
  kind: string;
  label: string;
  description: string;
  order: number;
  tone: string;
  density: string;
  motion: string;
  steps: SurfaceExperienceStepDto[];
}

export interface SurfaceSearchScopeDto {
  id: string;
  label: string;
  description: string;
  resource: string;
  reach: string;
  order: number;
}

export interface SurfaceReportDto {
  id: string;
  label: string;
  description: string;
  kind: string;
  schedule: string;
  order: number;
}

export interface SurfaceDto {
  /** Workspace Registry id composed for (e.g. personal, hospital, diaspora-household). */
  workspaceId: string;
  /** Persona Registry id composed as. */
  personaId: string;
  /** Active organization, when acting inside one. */
  organizationRef: string | null;
  /** The person this surface was composed for. */
  subjectRef: string;
  subjectIsSelf: boolean;
  /** Care Circle Registry role narrowing this surface, when acting for another. */
  careCircleRoleId: string | null;
  active: boolean;
  reasonCode: string;
  /** Composition capability ids — what may be OFFERED, never an authorization grant. */
  capabilities: string[];
  navigation: SurfaceNavigationItemDto[];
  dashboards: SurfaceDashboardDto[];
  landingDashboardId: string | null;
  homepage: SurfaceExperienceDto[];
  onboarding: SurfaceExperienceDto[];
  experienceProfile: SurfaceExperienceDto | null;
  search: SurfaceSearchScopeDto[];
  reports: SurfaceReportDto[];
}

export interface ToolContractEntryDto {
  id: string;
  name: string;
  description: string;
  capability: string;
  category: string;
  effect: string;
  requiresApproval: boolean;
  streaming: boolean;
  input: { name: string; type: string; required: boolean; description: string }[];
  output: { name: string; type: string; required: boolean; description: string }[];
}

export interface WithheldToolDto {
  toolId: string;
  reason: string;
}

export interface ToolContractDto {
  workspaceId: string;
  personaId: string;
  consumer: string;
  subjectRef: string;
  subjectIsSelf: boolean;
  careCircleRoleId: string | null;
  active: boolean;
  reasonCode: string;
  /** Tools that may be OFFERED on this surface. The PDP still authorizes invocation. */
  available: ToolContractEntryDto[];
  /** Tools deliberately not offered, each with the reason. */
  unavailable: WithheldToolDto[];
}

export interface SubjectDto {
  /** Pass as `?subject=` to /api/me/surface and /api/me/tools. */
  subjectRef: string;
  careCircleRoleId: string;
  relationshipType: string;
  /** Workspace + persona this subject composes as. */
  workspaceId: string;
  personaId: string;
  label: string;
  effectiveDate: string | null;
  expiryDate: string | null;
}

export interface SubjectsDto {
  /** The caller themselves is always the first subject. */
  subjects: SubjectDto[];
}

export function createSubjectDto(fields: SubjectDto): SubjectDto {
  return {
    subjectRef: fields.subjectRef,
    careCircleRoleId: fields.careCircleRoleId,
    relationshipType: fields.relationshipType,
    workspaceId: fields.workspaceId,
    personaId: fields.personaId,
    label: fields.label,
    effectiveDate: fields.effectiveDate,
    expiryDate: fields.expiryDate
  };
}

export function createSurfaceDto(fields: SurfaceDto): SurfaceDto {
  return {
    workspaceId: fields.workspaceId,
    personaId: fields.personaId,
    organizationRef: fields.organizationRef,
    subjectRef: fields.subjectRef,
    subjectIsSelf: fields.subjectIsSelf,
    careCircleRoleId: fields.careCircleRoleId,
    active: fields.active,
    reasonCode: fields.reasonCode,
    capabilities: [...fields.capabilities],
    navigation: fields.navigation,
    dashboards: fields.dashboards,
    landingDashboardId: fields.landingDashboardId,
    homepage: fields.homepage,
    onboarding: fields.onboarding,
    experienceProfile: fields.experienceProfile,
    search: fields.search,
    reports: fields.reports
  };
}

export function createToolContractDto(fields: ToolContractDto): ToolContractDto {
  return {
    workspaceId: fields.workspaceId,
    personaId: fields.personaId,
    consumer: fields.consumer,
    subjectRef: fields.subjectRef,
    subjectIsSelf: fields.subjectIsSelf,
    careCircleRoleId: fields.careCircleRoleId,
    active: fields.active,
    reasonCode: fields.reasonCode,
    available: fields.available,
    unavailable: fields.unavailable
  };
}
