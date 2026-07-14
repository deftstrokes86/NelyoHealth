"use client";

import { useContent } from "../hooks/useContent.js";

export interface EmergencyRibbonProps {
  headlineId: string;
  actionLabelId: string;
  actionHref: string;
  className?: string;
}

export const EmergencyRibbon = ({
  headlineId,
  actionLabelId,
  actionHref,
  className = ""
}: EmergencyRibbonProps) => {
  const headline = useContent(headlineId);
  const action = useContent(actionLabelId);
  return (
    <aside
      className={`nh-emergency-ribbon ${className}`.trim()}
      role="region"
      aria-label={headline.title}
      data-motion-profile="SAFETY-IMMEDIATE"
    >
      <div className="nh-emergency-ribbon__inner">
        <span className="nh-emergency-ribbon__badge" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path d="M10 2 L18 16 H2 Z" />
            <path d="M9 8h2v5H9zM9 14h2v2H9z" fill="var(--nh-color-status-danger-bg)" />
          </svg>
        </span>
        <span className="nh-emergency-ribbon__text">
          <strong>{headline.title}</strong>
          {headline.body ? (
            <span className="nh-emergency-ribbon__body"> {headline.body}</span>
          ) : null}
        </span>
        <a
          href={actionHref}
          className="nh-emergency-ribbon__action"
          data-focus-first="true"
        >
          {action.title}
          <span aria-hidden="true"> →</span>
        </a>
      </div>
    </aside>
  );
};
