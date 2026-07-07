import type { ClipboardEvent, KeyboardEvent, ChangeEvent } from "react";
import { useCallback, useMemo, useRef } from "react";

export type OtpInputVariant = "default" | "error" | "success";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  variant?: OtpInputVariant;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  name?: string;
}

const DIGIT_PATTERN = /^\d$/;

export const OtpInput = ({
  length = 6,
  value,
  onChange,
  variant = "default",
  disabled = false,
  autoFocus = false,
  className = "",
  "aria-label": ariaLabel = "One-time passcode",
  "aria-describedby": ariaDescribedby,
  name
}: OtpInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = useMemo(() => {
    const padded = value.padEnd(length, "");
    return Array.from({ length }, (_, i) => padded[i] ?? "");
  }, [value, length]);

  const setDigit = useCallback(
    (index: number, next: string) => {
      const chars = digits.slice();
      chars[index] = next;
      onChange(chars.join(""));
    },
    [digits, onChange]
  );

  const focusAt = (index: number) => {
    const target = inputsRef.current[index];
    if (target) target.focus();
  };

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const last = raw.slice(-1);
    if (last === "") {
      setDigit(index, "");
      return;
    }
    if (!DIGIT_PATTERN.test(last)) return;
    setDigit(index, last);
    if (index < length - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        setDigit(index, "");
        return;
      }
      if (index > 0) {
        setDigit(index - 1, "");
        focusAt(index - 1);
      }
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
      event.preventDefault();
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      focusAt(index + 1);
      event.preventDefault();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (!pasted) return;
    event.preventDefault();
    const nextValue = pasted.slice(0, length);
    onChange(nextValue);
    const focusIndex = Math.min(nextValue.length, length - 1);
    focusAt(focusIndex);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      className={
        `nh-otp nh-otp--${variant}` +
        (disabled ? " nh-otp--disabled" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          className="nh-otp__cell"
          value={digit}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-invalid={variant === "error" ? true : undefined}
          aria-label={`Digit ${index + 1} of ${length}`}
          name={name ? `${name}-${index}` : undefined}
        />
      ))}
    </div>
  );
};

OtpInput.displayName = "OtpInput";
