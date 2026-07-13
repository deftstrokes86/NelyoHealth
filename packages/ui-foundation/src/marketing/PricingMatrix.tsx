import { useContent } from "../hooks/useContent.js";

export interface PricingFeatureCell {
  planId: string;
  value: string;
}

export interface PricingFeatureRow {
  id: string;
  cells: PricingFeatureCell[];
}

export interface PricingPlan {
  id: string;
  emphasized?: boolean;
  priceLabelId?: string;
  ctaLabelId?: string;
  ctaHref?: string;
}

export interface PricingMatrixProps {
  headingId?: string;
  disclaimerId?: string;
  plans: PricingPlan[];
  features: PricingFeatureRow[];
  className?: string;
}

export const PricingMatrix = ({
  headingId,
  disclaimerId,
  plans,
  features,
  className = ""
}: PricingMatrixProps) => {
  const heading = headingId ? useContent(headingId) : null;
  const disclaimer = disclaimerId ? useContent(disclaimerId) : null;
  return (
    <section
      className={`nh-pricing-matrix ${className}`.trim()}
      aria-labelledby={heading ? `${heading.id}-heading` : undefined}
    >
      {heading ? (
        <h2 id={`${heading.id}-heading`} className="nh-pricing-matrix__heading">
          {heading.title}
        </h2>
      ) : null}
      <div className="nh-pricing-matrix__scroll">
        <table className="nh-pricing-matrix__table">
          <caption className="nh-visually-hidden">
            {heading?.title ?? "Pricing comparison"}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="nh-pricing-matrix__row-label">
                <span className="nh-visually-hidden">Feature</span>
              </th>
              {plans.map((plan) => (
                <PricingPlanHeader key={plan.id} plan={plan} />
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((row) => (
              <PricingFeatureRowView key={row.id} row={row} plans={plans} />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="nh-pricing-matrix__row-label">
                <span className="nh-visually-hidden">Get started</span>
              </th>
              {plans.map((plan) => (
                <PricingPlanFooter key={plan.id} plan={plan} />
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      {disclaimer ? (
        <p className="nh-pricing-matrix__disclaimer">{disclaimer.body}</p>
      ) : null}
    </section>
  );
};

const PricingPlanHeader = ({ plan }: { plan: PricingPlan }) => {
  const entry = useContent(plan.id);
  const price = plan.priceLabelId ? useContent(plan.priceLabelId) : null;
  return (
    <th
      scope="col"
      className={
        "nh-pricing-matrix__plan" +
        (plan.emphasized ? " nh-pricing-matrix__plan--emphasized" : "")
      }
      data-emphasized={plan.emphasized || undefined}
    >
      <span className="nh-pricing-matrix__plan-name">{entry.title}</span>
      {price ? (
        <span className="nh-pricing-matrix__plan-price">{price.title}</span>
      ) : null}
      {entry.body ? (
        <span className="nh-pricing-matrix__plan-detail">{entry.body}</span>
      ) : null}
    </th>
  );
};

const PricingFeatureRowView = ({
  row,
  plans
}: {
  row: PricingFeatureRow;
  plans: PricingPlan[];
}) => {
  const label = useContent(row.id);
  const cellByPlan = new Map(row.cells.map((cell) => [cell.planId, cell.value]));
  return (
    <tr className="nh-pricing-matrix__row">
      <th scope="row" className="nh-pricing-matrix__row-label">
        {label.title}
      </th>
      {plans.map((plan) => (
        <td
          key={plan.id}
          className="nh-pricing-matrix__cell"
          data-plan={plan.id}
        >
          {cellByPlan.get(plan.id) ?? "—"}
        </td>
      ))}
    </tr>
  );
};

const PricingPlanFooter = ({ plan }: { plan: PricingPlan }) => {
  const cta = plan.ctaLabelId ? useContent(plan.ctaLabelId) : null;
  if (!cta || !plan.ctaHref)
    return <td className="nh-pricing-matrix__cell" />;
  return (
    <td className="nh-pricing-matrix__cell">
      <a
        href={plan.ctaHref}
        className={
          "nh-pricing-matrix__cta" +
          (plan.emphasized ? " nh-pricing-matrix__cta--emphasized" : "")
        }
      >
        {cta.title}
      </a>
    </td>
  );
};
