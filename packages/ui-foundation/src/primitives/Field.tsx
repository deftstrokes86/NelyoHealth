import type { InputHTMLAttributes, ReactNode } from "react";
export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
}
export const Field = ({ label, hint, id, className = "", ...props }: FieldProps) => {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label className={`nh-field ${className}`.trim()} htmlFor={fieldId}>
      <span className="nh-field__label">{label}</span>
      <input id={fieldId} className="nh-field__input" {...props} />
      {hint ? <span className="nh-field__hint">{hint}</span> : null}
    </label>
  );
};
