import Link from "next/link";
import { MarketingSiteHeader } from "../marketing/site-header";
import { batch1RouteCatalog, type Batch1RouteKey } from "../../screens/batch1-route-catalog";

type Batch1ProductionPageProps = {
  routeKey: Batch1RouteKey;
};

const readinessStates = ["loading", "empty", "error", "offline", "forbidden", "success"];

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

const sectionTitleOverrides: Partial<
  Record<
    Batch1RouteKey,
    {
      problem: string;
      solution: string;
      benefits: string;
      workflow: string;
      trust: string;
      faq: string;
      cta: string;
      helperPrefix: string;
    }
  >
> = {
  home: {
    problem: "Where care coordination breaks down",
    solution: "How NelyoHealth coordinates care",
    benefits: "What families and organizations gain",
    workflow: "How the care journey moves forward",
    trust: "Why this coordination model is trustworthy",
    faq: "Questions people ask before getting started",
    cta: "Start your healthcare journey",
    helperPrefix: "Returning user?"
  },
  about: {
    problem: "Why coordinated care is needed",
    solution: "The NelyoHealth care model",
    benefits: "What this model improves",
    workflow: "How coordinated care is delivered",
    trust: "Why this model is built for trust",
    faq: "Common questions about our mission and model",
    cta: "Explore the next step",
    helperPrefix: "Prefer to review safety details first?"
  },
  "for-employers": {
    problem: "What employers are trying to fix",
    solution: "How employer care access is structured",
    benefits: "What your workforce operations gain",
    workflow: "How employer-supported care works",
    trust: "Why employer data boundaries hold",
    faq: "Questions from HR and leadership teams",
    cta: "Request an employer walkthrough",
    helperPrefix: "Need compliance and privacy details first?"
  },
  "for-hmos": {
    problem: "Where member access usually fails",
    solution: "How HMO collaboration is structured",
    benefits: "What HMO operations teams gain",
    workflow: "How member pathways progress",
    trust: "Why payer boundaries are enforced",
    faq: "Questions from HMO product and operations teams",
    cta: "Request an HMO walkthrough",
    helperPrefix: "Need scope and support guidance first?"
  },
  "for-diaspora": {
    problem: "What diaspora families struggle with",
    solution: "How remote family support is coordinated",
    benefits: "What sponsors and families gain",
    workflow: "How cross-border care support works",
    trust: "Why sponsor boundaries stay clear",
    faq: "Questions from diaspora sponsors",
    cta: "Start family support setup",
    helperPrefix: "Need to review consent boundaries first?"
  },
  "for-doctors": {
    problem: "What slows clinicians down",
    solution: "How clinician workflows are supported",
    benefits: "What clinicians can expect",
    workflow: "How doctor workflows progress",
    trust: "Why clinical governance remains central",
    faq: "Questions from doctors considering participation",
    cta: "Begin provider onboarding",
    helperPrefix: "Need to review clinical safety first?"
  },
  "for-care-partners": {
    problem: "Where care support workflows fail",
    solution: "How care-partner work is structured",
    benefits: "What verified care partners gain",
    workflow: "How care-partner tasks progress",
    trust: "Why care-partner boundaries stay safe",
    faq: "Questions from care-partner teams",
    cta: "Start care-partner verification",
    helperPrefix: "Need to review allowed task scope first?"
  },
  "for-pharmacies": {
    problem: "Where pharmacy fulfilment gets blocked",
    solution: "How pharmacy fulfilment is coordinated",
    benefits: "What pharmacy operations gain",
    workflow: "How order fulfilment progresses",
    trust: "Why disclosure controls stay enforced",
    faq: "Questions from pharmacy operators",
    cta: "Join the pharmacy network",
    helperPrefix: "Need to review disclosure boundaries first?"
  },
  "for-labs": {
    problem: "Where diagnostics workflows lose momentum",
    solution: "How laboratory operations are coordinated",
    benefits: "What laboratory teams gain",
    workflow: "How diagnostics workflows progress",
    trust: "Why result-governance boundaries hold",
    faq: "Questions from laboratory operators",
    cta: "Join the lab network",
    helperPrefix: "Need to review result governance first?"
  },
  "for-hospitals": {
    problem: "Where referral continuity breaks",
    solution: "How referral and specialist pathways are coordinated",
    benefits: "What hospital and specialist teams gain",
    workflow: "How referral workflows progress",
    trust: "Why escalation pathways remain safe",
    faq: "Questions from hospital and referral teams",
    cta: "Request a referral partnership discussion",
    helperPrefix: "Need to review scope caveats first?"
  },
  pricing: {
    problem: "Where care funding choices get confusing",
    solution: "How pricing and scope are clarified",
    benefits: "What plan selection clarity gives you",
    workflow: "How funding pathways progress",
    trust: "Why financial boundaries remain clear",
    faq: "Questions about plans and scope",
    cta: "Compare plans and move forward",
    helperPrefix: "Need support guidance first?"
  },
  "book-demo": {
    problem: "Why generic demos waste time",
    solution: "How your demo is tailored",
    benefits: "What teams gain from a focused walkthrough",
    workflow: "How the demo process works",
    trust: "Why scope and claims remain grounded",
    faq: "Questions before booking a demo",
    cta: "Book your walkthrough",
    helperPrefix: "Need preparation guidance first?"
  },
  "trust-safety": {
    problem: "Where healthcare trust is often lost",
    solution: "How trust and safety controls are applied",
    benefits: "What these controls protect",
    workflow: "How safety controls operate in practice",
    trust: "Core trust and safety commitments",
    faq: "Questions about safety, privacy, and governance",
    cta: "Review trust and safety expectations",
    helperPrefix: "Need privacy overview guidance first?"
  },
  help: {
    problem: "Where people get stuck",
    solution: "How support pathways are organized",
    benefits: "What effective support gives you",
    workflow: "How issue resolution progresses",
    trust: "Why support remains safe and governed",
    faq: "Frequently asked support questions",
    cta: "Choose your support route",
    helperPrefix: "Need a different support path?"
  }
};

export function Batch1ProductionPage({ routeKey }: Batch1ProductionPageProps) {
  const route = batch1RouteCatalog[routeKey];

  if (route.category === "Public" && route.marketing) {
    const caveat = publicScopeCaveat[routeKey];
    const sectionTitles = sectionTitleOverrides[routeKey] ?? {
      problem: "What is getting in the way today",
      solution: "How NelyoHealth helps",
      benefits: "What you can expect",
      workflow: "How it works",
      trust: "Why you can trust this pathway",
      faq: "Frequently asked questions",
      cta: "Take the next step",
      helperPrefix: "Need a different path?"
    };

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
            </div>
            <p className="nh-marketing__helper-link">
              {sectionTitles.helperPrefix}{" "}
              <Link href={route.secondaryActionHref ?? "/help"}>{route.secondaryAction}</Link>
            </p>

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
            <h2 id="problem-title">{sectionTitles.problem}</h2>
            <p>{route.marketing.audienceProblem}</p>
            <ul className="nh-marketing__list">
              {route.marketing.painPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="nh-marketing__card" aria-labelledby="solution-title">
            <h2 id="solution-title">{sectionTitles.solution}</h2>
            <p>{route.purpose}</p>
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
          </section>

          <section className="nh-marketing__card" aria-labelledby="benefits-title">
            <h2 id="benefits-title">{sectionTitles.benefits}</h2>
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

          <section className="nh-marketing__card" aria-labelledby="workflow-title">
            <h2 id="workflow-title">{sectionTitles.workflow}</h2>
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
            <h2 id="trust-title">{sectionTitles.trust}</h2>
            <ul className="nh-marketing__list">
              {route.marketing.trustPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="nh-marketing__card" aria-labelledby="faq-title">
            <h2 id="faq-title">{sectionTitles.faq}</h2>
            <div className="nh-marketing__faq-grid">
              {route.marketing.faqs.map((faq) => (
                <details key={faq.question} className="nh-marketing__faq-item">
                  <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                  <p className="mt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="nh-marketing__card" aria-labelledby="final-cta-title">
            <h2 id="final-cta-title">{sectionTitles.cta}</h2>
            <p>{route.marketing.finalCallout}</p>
            <div className="nh-marketing__cta-row">
              <Link
                className="nh-marketing__cta nh-marketing__cta--primary"
                href={route.primaryActionHref ?? "/register"}
              >
                {route.primaryAction}
              </Link>
            </div>
            <p className="nh-marketing__helper-link">
              {sectionTitles.helperPrefix}{" "}
              <Link href={route.secondaryActionHref ?? "/help"}>{route.secondaryAction}</Link>
            </p>
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
