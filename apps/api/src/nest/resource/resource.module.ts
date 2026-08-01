import { Inject, Module, type OnModuleDestroy } from "@nestjs/common";
import type { Pool } from "pg";
import { createDatabasePool } from "@nelyohealth/database";
import { createPgTimelineServiceDeps } from "../../timeline-service.js";
import { createPgCareCircleServiceDeps } from "../../care-circle-service.js";
import { createPgNotificationServiceDeps } from "../../notification-service.js";
import { createPgAppointmentServiceDeps } from "../../appointment-service.js";
import { AppointmentsController } from "./appointments.controller.js";
import { CareCircleController } from "./care-circle.controller.js";
import { NotificationsController } from "./notifications.controller.js";
import { SurfaceController } from "./surface.controller.js";
import { TimelineController } from "./timeline.controller.js";
import {
  APPOINTMENT_SERVICE_DEPS,
  CARE_CIRCLE_SERVICE_DEPS,
  NOTIFICATION_SERVICE_DEPS,
  RESOURCE_DATABASE_POOL,
  TIMELINE_SERVICE_DEPS
} from "./resource-tokens.js";

/**
 * Resource HTTP module (roadmap M7): exposes the first slice of roadmap domain
 * services (timeline, care circle, notifications, appointment booking) over HTTP.
 * One lazy pool feeds every service dep (pg connects on first query). Every route
 * is protected by the global PEP guard; the controllers are thin translators over
 * the services' audited decisions (ADR-0014).
 */
@Module({
  controllers: [
    TimelineController,
    CareCircleController,
    NotificationsController,
    AppointmentsController,
    SurfaceController
  ],
  providers: [
    { provide: RESOURCE_DATABASE_POOL, useFactory: (): Pool => createDatabasePool() },
    {
      provide: TIMELINE_SERVICE_DEPS,
      useFactory: (pool: Pool) => createPgTimelineServiceDeps(pool),
      inject: [RESOURCE_DATABASE_POOL]
    },
    {
      provide: CARE_CIRCLE_SERVICE_DEPS,
      useFactory: (pool: Pool) => createPgCareCircleServiceDeps(pool),
      inject: [RESOURCE_DATABASE_POOL]
    },
    {
      provide: NOTIFICATION_SERVICE_DEPS,
      useFactory: (pool: Pool) => createPgNotificationServiceDeps(pool),
      inject: [RESOURCE_DATABASE_POOL]
    },
    {
      provide: APPOINTMENT_SERVICE_DEPS,
      useFactory: (pool: Pool) => createPgAppointmentServiceDeps(pool),
      inject: [RESOURCE_DATABASE_POOL]
    }
  ]
})
export class ResourceModule implements OnModuleDestroy {
  constructor(@Inject(RESOURCE_DATABASE_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
