"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AuthInput, type AuthInputProps } from "./AuthInput";
import { estimatePasswordStrength } from "../../lib/auth-schemas";

export interface PasswordInputProps extends Omit<AuthInputProps, "type" | "icon" | "trailing"> {
  /** Show the real-time strength meter (sign-up only, not sign-in). */
  showStrength?: boolean;
}

const STRENGTH_COPY: Record<string, { label: string; className: string }> = {
  weak: { label: "Weak", className: "bg-red-500" },
  fair: { label: "Fair", className: "bg-ds-accent-500" },
  good: { label: "Good", className: "bg-ds-brand-400" },
  strong: { label: "Strong", className: "bg-ds-brand-600" }
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, value, onChange, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const strength = estimatePasswordStrength(typeof value === "string" ? value : "");
    const strengthCopy = STRENGTH_COPY[strength.level];

    return (
      <div className="flex flex-col gap-1.5">
        <AuthInput
          {...props}
          ref={ref}
          value={value}
          onChange={onChange}
          type={visible ? "text" : "password"}
          icon={<Lock size={16} strokeWidth={1.9} aria-hidden />}
          trailingInteractive
          trailing={
            <button
              type="button"
              onClick={() => setVisible((current) => !current)}
              aria-label={visible ? "Hide password" : "Show password"}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              {visible ? (
                <EyeOff size={16} strokeWidth={1.9} aria-hidden />
              ) : (
                <Eye size={16} strokeWidth={1.9} aria-hidden />
              )}
            </button>
          }
        />
        {showStrength && typeof value === "string" && value.length > 0 ? (
          <div className="flex flex-col gap-1" aria-live="polite">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((segment) => (
                <span
                  key={segment}
                  className={`h-1 flex-1 rounded-full ${
                    segment < strength.score ? strengthCopy.className : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-caption text-muted-foreground">
              Password strength: <span className="font-semibold">{strengthCopy.label}</span>
            </p>
          </div>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
