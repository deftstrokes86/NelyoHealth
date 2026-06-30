import { Body, Controller, Delete, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { ApiEnvelope } from "../api-envelope.js";
import { createMeta } from "../api-envelope.js";
import { StorageService } from "./storage.service.js";

interface SignedUrlRequestBody {
  syntheticDocumentId: string;
  contentType?: string;
  expiresInSeconds?: number;
}

interface CleanupRequestBody {
  syntheticDocumentIdPrefix?: string;
}

@Controller("api/storage")
@ApiTags("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("signed-url/upload")
  @ApiOperation({ summary: "Issue synthetic signed upload URL" })
  @ApiOkResponse({ description: "Signed upload URL envelope" })
  async issueUploadUrl(
    @Req() req: Request & { requestId?: string; correlationId?: string },
    @Body() body: SignedUrlRequestBody
  ): Promise<ApiEnvelope<Awaited<ReturnType<StorageService["issueUploadSignedUrl"]>>>> {
    const grant = await this.storageService.issueUploadSignedUrl(body);
    return {
      data: grant,
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        "api.storage.signed-url.upload",
        "issued"
      ),
      errors: []
    };
  }

  @Post("signed-url/download")
  @ApiOperation({ summary: "Issue synthetic signed download URL" })
  @ApiOkResponse({ description: "Signed download URL envelope" })
  async issueDownloadUrl(
    @Req() req: Request & { requestId?: string; correlationId?: string },
    @Body() body: SignedUrlRequestBody
  ): Promise<ApiEnvelope<Awaited<ReturnType<StorageService["issueDownloadSignedUrl"]>>>> {
    const grant = await this.storageService.issueDownloadSignedUrl(body);
    return {
      data: grant,
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        "api.storage.signed-url.download",
        "issued"
      ),
      errors: []
    };
  }

  @Delete("synthetic-objects")
  @ApiOperation({ summary: "Cleanup synthetic object-storage keys" })
  @ApiOkResponse({ description: "Synthetic cleanup envelope" })
  async cleanupSyntheticObjects(
    @Req() req: Request & { requestId?: string; correlationId?: string },
    @Body() body: CleanupRequestBody
  ): Promise<ApiEnvelope<Awaited<ReturnType<StorageService["cleanupSyntheticObjects"]>>>> {
    const result = await this.storageService.cleanupSyntheticObjects({
      syntheticDocumentIdPrefix: body.syntheticDocumentIdPrefix ?? ""
    });

    return {
      data: result,
      meta: createMeta(
        req.requestId ?? "missing-request-id",
        req.correlationId ?? "missing-correlation-id",
        "api.storage.synthetic.cleanup",
        "completed"
      ),
      errors: []
    };
  }
}
