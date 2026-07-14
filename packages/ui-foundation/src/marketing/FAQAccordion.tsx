"use client";

import { Accordion } from "../primitives/Accordion.js";
import { useContent } from "../hooks/useContent.js";

export interface FAQItem {
  id: string;
}

export interface FAQAccordionProps {
  headingId?: string;
  items: FAQItem[];
  type?: "single" | "multiple";
  className?: string;
}

export const FAQAccordion = ({
  headingId,
  items,
  type = "single",
  className = ""
}: FAQAccordionProps) => {
  const heading = headingId ? useContent(headingId) : null;
  const entries = items.map((item) => {
    const entry = useContent(item.id);
    return {
      id: item.id,
      title: entry.title,
      content: <p className="nh-faq-accordion__answer">{entry.body}</p>
    };
  });
  return (
    <section
      className={`nh-faq-accordion ${className}`.trim()}
      aria-labelledby={heading ? `${heading.id}-heading` : undefined}
    >
      {heading ? (
        <h2 id={`${heading.id}-heading`} className="nh-faq-accordion__heading">
          {heading.title}
        </h2>
      ) : null}
      <Accordion type={type} items={entries} />
    </section>
  );
};
