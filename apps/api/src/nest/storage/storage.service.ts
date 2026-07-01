import { Injectable } from "@nestjs/common";
import {
  S3SignedUrlObjectStorageAdapter,
  type ObjectStorageCleanupResult,
  type ObjectStorageSignedUrlGrant
} from "@nelyohealth/platform-adapters";

const syntheticIdPattern = /^[a-z0-9-]{3,64}$/;

interface StorageSignedUrlInput {
  syntheticDocumentId: string;
  contentType?: string;
  expiresInSeconds?: number;
}

interface CleanupInput {
  syntheticDocumentIdPrefix: string;
}

@Injectable()
export class StorageService {
  private readonly adapter = new S3SignedUrlObjectStorageAdapter({
    endpoint: process.env.NELYO_LOCAL_OBJECT_STORAGE_ENDPOINT ?? "http://127.0.0.1:55000",
    region: process.env.NELYO_LOCAL_OBJECT_STORAGE_REGION ?? "us-east-1",
    bucket: process.env.NELYO_LOCAL_OBJECT_STORAGE_BUCKET ?? "nelyohealth-synthetic",
    accessKeyId: process.env.NELYO_LOCAL_OBJECT_STORAGE_ACCESS_KEY_ID ?? "local",
    secretAccessKey: process.env.NELYO_LOCAL_OBJECT_STORAGE_SECRET_ACCESS_KEY ?? "local",
    defaultExpirySeconds: resolveSignedUrlExpiry(process.env.NELYO_LOCAL_SIGNED_URL_EXPIRY_SECONDS),
    performRemoteCleanup: process.env.NELYO_LOCAL_OBJECT_STORAGE_PERFORM_CLEANUP === "true"
  });

  async issueUploadSignedUrl(input: StorageSignedUrlInput): Promise<ObjectStorageSignedUrlGrant> {
    const syntheticDocumentId = normalizeSyntheticDocumentId(input.syntheticDocumentId);
    return this.adapter.createSignedUrl({
      operation: "upload",
      key: `synthetic/documents/${syntheticDocumentId}/source.bin`,
      contentType: input.contentType ?? "application/octet-stream",
      expiresInSeconds: resolveSignedUrlExpiry(input.expiresInSeconds)
    });
  }

  async issueDownloadSignedUrl(input: StorageSignedUrlInput): Promise<ObjectStorageSignedUrlGrant> {
    const syntheticDocumentId = normalizeSyntheticDocumentId(input.syntheticDocumentId);
    return this.adapter.createSignedUrl({
      operation: "download",
      key: `synthetic/documents/${syntheticDocumentId}/source.bin`,
      expiresInSeconds: resolveSignedUrlExpiry(input.expiresInSeconds)
    });
  }

  async cleanupSyntheticObjects(input: CleanupInput): Promise<ObjectStorageCleanupResult> {
    const prefix = normalizeSyntheticDocumentIdPrefix(input.syntheticDocumentIdPrefix);
    return this.adapter.cleanupSyntheticObjects(`synthetic/documents/${prefix}`);
  }
}

function normalizeSyntheticDocumentId(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!syntheticIdPattern.test(normalized)) {
    throw new Error(
      "syntheticDocumentId must be 3-64 characters and contain only lowercase letters, numbers, and hyphens."
    );
  }
  return normalized;
}

function normalizeSyntheticDocumentIdPrefix(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return "";
  }
  if (!/^[a-z0-9-/]{0,64}$/.test(normalized)) {
    throw new Error(
      "syntheticDocumentIdPrefix must contain only lowercase letters, numbers, hyphens, and slashes."
    );
  }
  return normalized;
}

function resolveSignedUrlExpiry(raw: unknown): number {
  if (typeof raw === "number") {
    return raw;
  }

  if (typeof raw === "string" && raw.length > 0) {
    const parsed = Number(raw);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }

  return 300;
}
