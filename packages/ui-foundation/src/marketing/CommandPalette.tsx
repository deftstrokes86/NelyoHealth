"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, X } from "lucide-react";
import { useContent } from "../hooks/useContent.js";
import { useDismissable } from "../hooks/useDismissable.js";
import { useFocusTrap } from "../hooks/useFocusTrap.js";

export interface CommandPaletteItem {
  id: string;
  href: string;
  title: string;
  body: string;
  group: "pages" | "faq";
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandPaletteItem[];
  placeholderId: string;
  emptyId: string;
  dialogLabelId: string;
  pagesGroupLabelId: string;
  faqGroupLabelId: string;
  className?: string;
}

export const CommandPalette = ({
  open,
  onOpenChange,
  items,
  placeholderId,
  emptyId,
  dialogLabelId,
  pagesGroupLabelId,
  faqGroupLabelId,
  className = ""
}: CommandPaletteProps) => {
  const placeholder = useContent(placeholderId);
  const emptyMessage = useContent(emptyId);
  const dialogLabel = useContent(dialogLabelId);
  const pagesLabel = useContent(pagesGroupLabelId);
  const faqLabel = useContent(faqGroupLabelId);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useFocusTrap(panelRef, open);
  useDismissable({
    active: open,
    ref: panelRef,
    onDismiss: () => onOpenChange(false)
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isCmdK) return;
      event.preventDefault();
      onOpenChange(!open);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const timer = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(timer);
  }, [open]);

  const needle = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!needle) return items;
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.body.toLowerCase().includes(needle)
    );
  }, [items, needle]);

  useEffect(() => {
    setActiveIndex(0);
  }, [needle]);

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(matches.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      const active = matches[activeIndex];
      if (active) window.location.href = active.href;
    }
  };

  const pagesMatches = matches.filter((item) => item.group === "pages");
  const faqMatches = matches.filter((item) => item.group === "faq");

  return (
    <AnimatePresence>
      {open ? (
        <div className={`nh-command-palette-root ${className}`.trim()}>
          <motion.div
            className="nh-command-palette__backdrop"
            aria-hidden="true"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.15 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={dialogLabel.title}
            className="nh-command-palette"
            initial={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : -16,
              scale: prefersReducedMotion ? 1 : 0.98
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : -12,
              scale: prefersReducedMotion ? 1 : 0.99
            }}
            transition={{
              duration: prefersReducedMotion ? 0.08 : 0.2,
              ease: [0.2, 0.8, 0.2, 1]
            }}
          >
            <div className="nh-command-palette__search">
              <Search size={18} strokeWidth={1.9} aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={placeholder.title}
                className="nh-command-palette__input"
                aria-label={placeholder.title}
                aria-activedescendant={
                  matches[activeIndex] ? `nh-cp-${matches[activeIndex].id}` : undefined
                }
                role="combobox"
                aria-expanded={matches.length > 0}
                aria-controls="nh-command-palette-results"
                autoComplete="off"
              />
              <button
                type="button"
                className="nh-command-palette__close"
                onClick={() => onOpenChange(false)}
                aria-label="Close search"
              >
                <X size={18} strokeWidth={1.9} aria-hidden="true" />
              </button>
            </div>
            <div
              id="nh-command-palette-results"
              className="nh-command-palette__results"
              role="listbox"
            >
              {matches.length === 0 ? (
                <p className="nh-command-palette__empty">{emptyMessage.title}</p>
              ) : (
                <>
                  {pagesMatches.length > 0 ? (
                    <CommandPaletteGroup
                      label={pagesLabel.title}
                      items={pagesMatches}
                      allMatches={matches}
                      activeIndex={activeIndex}
                    />
                  ) : null}
                  {faqMatches.length > 0 ? (
                    <CommandPaletteGroup
                      label={faqLabel.title}
                      items={faqMatches}
                      allMatches={matches}
                      activeIndex={activeIndex}
                    />
                  ) : null}
                </>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

const CommandPaletteGroup = ({
  label,
  items,
  allMatches,
  activeIndex
}: {
  label: string;
  items: CommandPaletteItem[];
  allMatches: CommandPaletteItem[];
  activeIndex: number;
}) => (
  <div className="nh-command-palette__group">
    <p className="nh-command-palette__group-label">{label}</p>
    <ul className="nh-command-palette__group-list">
      {items.map((item) => {
        const globalIndex = allMatches.indexOf(item);
        const active = globalIndex === activeIndex;
        return (
          <li key={item.id}>
            <a
              id={`nh-cp-${item.id}`}
              href={item.href}
              className={
                "nh-command-palette__result" +
                (active ? " nh-command-palette__result--active" : "")
              }
              role="option"
              aria-selected={active}
            >
              <span className="nh-command-palette__result-title">{item.title}</span>
              {item.body ? (
                <span className="nh-command-palette__result-body">{item.body}</span>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);
