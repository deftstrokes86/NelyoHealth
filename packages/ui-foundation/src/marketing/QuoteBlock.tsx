import { useContent } from "../hooks/useContent.js";

export interface QuoteBlockProps {
  quoteId: string;
  attributionId: string;
  synthetic?: boolean;
  className?: string;
}

export const QuoteBlock = ({
  quoteId,
  attributionId,
  synthetic = true,
  className = ""
}: QuoteBlockProps) => {
  const quote = useContent(quoteId);
  const attribution = useContent(attributionId);
  return (
    <figure
      className={`nh-quote-block ${className}`.trim()}
      data-synthetic={synthetic || undefined}
    >
      {synthetic ? (
        <p className="nh-quote-block__caveat" role="note">
          Synthetic quote for preview only — real approval pending.
        </p>
      ) : null}
      <blockquote className="nh-quote-block__quote">
        <p>{quote.body || quote.title}</p>
      </blockquote>
      <figcaption className="nh-quote-block__attribution">
        <span className="nh-quote-block__name">{attribution.title}</span>
        {attribution.body ? (
          <span className="nh-quote-block__role">{attribution.body}</span>
        ) : null}
      </figcaption>
    </figure>
  );
};
