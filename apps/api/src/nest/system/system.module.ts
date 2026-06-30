import { Module } from "@nestjs/common";
import { ReadinessService } from "./readiness.service.js";
import { SystemController } from "./system.controller.js";

@Module({
  controllers: [SystemController],
  providers: [ReadinessService]
})
export class SystemModule {}
