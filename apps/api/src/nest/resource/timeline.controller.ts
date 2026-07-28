import { Controller, Get, Inject, Param, Query, Req } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  createTimelineEntryDto,
  type ApiEnvelope,
  type TimelinePageDto
} from "@nelyohealth/api-client";
import { readPatientTimeline, type TimelineServiceDeps } from "../../timeline-service.js";
import { createMeta } from "../api-envelope.js";
import { Authorize } from "../authorization/authorization-metadata.js";
import type { AuthenticatedRequest } from "../authorization/authorization.guard.js";
import { buildResourceAccessContext } from "./resource-access-context.js";
import { ResourceUnavailableException } from "./resource-http.js";
import { decodeTimelineCursor, encodeTimelineCursor, parseLimit } from "./timeline-cursor.js";
import { TIMELINE_SERVICE_DEPS } from "./resource-tokens.js";

/**
 * Timeline HTTP surface (roadmap M7, ADR-0013 + ADR-0014). `/me/timeline` is the
 * primary surface — the subject is server-resolved, never a client-supplied ref.
 * `/patients/:patientRef/timeline` serves the same read for a resolved subject
 * (self when the ref equals the caller's own identity; otherwise the composed
 * pipeline decides). Denied and not-found both resolve to a single 404.
 */
@Controller("api")
@ApiTags("timeline")
export class TimelineController {
  constructor(@Inject(TIMELINE_SERVICE_DEPS) private readonly deps: TimelineServiceDeps) {}

  @Get("me/timeline")
  @Authorize()
  @ApiOperation({ summary: "Read the authenticated data subject's own timeline" })
  @ApiOkResponse({ description: "Timeline page envelope" })
  myTimeline(
    @Req() req: AuthenticatedRequest,
    @Query("limit") limit?: string,
    @Query("cursor") cursor?: string
  ): Promise<ApiEnvelope<TimelinePageDto>> {
    return this.read(req, req.actingContext!.identity.personId, limit, cursor);
  }

  @Get("patients/:patientRef/timeline")
  @Authorize()
  @ApiOperation({ summary: "Read a patient's timeline (self or delegated)" })
  @ApiOkResponse({ description: "Timeline page envelope" })
  patientTimeline(
    @Req() req: AuthenticatedRequest,
    @Param("patientRef") patientRef: string,
    @Query("limit") limit?: string,
    @Query("cursor") cursor?: string
  ): Promise<ApiEnvelope<TimelinePageDto>> {
    return this.read(req, patientRef, limit, cursor);
  }

  private async read(
    req: AuthenticatedRequest,
    subjectPatientRef: string,
    limit: string | undefined,
    cursor: string | undefined
  ): Promise<ApiEnvelope<TimelinePageDto>> {
    const resolution = buildResourceAccessContext(req.actingContext!, {
      subjectPatientRef,
      purpose: "care-coordination"
    });
    const before = cursor ? decodeTimelineCursor(cursor) : undefined; // malformed -> 400
    const pageLimit = parseLimit(limit);

    const outcome = await readPatientTimeline(this.deps, {
      access: resolution.access,
      subjectIsSelf: resolution.subjectIsSelf,
      limit: pageLimit,
      before
    });
    if (outcome.status !== "allowed") {
      throw new ResourceUnavailableException();
    }

    const entries = outcome.entries.map((entry) =>
      createTimelineEntryDto({
        entryId: entry.entryId,
        resourceDomain: entry.resourceDomain,
        entryType: entry.entryType,
        aggregateRef: entry.aggregateRef,
        occurredAt: entry.occurredAt
      })
    );
    const last = outcome.entries[outcome.entries.length - 1];
    const nextCursor =
      last && outcome.entries.length === pageLimit
        ? encodeTimelineCursor({ occurredAt: last.occurredAt, entryId: last.entryId })
        : null;

    return {
      data: { entries, nextCursor },
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        "api.timeline.read",
        resolution.subjectIsSelf ? "self" : "delegated"
      ),
      errors: []
    };
  }
}
