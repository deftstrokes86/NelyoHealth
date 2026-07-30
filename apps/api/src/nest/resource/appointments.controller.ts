import { randomUUID } from "node:crypto";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  createAppointmentDto,
  createAppointmentSummaryDto,
  type ApiEnvelope,
  type AppointmentDto,
  type AppointmentPageDto,
  type BookAppointmentRequestDto,
  type BookAppointmentResultDto,
  type CancelAppointmentRequestDto,
  type CancelAppointmentResultDto,
  type RescheduleAppointmentRequestDto,
  type RescheduleAppointmentResultDto
} from "@nelyohealth/api-client";
import {
  bookAppointment,
  cancelAppointment,
  listMyAppointments,
  readAppointment,
  rescheduleAppointment,
  type AppointmentSafeContext,
  type AppointmentServiceDeps
} from "../../appointment-service.js";
import type { CommandActor } from "@nelyohealth/database";
import { createMeta } from "../api-envelope.js";
import { Authorize } from "../authorization/authorization-metadata.js";
import type { AuthenticatedRequest } from "../authorization/authorization.guard.js";
import { projectExact } from "../../projection.js";
import { buildResourceAccessContext } from "./resource-access-context.js";
import { ResourceUnavailableException, StateConflictException } from "./resource-http.js";
import { decodeTimelineCursor, encodeTimelineCursor, parseLimit } from "./timeline-cursor.js";
import {
  APPOINTMENT_CLASSIFICATION,
  APPOINTMENT_SUMMARY_CLASSIFICATION,
  authorizedReaderContext
} from "./dto-classification.js";
import { APPOINTMENT_SERVICE_DEPS } from "./resource-tokens.js";

/**
 * Appointment booking HTTP surface (roadmap M7, M5.2/M6.4 + ADR-0014). The
 * representative WRITE loop over the boundary. The subject is the authenticated
 * data subject (self booking); actor/patient/org are server-derived, never from the
 * body. Denied and not-found -> a single 404; post-authz state conflicts
 * (invalid transition, raced slot) -> 409, reachable only after authorization so the
 * state machine never leaks to an unauthorized actor.
 */
@Controller("api")
@ApiTags("appointments")
export class AppointmentsController {
  constructor(@Inject(APPOINTMENT_SERVICE_DEPS) private readonly deps: AppointmentServiceDeps) {}

  @Get("me/appointments")
  @Authorize()
  @ApiOperation({ summary: "List the authenticated data subject's own appointments" })
  @ApiOkResponse({ description: "Appointment page envelope" })
  async listMine(
    @Req() req: AuthenticatedRequest,
    @Query("limit") limit?: string,
    @Query("cursor") cursor?: string
  ): Promise<ApiEnvelope<AppointmentPageDto>> {
    const actingContext = req.actingContext!;
    const resolution = buildResourceAccessContext(actingContext, {
      subjectPatientRef: actingContext.identity.personId,
      purpose: "care-delivery"
    });
    // The keyset cursor is a generic (sortValue, id) pair; here (scheduledStart, id).
    const decoded = cursor ? decodeTimelineCursor(cursor) : undefined; // malformed -> 400
    const before = decoded
      ? { scheduledStart: decoded.occurredAt, appointmentId: decoded.entryId }
      : undefined;
    const pageLimit = parseLimit(limit);

    const outcome = await listMyAppointments(this.deps, {
      access: resolution.access,
      limit: pageLimit,
      before
    });
    if (outcome.status !== "allowed") {
      throw new ResourceUnavailableException();
    }
    const appointments = outcome.appointments.map((appointment) =>
      projectExact(
        createAppointmentSummaryDto({
          appointmentId: appointment.appointmentId,
          clinicianRef: appointment.clinicianRef,
          scheduledStart: appointment.scheduledStart,
          scheduledEnd: appointment.scheduledEnd,
          appointmentType: appointment.appointmentType,
          status: appointment.status
        }),
        APPOINTMENT_SUMMARY_CLASSIFICATION,
        authorizedReaderContext("api.appointments.list")
      )
    );
    const last = outcome.appointments[outcome.appointments.length - 1];
    const nextCursor =
      last && outcome.appointments.length === pageLimit
        ? encodeTimelineCursor({ occurredAt: last.scheduledStart, entryId: last.appointmentId })
        : null;
    return {
      data: { appointments, nextCursor },
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        "api.appointments.list",
        "self"
      ),
      errors: []
    };
  }

  @Post("appointments")
  @Authorize()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Book an appointment for the authenticated data subject" })
  @ApiOkResponse({ description: "Booking result envelope" })
  async book(
    @Req() req: AuthenticatedRequest,
    @Body() body: BookAppointmentRequestDto
  ): Promise<ApiEnvelope<BookAppointmentResultDto>> {
    const actingContext = req.actingContext!;
    const resolution = buildResourceAccessContext(actingContext, {
      subjectPatientRef: actingContext.identity.personId,
      purpose: "care-delivery"
    });
    const outcome = await bookAppointment(this.deps, {
      slotId: body.slotId,
      appointmentType: body.appointmentType,
      reasonForVisit: body.reasonForVisit,
      access: resolution.access,
      subjectPersonRef: resolution.subjectPersonRef,
      actor: this.commandActor(req),
      safeContext: this.safeContext(req, "appointment.booking.book")
    });
    if (outcome.status === "booked") {
      return this.ok(req, "api.appointments.book", {
        appointmentId: outcome.appointmentId,
        status: "booked"
      });
    }
    if (outcome.status === "slot-unavailable") {
      throw new StateConflictException("slot-unavailable");
    }
    throw new ResourceUnavailableException(); // denied | slot-not-found
  }

  @Get("appointments/:appointmentId")
  @Authorize()
  @ApiOperation({ summary: "Read one of the caller's own appointments" })
  @ApiOkResponse({ description: "Appointment envelope" })
  async read(
    @Req() req: AuthenticatedRequest,
    @Param("appointmentId") appointmentId: string
  ): Promise<ApiEnvelope<AppointmentDto>> {
    const actingContext = req.actingContext!;
    const resolution = buildResourceAccessContext(actingContext, {
      subjectPatientRef: actingContext.identity.personId,
      purpose: "care-delivery"
    });
    const outcome = await readAppointment(this.deps, {
      appointmentId,
      access: resolution.access,
      subjectPersonRef: resolution.subjectPersonRef
    });
    if (outcome.status !== "allowed") {
      throw new ResourceUnavailableException(); // denied | not-found -> uniform 404
    }
    const appointment = outcome.appointment;
    return this.ok(
      req,
      "api.appointments.read",
      projectExact(
        createAppointmentDto({
          appointmentId: appointment.appointmentId,
          patientRef: appointment.patientRef,
          clinicianRef: appointment.clinicianRef,
          organizationRef: appointment.organizationRef,
          scheduledStart: appointment.scheduledStart,
          scheduledEnd: appointment.scheduledEnd,
          appointmentType: appointment.appointmentType,
          status: appointment.status,
          reasonForVisit: appointment.reasonForVisit ?? null,
          cancellationReasonCode: appointment.cancellationReasonCode ?? null
        }),
        APPOINTMENT_CLASSIFICATION,
        authorizedReaderContext("api.appointments.read")
      )
    );
  }

  @Post("appointments/:appointmentId/reschedule")
  @Authorize()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reschedule one of the caller's own appointments" })
  @ApiOkResponse({ description: "Reschedule result envelope" })
  async reschedule(
    @Req() req: AuthenticatedRequest,
    @Param("appointmentId") appointmentId: string,
    @Body() body: RescheduleAppointmentRequestDto
  ): Promise<ApiEnvelope<RescheduleAppointmentResultDto>> {
    const resolution = buildResourceAccessContext(req.actingContext!, {
      subjectPatientRef: req.actingContext!.identity.personId,
      purpose: "care-delivery"
    });
    const outcome = await rescheduleAppointment(this.deps, {
      appointmentId,
      newSlotId: body.newSlotId,
      access: resolution.access,
      subjectPersonRef: resolution.subjectPersonRef,
      actor: this.commandActor(req),
      safeContext: this.safeContext(req, "appointment.booking.reschedule")
    });
    if (outcome.status === "rescheduled") {
      return this.ok(req, "api.appointments.reschedule", { appointmentId, status: "rescheduled" });
    }
    if (outcome.status === "slot-unavailable") {
      throw new StateConflictException("slot-unavailable");
    }
    throw new ResourceUnavailableException(); // denied | not-found | slot-not-found
  }

  @Post("appointments/:appointmentId/cancel")
  @Authorize()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cancel one of the caller's own appointments" })
  @ApiOkResponse({ description: "Cancel result envelope" })
  async cancel(
    @Req() req: AuthenticatedRequest,
    @Param("appointmentId") appointmentId: string,
    @Body() body: CancelAppointmentRequestDto
  ): Promise<ApiEnvelope<CancelAppointmentResultDto>> {
    const resolution = buildResourceAccessContext(req.actingContext!, {
      subjectPatientRef: req.actingContext!.identity.personId,
      purpose: "care-delivery"
    });
    const outcome = await cancelAppointment(this.deps, {
      appointmentId,
      cancellationReasonCode: body.cancellationReasonCode ?? "patient-request",
      access: resolution.access,
      subjectPersonRef: resolution.subjectPersonRef,
      actor: this.commandActor(req),
      safeContext: this.safeContext(req, "appointment.booking.cancel")
    });
    if (outcome.status === "cancelled") {
      return this.ok(req, "api.appointments.cancel", { appointmentId, status: "cancelled" });
    }
    if (outcome.status === "not-cancellable") {
      throw new StateConflictException("not-cancellable");
    }
    throw new ResourceUnavailableException(); // denied | not-found
  }

  private commandActor(req: AuthenticatedRequest): CommandActor {
    const actingContext = req.actingContext!;
    return {
      accountRef: actingContext.identity.accountId,
      personaKind: actingContext.persona.kind,
      actorRole: actingContext.persona.actorRole,
      tenantRef: actingContext.activeTenantId
    };
  }

  private safeContext(req: AuthenticatedRequest, operationTag: string): AppointmentSafeContext {
    return {
      requestId: req.requestId ?? "missing-request-id",
      correlationId: req.correlationId ?? "missing-correlation-id",
      idempotencyKey: req.header("idempotency-key") ?? randomUUID(),
      operationTag
    };
  }

  private ok<T>(req: AuthenticatedRequest, operationTag: string, data: T): ApiEnvelope<T> {
    return {
      data,
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        operationTag,
        "self"
      ),
      errors: []
    };
  }
}
