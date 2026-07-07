import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

export type TextareaVariant = "default" | "error" | "success";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = "default", className = "", disabled, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      className={
        `nh-textarea nh-textarea--${variant}` +
        (disabled ? " nh-textarea--disabled" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
      disabled={disabled}
      rows={rows}
      aria-invalid={variant === "error" ? true : undefined}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
