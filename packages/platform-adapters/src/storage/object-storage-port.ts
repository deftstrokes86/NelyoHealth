export type SignedUrlOperation = "upload" | "download";

export interface ObjectStorageSignedUrlRequest {
  operation: SignedUrlOperation;
  key: string;
  expiresInSeconds: number;
  contentType?: string;
}

export interface ObjectStorageSignedUrlGrant {
  operation: SignedUrlOperation;
  key: string;
  url: string;
  method: "PUT" | "GET";
  bucket: string;
  expiresAt: string;
  expiresInSeconds: number;
}

export interface ObjectStorageCleanupResult {
  prefix: string;
  cleanedKeys: string[];
  cleanedCount: number;
  remoteDeleteAttempted: boolean;
}

export interface ObjectStoragePort {
  createSignedUrl(request: ObjectStorageSignedUrlRequest): Promise<ObjectStorageSignedUrlGrant>;
  cleanupSyntheticObjects(prefix: string): Promise<ObjectStorageCleanupResult>;
}

export function assertSafeSyntheticStorageKey(key: string): void {
  if (!key.startsWith("synthetic/")) {
    throw new Error("Object-storage keys must use the synthetic/ prefix in lower environments.");
  }

  const forbiddenFragments = [
    "phi",
    "clinical",
    "provider",
    "payment",
    "secret",
    "token",
    "password"
  ] as const;

  const normalized = key.toLowerCase();
  for (const fragment of forbiddenFragments) {
    if (normalized.includes(fragment)) {
      throw new Error(`Storage key '${key}' violates synthetic privacy constraints.`);
    }
  }
}

export function assertSignedUrlExpiry(expiresInSeconds: number): void {
  if (!Number.isInteger(expiresInSeconds) || expiresInSeconds < 30 || expiresInSeconds > 3600) {
    throw new Error("Signed URL expiry must be an integer between 30 and 3600 seconds.");
  }
}
