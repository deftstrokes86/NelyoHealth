import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing (patient-web sign-in/sign-up).
 *
 * Uses Node's built-in scrypt (no new native dependency, no bcrypt/argon2
 * binary to manage). Parameters match the algorithm tag stored alongside
 * each hash (packages/database password-credential-repository.ts), so the
 * cost factor can be bumped later without invalidating existing hashes.
 */

const SCRYPT_ALGORITHM = "scrypt-n16384-r8-p1";
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: typeof SCRYPT_OPTIONS
) => Promise<Buffer>;

export interface PasswordHash {
  hash: string;
  algorithm: string;
}

export async function hashPassword(plaintext: string): Promise<PasswordHash> {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(plaintext, salt, SCRYPT_KEY_LENGTH, SCRYPT_OPTIONS);
  return {
    hash: `${salt.toString("hex")}:${derivedKey.toString("hex")}`,
    algorithm: SCRYPT_ALGORITHM
  };
}

export async function verifyPassword(
  plaintext: string,
  stored: { hash: string; algorithm: string }
): Promise<boolean> {
  if (stored.algorithm !== SCRYPT_ALGORITHM) {
    // Unknown/rotated algorithm: fail closed rather than guess a comparison.
    return false;
  }
  const [saltHex, keyHex] = stored.hash.split(":");
  if (!saltHex || !keyHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const storedKey = Buffer.from(keyHex, "hex");
  const derivedKey = await scryptAsync(plaintext, salt, storedKey.length, SCRYPT_OPTIONS);

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}
