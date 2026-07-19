import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password-hashing.js";

describe("password hashing", () => {
  it("verifies the correct password", async () => {
    const stored = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", stored)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const stored = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("wrong password", stored)).toBe(false);
  });

  it("never stores the plaintext password in the hash", async () => {
    const stored = await hashPassword("correct horse battery staple");
    expect(stored.hash).not.toContain("correct horse battery staple");
  });

  it("produces a different hash for the same password each time (unique salt)", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a.hash).not.toBe(b.hash);
    expect(await verifyPassword("same-password", a)).toBe(true);
    expect(await verifyPassword("same-password", b)).toBe(true);
  });

  it("fails closed on an unrecognized algorithm tag", async () => {
    const stored = await hashPassword("whatever");
    const rotated = { ...stored, algorithm: "bcrypt-future" };
    expect(await verifyPassword("whatever", rotated)).toBe(false);
  });

  it("fails closed on a malformed stored hash", async () => {
    expect(
      await verifyPassword("whatever", {
        hash: "not-a-valid-format",
        algorithm: "scrypt-n16384-r8-p1"
      })
    ).toBe(false);
  });
});
