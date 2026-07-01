import { describe, expect, it } from "vitest";
import {
  S3SignedUrlObjectStorageAdapter,
  assertSafeSyntheticStorageKey,
  assertSignedUrlExpiry
} from "../../packages/platform-adapters/src/index.js";

describe("object-storage signed URL adapter", () => {
  it("issues signed upload and download URLs with expiry", async () => {
    const adapter = new S3SignedUrlObjectStorageAdapter({
      endpoint: "http://127.0.0.1:55000",
      region: "us-east-1",
      bucket: "nelyohealth-synthetic",
      accessKeyId: "local",
      secretAccessKey: "local",
      defaultExpirySeconds: 300,
      performRemoteCleanup: false
    });

    const upload = await adapter.createSignedUrl({
      operation: "upload",
      key: "synthetic/documents/iss009-a/source.bin",
      contentType: "application/octet-stream",
      expiresInSeconds: 300
    });

    const download = await adapter.createSignedUrl({
      operation: "download",
      key: "synthetic/documents/iss009-a/source.bin",
      expiresInSeconds: 120
    });

    expect(upload.method).toBe("PUT");
    expect(upload.url).toContain("X-Amz-Expires=300");
    expect(upload.url).toContain("X-Amz-Signature=");
    expect(download.method).toBe("GET");
    expect(download.url).toContain("X-Amz-Expires=120");
    expect(download.expiresInSeconds).toBe(120);
  });

  it("cleans up tracked synthetic keys without remote delete by default", async () => {
    const adapter = new S3SignedUrlObjectStorageAdapter({
      endpoint: "http://127.0.0.1:55000",
      region: "us-east-1",
      bucket: "nelyohealth-synthetic",
      accessKeyId: "local",
      secretAccessKey: "local",
      defaultExpirySeconds: 300,
      performRemoteCleanup: false
    });

    await adapter.createSignedUrl({
      operation: "upload",
      key: "synthetic/documents/iss009-cleanup/source.bin",
      expiresInSeconds: 300
    });

    const cleanup = await adapter.cleanupSyntheticObjects("synthetic/documents/iss009-cleanup");
    expect(cleanup.cleanedCount).toBe(1);
    expect(cleanup.remoteDeleteAttempted).toBe(false);
  });

  it("enforces synthetic-safe keys and expiry window", () => {
    expect(() =>
      assertSafeSyntheticStorageKey("synthetic/documents/safe-key/source.bin")
    ).not.toThrow();
    expect(() => assertSafeSyntheticStorageKey("prod/documents/unsafe")).toThrow(/synthetic\//);
    expect(() => assertSignedUrlExpiry(10)).toThrow(/between 30 and 3600/);
  });
});
