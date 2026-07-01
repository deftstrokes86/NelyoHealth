import {
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  assertSafeSyntheticStorageKey,
  assertSignedUrlExpiry,
  type ObjectStorageCleanupResult,
  type ObjectStoragePort,
  type ObjectStorageSignedUrlGrant,
  type ObjectStorageSignedUrlRequest
} from "./object-storage-port.js";

export interface S3SignedUrlAdapterConfig {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  defaultExpirySeconds: number;
  performRemoteCleanup: boolean;
}

export class S3SignedUrlObjectStorageAdapter implements ObjectStoragePort {
  private readonly client: S3Client;
  private readonly issuedSyntheticKeys = new Set<string>();

  constructor(private readonly config: S3SignedUrlAdapterConfig) {
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      }
    });
  }

  async createSignedUrl(
    request: ObjectStorageSignedUrlRequest
  ): Promise<ObjectStorageSignedUrlGrant> {
    const expiresInSeconds = request.expiresInSeconds || this.config.defaultExpirySeconds;
    assertSignedUrlExpiry(expiresInSeconds);
    assertSafeSyntheticStorageKey(request.key);

    if (request.operation === "upload") {
      const uploadCommand = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: request.key,
        ContentType: request.contentType ?? "application/octet-stream"
      });

      const url = await getSignedUrl(this.client, uploadCommand, {
        expiresIn: expiresInSeconds
      });

      this.issuedSyntheticKeys.add(request.key);
      return buildGrant("upload", request.key, this.config.bucket, expiresInSeconds, url);
    }

    const downloadCommand = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: request.key
    });

    const url = await getSignedUrl(this.client, downloadCommand, {
      expiresIn: expiresInSeconds
    });

    this.issuedSyntheticKeys.add(request.key);
    return buildGrant("download", request.key, this.config.bucket, expiresInSeconds, url);
  }

  async cleanupSyntheticObjects(prefix: string): Promise<ObjectStorageCleanupResult> {
    const safePrefix = prefix.startsWith("synthetic/") ? prefix : `synthetic/${prefix}`;
    const keys = [...this.issuedSyntheticKeys].filter((key) => key.startsWith(safePrefix));

    if (keys.length === 0) {
      return {
        prefix: safePrefix,
        cleanedKeys: [],
        cleanedCount: 0,
        remoteDeleteAttempted: false
      };
    }

    let remoteDeleteAttempted = false;
    if (this.config.performRemoteCleanup) {
      remoteDeleteAttempted = true;
      await this.client.send(
        new DeleteObjectsCommand({
          Bucket: this.config.bucket,
          Delete: {
            Objects: keys.map((key) => ({ Key: key }))
          }
        })
      );
    }

    for (const key of keys) {
      this.issuedSyntheticKeys.delete(key);
    }

    return {
      prefix: safePrefix,
      cleanedKeys: keys,
      cleanedCount: keys.length,
      remoteDeleteAttempted
    };
  }
}

function buildGrant(
  operation: "upload" | "download",
  key: string,
  bucket: string,
  expiresInSeconds: number,
  url: string
): ObjectStorageSignedUrlGrant {
  return {
    operation,
    key,
    url,
    method: operation === "upload" ? "PUT" : "GET",
    bucket,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
    expiresInSeconds
  };
}
