"use client";

import { useContent } from "../hooks/useContent.js";

export interface SegmentCard {
  id: string;
  href: string;
  illustrationId?: string;
}

export interface SegmentGridProps {
  headingId?: string;
  cards: SegmentCard[];
  className?: string;
}

export const SegmentGrid = ({
  headingId,
  cards,
  className = ""
}: SegmentGridProps) => {
  const heading = headingId ? useContent(headingId) : null;
  return (
    <section
      className={`nh-segment-grid ${className}`.trim()}
      aria-labelledby={heading ? `${heading.id}-heading` : undefined}
    >
      {heading ? (
        <h2 id={`${heading.id}-heading`} className="nh-segment-grid__heading">
          {heading.title}
        </h2>
      ) : null}
      <ul className="nh-segment-grid__list">
        {cards.map((card) => (
          <SegmentCardEntry key={card.id} card={card} />
        ))}
      </ul>
    </section>
  );
};

const SegmentCardEntry = ({ card }: { card: SegmentCard }) => {
  const entry = useContent(card.id);
  return (
    <li className="nh-segment-grid__item">
      <a href={card.href} className="nh-segment-grid__link">
        <span className="nh-segment-grid__title">{entry.title}</span>
        {entry.body ? (
          <span className="nh-segment-grid__detail">{entry.body}</span>
        ) : null}
        <span aria-hidden="true" className="nh-segment-grid__arrow">
          →
        </span>
      </a>
    </li>
  );
};
