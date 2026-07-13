import { useContent } from "../hooks/useContent.js";
import { IllustrationSlot } from "./IllustrationSlot.js";

export interface WorkflowStep {
  id: string;
  illustrationId?: string;
}

export interface WorkflowStepperProps {
  headingId?: string;
  steps: WorkflowStep[];
  className?: string;
}

export const WorkflowStepper = ({
  headingId,
  steps,
  className = ""
}: WorkflowStepperProps) => {
  const heading = headingId ? useContent(headingId) : null;
  return (
    <section
      className={`nh-workflow-stepper ${className}`.trim()}
      aria-labelledby={heading ? `${heading.id}-heading` : undefined}
    >
      {heading ? (
        <h2 id={`${heading.id}-heading`} className="nh-workflow-stepper__heading">
          {heading.title}
        </h2>
      ) : null}
      <ol className="nh-workflow-stepper__list">
        {steps.map((step, index) => (
          <WorkflowStepperItem key={step.id} step={step} index={index + 1} />
        ))}
      </ol>
    </section>
  );
};

const WorkflowStepperItem = ({
  step,
  index
}: {
  step: WorkflowStep;
  index: number;
}) => {
  const entry = useContent(step.id);
  return (
    <li className="nh-workflow-stepper__item" data-step-index={index}>
      {step.illustrationId ? (
        <div className="nh-workflow-stepper__visual">
          <IllustrationSlot
            illustrationId={step.illustrationId}
            align="center"
            tone="cool"
            label={entry.title}
          />
        </div>
      ) : null}
      <div className="nh-workflow-stepper__body">
        <span className="nh-workflow-stepper__index" aria-hidden="true">
          {index.toString().padStart(2, "0")}
        </span>
        <span className="nh-workflow-stepper__title">{entry.title}</span>
        {entry.body ? (
          <p className="nh-workflow-stepper__detail">{entry.body}</p>
        ) : null}
      </div>
    </li>
  );
};
