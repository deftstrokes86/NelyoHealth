import { describe, expect, it } from "vitest";
import { estimatePasswordStrength, signInSchema, signUpSchema } from "./auth-schemas";

describe("signInSchema", () => {
  it("accepts a valid email and non-empty password", () => {
    const result = signInSchema.safeParse({ email: "amina@example.test", password: "anything" });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = signInSchema.safeParse({ email: "not-an-email", password: "anything" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = signInSchema.safeParse({ email: "amina@example.test", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("signUpSchema", () => {
  const valid = {
    fullName: "Amina Okafor",
    email: "amina@example.test",
    password: "correct horse battery staple",
    confirmPassword: "correct horse battery staple",
    termsAccepted: true
  };

  it("accepts fully valid input", () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a full name under two characters", () => {
    expect(signUpSchema.safeParse({ ...valid, fullName: "A" }).success).toBe(false);
  });

  it("rejects a password under 8 characters", () => {
    expect(signUpSchema.safeParse({ ...valid, password: "short1", confirmPassword: "short1" }).success).toBe(
      false
    );
  });

  it("rejects mismatched passwords with an error on confirmPassword", () => {
    const result = signUpSchema.safeParse({ ...valid, confirmPassword: "different password" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword?.[0]).toBe("Passwords don't match.");
    }
  });

  it("rejects when terms are not accepted", () => {
    expect(signUpSchema.safeParse({ ...valid, termsAccepted: false }).success).toBe(false);
  });
});

describe("estimatePasswordStrength", () => {
  it("scores an empty password as weak", () => {
    expect(estimatePasswordStrength("")).toEqual({ score: 0, level: "weak" });
  });

  it("scores a short, single-case password as weak", () => {
    expect(estimatePasswordStrength("short").level).toBe("weak");
  });

  it("scores a long password with mixed case, digits, and symbols as strong", () => {
    expect(estimatePasswordStrength("Correct-Horse-Battery-Staple9!").level).toBe("strong");
  });

  it("increases score monotonically as complexity increases", () => {
    const weak = estimatePasswordStrength("aaaaaaaa");
    const fair = estimatePasswordStrength("aaaaaaaa1");
    const strong = estimatePasswordStrength("Aaaaaaaa1!longenough");
    expect(fair.score).toBeGreaterThanOrEqual(weak.score);
    expect(strong.score).toBeGreaterThanOrEqual(fair.score);
  });
});
