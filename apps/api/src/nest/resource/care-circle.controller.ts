import { Controller, Get, Inject, Param, Req } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  createCareCircleMemberDto,
  createWardDto,
  type ApiEnvelope,
  type CareCircleDto,
  type WardsDto
} from "@nelyohealth/api-client";
import {
  listMyWards,
  readPatientCareCircle,
  type CareCircleServiceDeps
} from "../../care-circle-service.js";
import { createMeta } from "../api-envelope.js";
import { Authorize } from "../authorization/authorization-metadata.js";
import type { AuthenticatedRequest } from "../authorization/authorization.guard.js";
import { projectExact } from "../../projection.js";
import {
  createCapacityResolverPorts,
  resolveResourceAccessContext
} from "./resource-access-context.js";
import { ResourceUnavailableException } from "./resource-http.js";
import {
  CARE_CIRCLE_MEMBER_CLASSIFICATION,
  WARD_CLASSIFICATION,
  authorizedReaderContext
} from "./dto-classification.js";
import { CARE_CIRCLE_SERVICE_DEPS } from "./resource-tokens.js";

/**
 * Care Circle HTTP surface (roadmap M7, M6.1 + ADR-0014). A patient's circle reveals
 * their relationship graph (sensitive), so a third-party read flows through the
 * composed pipeline; the data subject reads their own via the self kind. Wards is a
 * self-scoped view of the caller's own memberships.
 */
@Controller("api")
@ApiTags("care-circle")
export class CareCircleController {
  constructor(@Inject(CARE_CIRCLE_SERVICE_DEPS) private readonly deps: CareCircleServiceDeps) {}

  @Get("me/care-circle")
  @Authorize()
  @ApiOperation({ summary: "Read the authenticated data subject's own care circle" })
  @ApiOkResponse({ description: "Care circle envelope" })
  myCareCircle(@Req() req: AuthenticatedRequest): Promise<ApiEnvelope<CareCircleDto>> {
    return this.readCircle(req, req.actingContext!.identity.personId);
  }

  @Get("patients/:patientRef/care-circle")
  @Authorize()
  @ApiOperation({ summary: "Read a patient's care circle (self or delegated)" })
  @ApiOkResponse({ description: "Care circle envelope" })
  patientCareCircle(
    @Req() req: AuthenticatedRequest,
    @Param("patientRef") patientRef: string
  ): Promise<ApiEnvelope<CareCircleDto>> {
    return this.readCircle(req, patientRef);
  }

  @Get("me/wards")
  @Authorize()
  @ApiOperation({ summary: "List the patients the caller can currently act for" })
  @ApiOkResponse({ description: "Wards envelope" })
  async myWards(@Req() req: AuthenticatedRequest): Promise<ApiEnvelope<WardsDto>> {
    const actingContext = req.actingContext!;
    // Wards are org-scoped memberships; a personal session with no active tenant has
    // none to list (returned empty rather than an unscoped query).
    const wards = actingContext.activeTenantId
      ? await listMyWards(this.deps, {
          actorRef: actingContext.identity.accountId,
          organizationRef: actingContext.activeTenantId
        })
      : [];
    return {
      data: {
        wards: wards.map((ward) =>
          projectExact(
            createWardDto({
              patientRef: ward.patientRef,
              relationshipType: ward.relationshipType,
              membershipStatus: ward.membershipStatus,
              permittedActions: ward.permittedActions,
              effectiveDate: ward.effectiveDate ?? null,
              expiryDate: ward.expiryDate ?? null
            }),
            WARD_CLASSIFICATION,
            authorizedReaderContext("api.care-circle.wards")
          )
        )
      },
      meta: this.meta(req, "api.care-circle.wards", "self"),
      errors: []
    };
  }

  private async readCircle(
    req: AuthenticatedRequest,
    subjectPatientRef: string
  ): Promise<ApiEnvelope<CareCircleDto>> {
    const resolution = await resolveResourceAccessContext(
      createCapacityResolverPorts(this.deps.pool),
      req.actingContext!,
      { subjectPatientRef, purpose: "care-coordination" }
    );
    const outcome = await readPatientCareCircle(this.deps, {
      access: resolution.access,
      subjectIsSelf: resolution.subjectIsSelf,
      delegation: resolution.selectedRelationshipRef
        ? {
            relationshipRef: resolution.selectedRelationshipRef,
            derivedActorRole: resolution.derivedActorRole ?? ""
          }
        : undefined
    });
    if (outcome.status !== "allowed") {
      throw new ResourceUnavailableException();
    }
    return {
      data: {
        members: outcome.members.map((member) =>
          projectExact(
            createCareCircleMemberDto({
              memberRef: member.relationshipRef,
              actorRef: member.actorRef,
              relationshipType: member.relationshipType,
              membershipStatus: member.membershipStatus,
              permittedActions: member.permittedActions,
              effectiveDate: member.effectiveDate ?? null,
              expiryDate: member.expiryDate ?? null
            }),
            CARE_CIRCLE_MEMBER_CLASSIFICATION,
            authorizedReaderContext("api.care-circle.read")
          )
        )
      },
      meta: this.meta(req, "api.care-circle.read", resolution.subjectIsSelf ? "self" : "delegated"),
      errors: []
    };
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
