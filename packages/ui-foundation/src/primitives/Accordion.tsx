import type { ReactNode } from "react";
import { useCallback, useId, useState } from "react";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onChange?: (openIds: string[]) => void;
  className?: string;
  id?: string;
}

export const Accordion = ({
  items,
  type = "single",
  value,
  defaultValue = [],
  onChange,
  className = "",
  id
}: AccordionProps) => {
  const autoId = useId();
  const baseId = id ?? autoId;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const openIds = isControlled ? value : internal;

  const setOpenIds = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const toggle = (itemId: string, disabled?: boolean) => {
    if (disabled) return;
    if (openIds.includes(itemId)) {
      setOpenIds(openIds.filter((current) => current !== itemId));
      return;
    }
    setOpenIds(type === "single" ? [itemId] : [...openIds, itemId]);
  };

  return (
    <div className={`nh-accordion ${className}`.trim()} data-type={type}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div
            key={item.id}
            className={
              "nh-accordion__item" +
              (isOpen ? " nh-accordion__item--open" : "") +
              (item.disabled ? " nh-accordion__item--disabled" : "")
            }
          >
            <h3 className="nh-accordion__heading">
              <button
                type="button"
                id={triggerId}
                className="nh-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                onClick={() => toggle(item.id, item.disabled)}
              >
                <span className="nh-accordion__title">{item.title}</span>
                <span className="nh-accordion__chevron" aria-hidden="true">
                  <svg viewBox="0 0 12 8" width="12" height="8">
                    <path
                      d="M1 1l5 5 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="nh-accordion__panel"
            >
              {isOpen ? item.content : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
