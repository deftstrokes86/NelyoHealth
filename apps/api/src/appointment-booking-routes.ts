import { createApiEnvelope, createErrorEnvelope, type ApiEnvelope } from "./response.js";
import {
  scheduleAppointmentStatus,
  type AppointmentScheduleInput
} from "./appointment-handlers.js";
import {
  createBookingWithAppointment,
  transitionBookingStatus,
  type BookingCreateInput,
  type BookingCompleteInput
} from "./booking-handlers.js";
import type { RuntimeRouteMeta } from "./runtime-routes.js";
import type { AppointmentDraft } from "./appointments.js";
import type { BookingDraft } from "./bookings.js";

export interface AppointmentScheduleRouteRequest extends RuntimeRouteMeta {
  input: AppointmentScheduleInput;
}

export interface BookingCreateRouteRequest extends RuntimeRouteMeta {
  input: BookingCreateInput;
}

export interface BookingTransitionRouteRequest extends RuntimeRouteMeta {
  input: BookingCompleteInput & { toStatus: BookingDraft["status"] };
}

export function handleAppointmentScheduleRoute(
  request: AppointmentScheduleRouteRequest
): ApiEnvelope<AppointmentDraft> {
  try {
    const appointment = scheduleAppointmentStatus(request.input);
    return createApiEnvelope({
      data: appointment,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "appointment.schedule",
      decisionReasonTag: `to:${appointment.status}`
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Appointment scheduling failed",
      code: "APPOINTMENT_SCHEDULE_FAILED",
      operationTag: "appointment.schedule",
      decisionReasonTag: "schedule-denied"
    });
  }
}

export function handleBookingCreateRoute(
  request: BookingCreateRouteRequest
): ApiEnvelope<BookingDraft> {
  try {
    const booking = createBookingWithAppointment(request.input);
    return createApiEnvelope({
      data: booking,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "booking.create",
      decisionReasonTag: "created"
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Booking creation failed",
      code: "BOOKING_CREATE_FAILED",
      operationTag: "booking.create",
      decisionReasonTag: "create-denied"
    });
  }
}

export function handleBookingTransitionRoute(
  request: BookingTransitionRouteRequest
): ApiEnvelope<BookingDraft> {
  try {
    const booking = transitionBookingStatus(
      request.input.booking,
      request.input.toStatus,
      request.input.completedAt
    );
    return createApiEnvelope({
      data: booking,
      requestId: request.requestId,
      correlationId: request.correlationId,
      operationTag: "booking.transition",
      decisionReasonTag: `to:${booking.status}`
    });
  } catch (error) {
    return createErrorEnvelope({
      requestId: request.requestId,
      correlationId: request.correlationId,
      message: error instanceof Error ? error.message : "Booking transition failed",
      code: "BOOKING_TRANSITION_FAILED",
      operationTag: "booking.transition",
      decisionReasonTag: "transition-denied"
    });
  }
}
