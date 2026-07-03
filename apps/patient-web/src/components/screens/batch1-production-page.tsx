import Link from "next/link";
import { MarketingSiteHeader } from "../marketing/site-header";
import { batch1RouteCatalog, type Batch1RouteKey } from "../../screens/batch1-route-catalog";

type Batch1ProductionPageProps = {
  routeKey: Batch1RouteKey;
};

const readinessStates = ["loading", "empty", "error", "offline", "forbidden", "success"];
const publicReadinessStates = ["loading", "error", "offline", "success"];

const publicScopeCaveat: Partial<Record<Batch1RouteKey, string>> = {
  "for-employers":
    "Employer-specific advanced coverage analytics are design-now and implementation-phased. No insurance guarantee is implied.",
  "for-hmos":
    "HMO collaboration pathways are implementation-phased and approval dependent. No coverage guarantee is implied.",
  "for-hospitals":
    "Hospital and specialist partnership pathways remain phased and subject to governance approvals before rollout."
};

const homeSegments = [
  { href: "/for-diaspora", label: "Diaspora families" },
  { href: "/for-employers", label: "Employers" },
  { href: "/for-hmos", label: "HMOs" },
  { href: "/for-doctors", label: "Doctors" },
  { href: "/for-care-partners", label: "Care partners" },
  { href: "/for-pharmacies", label: "Pharmacies and labs" }
];

export function Batch1ProductionPage({ routeKey }: Batch1ProductionPageProps) {
  const route = batch1RouteCatalog[routeKey];

  if (route.category === "Public" && route.marketing) {
    const caveat = publicScopeCaveat[routeKey];

    return (
      <>
        <MarketingSiteHeader />
        <main className="nh-marketing" data-screen-id={route.id}>
          <section className="nh-marketing__hero" aria-labelledby="screen-title">
            <h1 id="screen-title">{route.title}</h1>
            <p className="nh-marketing__summary">{route.marketing.heroSummary}</p>
            <div className="nh-marketing__cta-row">
              <Link
                className="nh-marketing__cta nh-marketing__cta--primary"
                href={route.primaryActionHref ?? "/register"}
              >
                {route.primaryAction}
              </Link>
              <Link
                className="nh-marketing__cta nh-marketing__cta--secondary"
                href={route.secondaryActionHref ?? "/help"}
              >
                {route.secondaryAction}
              </Link>
            </div>

            {routeKey === "home" ? (
              <section
                aria-label="Primary audience segments"
                className="nh-marketing__segment-strip"
              >
                <h2>Start with your role</h2>
                <div className="nh-marketing__segment-grid">
                  {homeSegments.map((segment) => (
                    <Link
                      key={segment.href}
                      href={segment.href}
                      className="nh-marketing__segment-pill"
                    >
                      {segment.label}
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {caveat ? <p className="nh-marketing__caveat">{caveat}</p> : null}
          </section>

          <section className="nh-marketing__card" aria-labelledby="problem-title">
            <h2 id="problem-title">The problem this page addresses</h2>
            <p>{route.marketing.audienceProblem}</p>
            <ul className="nh-marketing__list">
              {route.marketing.painPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="nh-marketing__card" aria-labelledby="workflow-title">
            <h2 id="workflow-title">How NelyoHealth helps</h2>
            <div className="nh-marketing__grid">
              {route.marketing.workflowSteps.map((workflow) => (
                <article
                  key={workflow.step}
                  className="nh-marketing__mini-card"
                  aria-label={workflow.step}
                >
                  <h3>{workflow.step}</h3>
                  <p>{workflow.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="nh-marketing__card" aria-labelledby="trust-title">
            <h2 id="trust-title">Trust and safety commitments</h2>
            <ul className="nh-marketing__list">
              {route.marketing.trustPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="nh-marketing__card" aria-labelledby="proof-title">
            <h2 id="proof-title">Feature proof</h2>
            <div className="nh-marketing__grid">
              {route.marketing.featureProof.map((proof) => (
                <article
                  key={proof.heading}
                  className="nh-marketing__mini-card"
                  aria-label={proof.heading}
                >
                  <h3>{proof.heading}</h3>
                  <p>{proof.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="nh-marketing__card" aria-labelledby="faq-title">
            <h2 id="faq-title">Frequently asked questions</h2>
            <div className="nh-marketing__faq-grid">
              {route.marketing.faqs.map((faq) => (
                <details key={faq.question} className="nh-marketing__faq-item">
                  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                  <p className="mt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="nh-marketing__card" aria-labelledby="spec-title">
            <h2 id="spec-title">Page structure commitments</h2>
            <div className="nh-marketing__grid">
              {route.sections.map((section) => (
                <article
                  key={section.heading}
                  className="nh-marketing__mini-card"
                  aria-label={section.heading}
                >
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
            <p className="nh-marketing__state-label">Required public states</p>
            <ul className="nh-marketing__state-list" aria-label="Required state coverage">
              {publicReadinessStates.map((stateKey) => (
                <li key={stateKey} className="nh-marketing__state-pill">
                  {stateKey}
                </li>
              ))}
            </ul>
          </section>

          <section className="nh-marketing__card" aria-labelledby="final-cta-title">
            <h2 id="final-cta-title">Next step</h2>
            <p>{route.marketing.finalCallout}</p>
            <div className="nh-marketing__cta-row">
              <Link
                className="nh-marketing__cta nh-marketing__cta--primary"
                href={route.primaryActionHref ?? "/register"}
              >
                {route.primaryAction}
              </Link>
              <Link
                className="nh-marketing__cta nh-marketing__cta--secondary"
                href={route.secondaryActionHref ?? "/help"}
              >
                {route.secondaryAction}
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <MarketingSiteHeader />
      <main className="nh-shell" data-screen-id={route.id}>
        <section className="nh-shell__header" aria-labelledby="screen-title">
          <p className="nh-shell__state-meta">{route.category} screen</p>
          <h1 id="screen-title">{route.title}</h1>
          <p>{route.purpose}</p>
        </section>

        <section aria-labelledby="screen-actions-title" className="nh-shell__state-card">
          <h2 id="screen-actions-title">Primary actions</h2>
          <p>
            <strong>Primary:</strong> {route.primaryAction}
          </p>
          <p>
            <strong>Secondary:</strong> {route.secondaryAction}
          </p>
        </section>

        <section aria-labelledby="screen-structure-title" className="nh-shell__state-card">
          <h2 id="screen-structure-title">Page structure</h2>
          <div className="nh-shell__state-grid">
            {route.sections.map((section) => (
              <article
                key={section.heading}
                className="nh-shell__state-card"
                aria-label={section.heading}
              >
                <h3>{section.heading}</h3>
                <p>{section.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="screen-readiness-title" className="nh-shell__state-card">
          <h2 id="screen-readiness-title">Production readiness states</h2>
          <ul className="nh-shell__nav" aria-label="Required state coverage">
            {readinessStates.map((stateKey) => (
              <li key={stateKey} className="nh-shell__nav-item">
                {stateKey}
              </li>
            ))}
          </ul>
          <p>
            This page contract is designed for direct business-logic integration without structural
            rewrite.
          </p>
        </section>

        <p>
          <Link href="/">Back to patient shell</Link>
        </p>
      </main>
    </>
  );
}
