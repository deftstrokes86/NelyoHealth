import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useDismissable } from "../hooks/useDismissable.js";

export interface MenuItem {
  id: string;
  label: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface MenuProps {
  trigger: (props: {
    onClick: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    "aria-controls": string;
  }) => ReactNode;
  items: MenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  className?: string;
  label?: string;
}

export const Menu = ({
  trigger,
  items,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  id,
  className = "",
  label = "Menu"
}: MenuProps) => {
  const autoId = useId();
  const menuId = id ?? `${autoId}-menu`;
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const [activeIndex, setActiveIndex] = useState(0);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const menuRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useDismissable({
    active: open,
    ref: menuRef,
    onDismiss: () => setOpen(false)
  });

  useEffect(() => {
    if (!open) return;
    const enabledIndex = items.findIndex((item) => !item.disabled);
    if (enabledIndex >= 0) {
      setActiveIndex(enabledIndex);
      itemRefs.current[enabledIndex]?.focus();
    }
  }, [open, items]);

  const moveActive = (direction: 1 | -1) => {
    const length = items.length;
    if (length === 0) return;
    let next = activeIndex;
    for (let i = 0; i < length; i++) {
      next = (next + direction + length) % length;
      if (!items[next].disabled) break;
    }
    setActiveIndex(next);
    itemRefs.current[next]?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      itemRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const last = items.length - 1;
      setActiveIndex(last);
      itemRefs.current[last]?.focus();
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const selectItem = (item: MenuItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    setOpen(false);
  };

  return (
    <span className={`nh-menu-wrapper ${className}`.trim()}>
      {trigger({
        onClick: () => setOpen(!open),
        onKeyDown: handleTriggerKeyDown,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": menuId
      })}
      {open ? (
        <ul
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-label={label}
          className="nh-menu"
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item, index) => (
            <li
              key={item.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              role="menuitem"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-disabled={item.disabled || undefined}
              className={
                "nh-menu__item" +
                (item.disabled ? " nh-menu__item--disabled" : "") +
                (index === activeIndex ? " nh-menu__item--active" : "")
              }
              onClick={() => selectItem(item)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectItem(item);
                }
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}
    </span>
  );
};
