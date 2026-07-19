"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { ErrorText, HelperText, Input, Label } from "@nelyohealth/ui-foundation";

export interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  /** Set true when `trailing` is an interactive control (e.g. a show/hide toggle). */
  trailingInteractive?: boolean;
  error?: string;
  hint?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    { label, icon, trailing, trailingInteractive = false, error, hint, required, ...props },
    ref
  ) => {
    const inputId = useId();
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;
    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          leading={icon}
          trailing={trailing}
          trailingAriaHidden={!trailingInteractive}
          variant={error ? "error" : "default"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          required={required}
          {...props}
        />
        {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
        {!error && hint ? <HelperText id={hintId}>{hint}</HelperText> : null}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
