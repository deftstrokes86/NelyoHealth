import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import {
  createSubjectDto,
  createSurfaceDto,
  createToolContractDto,
  type ApiEnvelope,
  type SubjectsDto,
  type SurfaceDashboardDto,
  type SurfaceDto,
  type SurfaceExperienceDto,
  type SurfaceNavigationItemDto,
  type SurfaceReportDto,
  type SurfaceSearchScopeDto,
  type ToolContractDto,
  type ToolContractEntryDto
} from "@nelyohealth/api-client";
import {
  CONSUMER_SURFACES,
  type ComposedNavigationItem,
  type ComposedSurface,
  type ConsumerSurface,
  type Experience,
  type ResolvedToolContract
} from "@nelyohealth/platform-registry";
import {
  composeRuntimeSurface,
  createPgCompositionPorts,
  discoverSubjects,
  resolveRuntimeToolContract,
  type CompositionTarget
} from "../../platform-composition.js";
import { createMeta } from "../api-envelope.js";
import { Authorize } from "../authorization/authorization-metadata.js";
import type { AuthenticatedRequest } from "../authorization/authorization.guard.js";
import { projectExact } from "../../projection.js";
import { invokeTool } from "../../tool-invocation.js";
import { ResourceUnavailableException } from "./resource-http.js";
import {
  SUBJECT_CLASSIFICATION,
  SURFACE_CLASSIFICATION,
  TOOL_CONTRACT_CLASSIFICATION,
  authorizedReaderContext
} from "./dto-classification.js";
import { RESOURCE_DATABASE_POOL } from "./resource-tokens.js";

/**
 * Runtime composition HTTP surface (roadmap M8.3e).
 *
 * The platform's two composition reads, and the ONLY way a client learns what to render:
 *
 *  - `GET /api/me/surface` — navigation, dashboards, widgets, landing dashboard, homepage,
 *    onboarding, experience profile, search scopes, and reports for the caller's acting
 *    context and chosen subject.
 *  - `GET /api/me/tools`   — the Tool Registry contract for a named consumer surface (ui,
 *    mobile, ai, automation, api, offline), with withheld tools and their reasons.
 *
 * Both accept `?subject=` so a client can compose for a child, ward, patient, or sponsored
 * person; both default to the caller. The composition target is resolved once, in the
 * shared service, so the two reads cannot disagree about who is acting as what.
 *
 * INVARIANT — structure, not data. A surface says what MAY be offered; it carries no
 * clinical content and grants nothing. Every real read goes to its own endpoint and is
 * re-decided by the PDP, which is why an empty surface is a UX outcome and never a
 * security boundary.
 */
@Controller("api")
@ApiTags("surface")
export class SurfaceController {
  constructor(@Inject(RESOURCE_DATABASE_POOL) private readonly pool: Pool) {}

  @Get("me/surface")
  @Authorize()
  @ApiOperation({ summary: "Compose the caller's runtime surface for a subject" })
  @ApiQuery({
    name: "subject",
    required: false,
    description: "Person ref to compose for; defaults to the caller"
  })
  @ApiOkResponse({ description: "Composed surface envelope" })
  async mySurface(
    @Req() req: AuthenticatedRequest,
    @Query("subject") subject?: string
  ): Promise<ApiEnvelope<SurfaceDto>> {
    const actingContext = req.actingContext!;
    const { target, composed } = await composeRuntimeSurface(
      createPgCompositionPorts(this.pool),
      actingContext,
      subject ?? null
    );
    return {
      data: this.toSurfaceDto(composed, target, actingContext.activeTenantId),
      meta: this.meta(req, "api.surface.compose", target.reason),
      errors: []
    };
  }

  @Get("me/subjects")
  @Authorize()
  @ApiOperation({ summary: "List every subject the caller may currently act for" })
  @ApiOkResponse({ description: "Subjects envelope" })
  async mySubjects(@Req() req: AuthenticatedRequest): Promise<ApiEnvelope<SubjectsDto>> {
    const actingContext = req.actingContext!;
    const discovered = await discoverSubjects(createPgCompositionPorts(this.pool), actingContext);
    const context = authorizedReaderContext("api.surface.subjects");

    // The caller is always their own first subject: a client needs no special case for
    // "me" in the switcher, and no knowledge that self-composition exists.
    const self = projectExact(
      createSubjectDto({
        subjectRef: actingContext.identity.personId,
        careCircleRoleId: "self",
        relationshipType: "self",
        workspaceId: actingContext.workspaceId ?? "",
        personaId: actingContext.persona.actorRole,
        label: "Myself",
        effectiveDate: null,
        expiryDate: null
      }),
      SUBJECT_CLASSIFICATION,
      context
    );

    return {
      data: {
        subjects: [
          self,
          ...discovered.map((subject) =>
            projectExact(
              createSubjectDto({
                subjectRef: subject.subjectRef,
                careCircleRoleId: subject.careCircleRoleId,
                relationshipType: subject.relationshipType,
                workspaceId: subject.workspaceId,
                personaId: subject.personaId,
                label: subject.label,
                effectiveDate: subject.effectiveDate,
                expiryDate: subject.expiryDate
              }),
              SUBJECT_CLASSIFICATION,
              context
            )
          )
        ]
      },
      meta: this.meta(req, "api.surface.subjects", "self"),
      errors: []
    };
  }

  @Get("me/tools")
  @Authorize()
  @ApiOperation({ summary: "Resolve the caller's Tool Registry contract for a consumer" })
  @ApiQuery({
    name: "consumer",
    required: false,
    description: "ui | mobile | ai | automation | api | offline (default: ui)"
  })
  @ApiQuery({
    name: "subject",
    required: false,
    description: "Person ref to resolve for; defaults to the caller"
  })
  @ApiOkResponse({ description: "Tool contract envelope" })
  async myTools(
    @Req() req: AuthenticatedRequest,
    @Query("consumer") consumer?: string,
    @Query("subject") subject?: string
  ): Promise<ApiEnvelope<ToolContractDto>> {
    // An unrecognised consumer falls back to the most restrictive real surface rather
    // than erroring: a client asking for a surface we do not know gets `ui`, never all.
    const requested = (consumer ?? "ui") as ConsumerSurface;
    const resolvedConsumer: ConsumerSurface = CONSUMER_SURFACES.includes(requested)
      ? requested
      : "ui";

    const { target, composed } = await resolveRuntimeToolContract(
      createPgCompositionPorts(this.pool),
      req.actingContext!,
      resolvedConsumer,
      subject ?? null
    );
    return {
      data: this.toToolContractDto(composed, target),
      meta: this.meta(req, "api.surface.tools", target.reason),
      errors: []
    };
  }

  @Post("tools/:toolId/invoke")
  @Authorize()
  @ApiOperation({ summary: "Invoke a Tool Registry tool for the caller's acting context" })
  @ApiOkResponse({ description: "Tool invocation envelope" })
  async invoke(
    @Req() req: AuthenticatedRequest,
    @Param("toolId") toolId: string,
    @Body() body: { subject?: string; input?: Record<string, unknown> }
  ): Promise<ApiEnvelope<{ toolId: string; status: string; data: unknown }>> {
    const actingContext = req.actingContext!;
    // The contract is re-resolved server-side for THIS acting context and subject: a
    // client cannot widen what it may invoke by asserting a tool it was not offered.
    const { target, composed } = await resolveRuntimeToolContract(
      createPgCompositionPorts(this.pool),
      actingContext,
      "api",
      body?.subject ?? null
    );

    const result = await invokeTool({
      pool: this.pool,
      actingContext,
      toolId,
      subjectRef: target.subjectPersonRef,
      input: body?.input ?? {},
      offeredToolIds: composed.tools.map((offered) => offered.tool.id),
      command: {
        requestId: req.requestId ?? "missing-request-id",
        correlationId: req.correlationId ?? "missing-correlation-id",
        idempotencyKey: req.header("idempotency-key") ?? randomUUID()
      }
    });

    if (result.status === "input-invalid") {
      throw new BadRequestException({
        code: "tool-input-invalid",
        invalidFields: result.invalidFields ?? []
      });
    }
    // Unknown, not-offered, not-implemented, and denied all surface as the same uniform
    // unavailability, so probing cannot map the registry or another actor's capacity.
    if (result.status !== "ok") {
      throw new ResourceUnavailableException();
    }

    return {
      data: { toolId: result.toolId, status: result.status, data: result.data ?? null },
      meta: this.meta(req, `api.tools.invoke.${toolId}`, target.reason),
      errors: []
    };
  }

  // ---------- Projection to the wire contract (allowlist, field-by-field) ----------

  private toNavigationDto(item: ComposedNavigationItem): SurfaceNavigationItemDto {
    return {
      id: item.id,
      label: item.label,
      route: item.route,
      icon: item.icon,
      section: item.section,
      order: item.order,
      badgeSource: item.badgeSource,
      children: item.children.map((child) => this.toNavigationDto(child))
    };
  }

  private toExperienceDto(experience: Experience): SurfaceExperienceDto {
    return {
      id: experience.id,
      kind: experience.kind,
      label: experience.label,
      description: experience.description,
      order: experience.order,
      tone: experience.tone,
      density: experience.density,
      motion: experience.motion,
      steps: experience.steps.map((step) => ({
        id: step.id,
        label: step.label,
        description: step.description,
        optional: step.optional,
        order: step.order
      }))
    };
  }

  private toSurfaceDto(
    surface: ComposedSurface,
    target: CompositionTarget,
    organizationRef: string | null
  ): SurfaceDto {
    const dashboards: SurfaceDashboardDto[] = surface.dashboards.map((dashboard) => ({
      id: dashboard.id,
      label: dashboard.label,
      description: dashboard.description,
      layout: dashboard.layout,
      widgets: dashboard.widgets.map((widget) => ({
        id: widget.id,
        kind: widget.kind,
        title: widget.title,
        description: widget.description,
        size: widget.size,
        order: widget.order,
        tool: widget.tool
      }))
    }));
    const search: SurfaceSearchScopeDto[] = surface.search.map((scope) => ({
      id: scope.id,
      label: scope.label,
      description: scope.description,
      resource: scope.resource,
      reach: scope.reach,
      order: scope.order
    }));
    const reports: SurfaceReportDto[] = surface.reports.map((report) => ({
      id: report.id,
      label: report.label,
      description: report.description,
      kind: report.kind,
      schedule: report.schedule,
      order: report.order
    }));

    return projectExact(
      createSurfaceDto({
        workspaceId: surface.active ? surface.workspaceId : "",
        personaId: surface.active ? surface.personaId : "",
        organizationRef,
        subjectRef: target.subjectPersonRef,
        subjectIsSelf: surface.subjectIsSelf,
        careCircleRoleId: surface.careCircleRoleId,
        active: surface.active,
        // For an inactive surface the RUNTIME reason is the precise one ("this actor has
        // no declared capacity toward that subject", "this organization has no type");
        // the registry's own code would only report the sentinel workspace as unknown.
        reasonCode: surface.active ? surface.reasonCode : target.reason,
        capabilities: surface.capabilities.map((capability) => capability.id),
        navigation: surface.navigation.map((item) => this.toNavigationDto(item)),
        dashboards,
        landingDashboardId: surface.landingDashboard?.id ?? null,
        homepage: surface.homepage.map((entry) => this.toExperienceDto(entry)),
        onboarding: surface.onboarding.map((entry) => this.toExperienceDto(entry)),
        experienceProfile: surface.experienceProfile
          ? this.toExperienceDto(surface.experienceProfile)
          : null,
        search,
        reports
      }),
      SURFACE_CLASSIFICATION,
      authorizedReaderContext("api.surface.compose")
    );
  }

  private toToolContractDto(
    contract: ResolvedToolContract,
    target: CompositionTarget
  ): ToolContractDto {
    const available: ToolContractEntryDto[] = contract.tools.map((offered) => ({
      id: offered.tool.id,
      name: offered.tool.name,
      description: offered.tool.description,
      capability: offered.tool.capability,
      category: offered.tool.category,
      effect: offered.effect,
      requiresApproval: offered.requiresApproval,
      streaming: offered.streaming,
      input: offered.tool.input.map((field) => ({ ...field })),
      output: offered.tool.output.map((field) => ({ ...field }))
    }));

    return projectExact(
      createToolContractDto({
        workspaceId: contract.active ? contract.workspaceId : "",
        personaId: contract.active ? contract.personaId : "",
        consumer: contract.consumer,
        subjectRef: target.subjectPersonRef,
        subjectIsSelf: contract.subjectIsSelf,
        careCircleRoleId: contract.careCircleRoleId,
        active: contract.active,
        reasonCode: contract.active ? contract.reasonCode : target.reason,
        available,
        unavailable: contract.withheld.map((entry) => ({
          toolId: entry.toolId,
          reason: entry.reason
        }))
      }),
      TOOL_CONTRACT_CLASSIFICATION,
      authorizedReaderContext("api.surface.tools")
    );
  }

  private meta(req: AuthenticatedRequest, operationTag: string, reason: string) {
    return createMeta(
      req.requestId ?? "missing-request-id",
      req.correlationId ?? "missing-correlation-id",
      operationTag,
      reason
    );
  }
}
