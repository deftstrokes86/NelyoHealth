/**
 * Appointment and Booking boundary contracts.
 * These are shared contract definitions that ensure API and client DTOs stay aligned.
 * This module re-exports the handlers and utilities for use in route composition.
 */

export { scheduleAppointmentStatus } from "./appointment-handlers.js";
export type { AppointmentScheduleInput } from "./appointment-handlers.js";
export { createBookingWithAppointment, transitionBookingStatus } from "./booking-handlers.js";
export type { BookingCreateInput, BookingCompleteInput } from "./booking-handlers.js";
export {
  handleAppointmentScheduleRoute,
  handleBookingCreateRoute,
  handleBookingTransitionRoute
} from "./appointment-booking-routes.js";
export type {
  AppointmentScheduleRouteRequest,
  BookingCreateRouteRequest,
  BookingTransitionRouteRequest
} from "./appointment-booking-routes.js";
