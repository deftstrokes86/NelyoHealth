import type { HTMLAttributes, ReactNode } from "react";

export type TimelineStatus = "complete" | "current" | "upcoming" | "warning" | "danger";
export type TimelineOrientation = "vertical" | "horizontal";

export interface TimelineStep {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  status?: TimelineStatus;
  timestamp?: ReactNode;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  steps: TimelineStep[];
  orientation?: TimelineOrientation;
  label?: string;
}

export const Timeline = ({
  steps,
  orientation = "vertical",
  label = "Timeline",
  className = "",
  ...props
}: TimelineProps) => (
  <ol
    className={
      `nh-timeline nh-timeline--${orientation}` +
      (className ? ` ${className}` : "")
    }
    aria-label={label}
    data-orientation={orientation}
    {...props}
  >
    {steps.map((step) => {
      const status = step.status ?? "upcoming";
      return (
        <li
          key={step.id}
          className={`nh-timeline__step nh-timeline__step--${status}`}
          data-status={status}
          aria-current={status === "current" ? "step" : undefined}
        >
          <span className="nh-timeline__marker" aria-hidden="true">
            <span className="nh-timeline__dot" />
          </span>
          <div className="nh-timeline__body">
            <div className="nh-timeline__header">
              <span className="nh-timeline__title">{step.title}</span>
              {step.timestamp ? (
                <span className="nh-timeline__timestamp">{step.timestamp}</span>
              ) : null}
            </div>
            {step.description ? (
              <div className="nh-timeline__description">{step.description}</div>
            ) : null}
          </div>
        </li>
      );
    })}
  </ol>
);
