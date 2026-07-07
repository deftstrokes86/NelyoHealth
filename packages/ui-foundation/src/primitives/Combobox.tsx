import type { InputHTMLAttributes, KeyboardEvent } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

export type ComboboxVariant = "default" | "error" | "success";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange" | "defaultValue"
  > {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: ComboboxVariant;
  emptyLabel?: string;
}

const filterOptions = (options: ComboboxOption[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return options;
  return options.filter((option) => option.label.toLowerCase().includes(normalized));
};

export const Combobox = ({
  options,
  value,
  onValueChange,
  variant = "default",
  emptyLabel = "No matches",
  disabled,
  className = "",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: ComboboxProps) => {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const listId = `${generatedId}-list`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(() => {
    if (value == null) return "";
    return options.find((option) => option.value === value)?.label ?? value;
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (value == null) return;
    const match = options.find((option) => option.value === value);
    if (match && match.label !== query) setQuery(match.label);
  }, [value, options, query]);

  const filtered = useMemo(() => filterOptions(options, query), [options, query]);

  const commit = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return;
      setQuery(option.label);
      setOpen(false);
      onValueChange?.(option.value);
    },
    [onValueChange]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, Math.max(filtered.length - 1, 0)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      if (open && filtered[activeIndex]) {
        event.preventDefault();
        commit(filtered[activeIndex]);
      }
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
    }
  };

  const activeDescendantId = open && filtered[activeIndex]
    ? `${listId}-option-${filtered[activeIndex].value}`
    : undefined;

  return (
    <div
      className={
        `nh-combobox nh-combobox--${variant}` +
        (disabled ? " nh-combobox--disabled" : "") +
        (className ? ` ${className}` : "")
      }
      data-variant={variant}
    >
      <span className="nh-input nh-combobox__control-wrap">
        <input
          {...props}
          id={inputId}
          type="text"
          role="combobox"
          className="nh-input__control"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-invalid={variant === "error" ? true : undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendantId}
          autoComplete="off"
        />
      </span>
      {open ? (
        <ul id={listId} role="listbox" className="nh-combobox__list">
          {filtered.length === 0 ? (
            <li className="nh-combobox__empty" role="presentation">
              {emptyLabel}
            </li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-option-${option.value}`}
                role="option"
                aria-selected={index === activeIndex}
                aria-disabled={option.disabled || undefined}
                className={
                  "nh-combobox__option" +
                  (index === activeIndex ? " nh-combobox__option--active" : "") +
                  (option.disabled ? " nh-combobox__option--disabled" : "")
                }
                onMouseDown={(event) => {
                  event.preventDefault();
                  commit(option);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
};

Combobox.displayName = "Combobox";
