import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef, useId } from "react";

export type FileInputVariant = "default" | "error" | "success";

export interface FileInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: FileInputVariant;
  buttonLabel?: ReactNode;
  helperText?: ReactNode;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      variant = "default",
      buttonLabel = "Choose file",
      helperText = "No file chosen",
      className = "",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <span
        className={
          `nh-file nh-file--${variant}` +
          (disabled ? " nh-file--disabled" : "") +
          (className ? ` ${className}` : "")
        }
        data-variant={variant}
      >
        <input
          ref={ref}
          type="file"
          id={inputId}
          className="nh-file__input"
          disabled={disabled}
          aria-invalid={variant === "error" ? true : undefined}
          {...props}
        />
        <label htmlFor={inputId} className="nh-file__button">
          {buttonLabel}
        </label>
        <span className="nh-file__helper" aria-live="polite">
          {helperText}
        </span>
      </span>
    );
  }
);

FileInput.displayName = "FileInput";
