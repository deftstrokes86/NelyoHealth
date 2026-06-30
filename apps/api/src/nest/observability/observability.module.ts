import { Module } from "@nestjs/common";
import { ObservabilityController } from "./observability.controller.js";
import { ObservabilityService } from "./observability.service.js";

@Module({
  controllers: [ObservabilityController],
  providers: [ObservabilityService]
})
export class ObservabilityModule {}
