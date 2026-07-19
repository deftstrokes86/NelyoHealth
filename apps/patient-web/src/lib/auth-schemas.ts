import { z } from "zod";

/**
 * Client-side validation schemas for sign-in / sign-up (patient-web).
 *
 * These mirror but do not replace the server's own validation
 * (apps/api/src/identity-registration-service.ts) — the server is always
 * the source of truth; these exist for immediate, friendly inline feedback.
 */

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  rememberMe: z.boolean().default(false)
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name."),
    email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Re-enter your password."),
    termsAccepted: z
      .boolean()
      .refine((value) => value, "You must agree to the Terms of Use and Privacy Policy.")
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"]
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  level: PasswordStrengthLevel;
}

const STRENGTH_LEVELS: PasswordStrengthLevel[] = ["weak", "weak", "fair", "good", "strong"];

/**
 * Deterministic length + character-class heuristic (no external scoring
 * library). Good enough for a real-time hint, not a security control — the
 * server enforces only a minimum length.
 */
export function estimatePasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, level: "weak" };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const clamped = Math.min(4, score) as PasswordStrength["score"];
  return { score: clamped, level: STRENGTH_LEVELS[clamped] };
}
