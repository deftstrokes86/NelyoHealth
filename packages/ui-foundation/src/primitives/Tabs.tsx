"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export interface TabDefinition {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabDefinition[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  id?: string;
}

export const Tabs = ({
  tabs,
  value,
  defaultValue,
  onChange,
  label,
  orientation = "horizontal",
  className = "",
  id
}: TabsProps) => {
  const autoId = useId();
  const listId = id ?? `${autoId}-tabs`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? tabs.find((tab) => !tab.disabled)?.id ?? tabs[0]?.id ?? ""
  );
  const selected = isControlled ? value : internalValue;

  const setSelected = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!tabs.find((tab) => tab.id === selected) && tabs.length > 0) {
      const fallback = tabs.find((tab) => !tab.disabled)?.id;
      if (fallback) setSelected(fallback);
    }
  }, [selected, tabs, setSelected]);

  const selectedIndex = tabs.findIndex((tab) => tab.id === selected);

  const moveTo = (index: number) => {
    const tab = tabs[index];
    if (!tab || tab.disabled) return;
    setSelected(tab.id);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const isHorizontal = orientation === "horizontal";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const length = tabs.length;
    const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;

    if (event.key === nextKey) {
      event.preventDefault();
      for (let i = 1; i <= length; i++) {
        const next = (currentIndex + i) % length;
        if (!tabs[next].disabled) {
          moveTo(next);
          break;
        }
      }
    } else if (event.key === prevKey) {
      event.preventDefault();
      for (let i = 1; i <= length; i++) {
        const next = (currentIndex - i + length) % length;
        if (!tabs[next].disabled) {
          moveTo(next);
          break;
        }
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      const first = tabs.findIndex((tab) => !tab.disabled);
      if (first >= 0) moveTo(first);
    } else if (event.key === "End") {
      event.preventDefault();
      for (let i = length - 1; i >= 0; i--) {
        if (!tabs[i].disabled) {
          moveTo(i);
          break;
        }
      }
    }
  };

  return (
    <div className={`nh-tabs nh-tabs--${orientation} ${className}`.trim()}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        className="nh-tabs__list"
        id={listId}
      >
        {tabs.map((tab, index) => {
          const isSelected = tab.id === selected;
          const panelId = `${listId}-panel-${tab.id}`;
          const tabId = `${listId}-tab-${tab.id}`;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isSelected}
              aria-controls={panelId}
              aria-disabled={tab.disabled || undefined}
              tabIndex={isSelected ? 0 : -1}
              disabled={tab.disabled}
              className={
                "nh-tabs__tab" +
                (isSelected ? " nh-tabs__tab--selected" : "") +
                (tab.disabled ? " nh-tabs__tab--disabled" : "")
              }
              onClick={() => moveTo(index)}
              onKeyDown={handleKeyDown}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => {
        const panelId = `${listId}-panel-${tab.id}`;
        const tabId = `${listId}-tab-${tab.id}`;
        const isSelected = tab.id === selected;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={!isSelected}
            className="nh-tabs__panel"
          >
            {isSelected ? tab.content : null}
          </div>
        );
      })}
    </div>
  );
};
