import type { ReactNode, SelectHTMLAttributes } from "react";
import { forwardRef } from "react";

export type SelectVariant = "default" | "error" | "success";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
  placeholder?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { variant = "default", placeholder, children, className = "", disabled, ...props },
    ref
  ) => (
    <span
      className={
        `nh-select nh-select--${variant}` +
        (disabled ? " nh-select--disabled" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
    >
      <select
        ref={ref}
        className="nh-select__control"
        disabled={disabled}
        aria-invalid={variant === "error" ? true : undefined}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <span className="nh-select__chevron" aria-hidden="true">
        <svg viewBox="0 0 12 8" width="12" height="8">
          <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </span>
  )
);

Select.displayName = "Select";
