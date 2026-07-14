"use client";

import { useContent } from "../hooks/useContent.js";

export interface ProofStripItem {
  id: string;
  value: string;
}

export interface ProofStripProps {
  headingId?: string;
  items: ProofStripItem[];
  className?: string;
}

export const ProofStrip = ({
  headingId,
  items,
  className = ""
}: ProofStripProps) => {
  const heading = headingId ? useContent(headingId) : null;
  return (
    <section
      className={`nh-proof-strip ${className}`.trim()}
      aria-labelledby={heading ? `${heading.id}-heading` : undefined}
    >
      {heading ? (
        <h2 id={`${heading.id}-heading`} className="nh-proof-strip__heading">
          {heading.title}
        </h2>
      ) : null}
      <dl className="nh-proof-strip__list">
        {items.map((item) => (
          <ProofStripEntry key={item.id} item={item} />
        ))}
      </dl>
    </section>
  );
};

const ProofStripEntry = ({ item }: { item: ProofStripItem }) => {
  const entry = useContent(item.id);
  return (
    <div className="nh-proof-strip__item" data-content-id={item.id}>
      <dt className="nh-proof-strip__value">{item.value}</dt>
      <dd className="nh-proof-strip__label">
        <span className="nh-proof-strip__title">{entry.title}</span>
        {entry.body ? (
          <span className="nh-proof-strip__body">{entry.body}</span>
        ) : null}
      </dd>
    </div>
  );
};
