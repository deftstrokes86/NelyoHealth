"use client";

import type { ReactNode } from "react";
import { useContent } from "../hooks/useContent.js";

export interface TrustBarItem {
  id: string;
  icon: ReactNode;
}

export interface TrustBarProps {
  items: TrustBarItem[];
  headingId?: string;
  className?: string;
}

export const TrustBar = ({ items, headingId, className = "" }: TrustBarProps) => {
  const heading = headingId ? useContent(headingId) : null;
  return (
    <section
      className={`nh-trust-bar ${className}`.trim()}
      aria-labelledby={heading ? `${heading.id}-heading` : undefined}
    >
      {heading ? (
        <h2 id={`${heading.id}-heading`} className="nh-trust-bar__heading">
          {heading.title}
        </h2>
      ) : null}
      <ul className="nh-trust-bar__list">
        {items.map((item) => (
          <TrustBarEntry key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

const TrustBarEntry = ({ item }: { item: TrustBarItem }) => {
  const entry = useContent(item.id);
  return (
    <li className="nh-trust-bar__item" data-content-id={item.id}>
      <span className="nh-trust-bar__icon" aria-hidden="true">
        {item.icon}
      </span>
      <div className="nh-trust-bar__body">
        <span className="nh-trust-bar__title">{entry.title}</span>
        {entry.body ? <p className="nh-trust-bar__detail">{entry.body}</p> : null}
      </div>
    </li>
  );
};
