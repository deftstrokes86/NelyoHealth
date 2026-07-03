import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  Globe2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  ClipboardList,
  UserRound,
  Users
} from "lucide-react";
import { MarketingSiteHeader } from "../marketing/site-header";
import { batch1RouteCatalog, type Batch1RouteKey } from "../../screens/batch1-route-catalog";

type Batch1ProductionPageProps = {
  routeKey: Batch1RouteKey;
};

const readinessStates = ["loading", "empty", "error", "offline", "forbidden", "success"];

const homeSegments = [
  { href: "/for-diaspora", label: "Diaspora families" },
  { href: "/for-employers", label: "Employers" },
  { href: "/for-hmos", label: "HMOs" },
  { href: "/for-doctors", label: "Doctors" },
  { href: "/for-care-partners", label: "Care partners" },
  { href: "/for-pharmacies", label: "Pharmacies and labs" }
];

const trustBarItems: Array<{ title: string; detail: string; Icon: LucideIcon }> = [
  {
    title: "Privacy by design",
    detail: "Consent and role boundaries enforced",
    Icon: LockKeyhole
  },
  {
    title: "Verified clinicians",
    detail: "Licensed professionals and clinical standards",
    Icon: Stethoscope
  },
  {
    title: "End-to-end coordination",
    detail: "From consult to follow-up, connected securely",
    Icon: Activity
  },
  {
    title: "Built for Nigeria and diaspora",
    detail: "Local context, global family connections",
    Icon: Globe2
  }
];

const authPageContent = {
  login: {
    headline: "Welcome back to coordinated care.",
    summary:
      "Sign in to continue with secure access, role-aware routing, and clear next steps across the NelyoHealth care journey.",
    fields: [
      { label: "Email address", type: "email", placeholder: "name@example.com", Icon: Mail },
      { label: "Password", type: "password", placeholder: "Enter your password", Icon: LockKeyhole }
    ],
    primaryCta: "Sign In",
    secondaryHref: "/forgot-password",
    secondaryLabel: "Forgot your password?",
    supportNote:
      "By continuing, you agree to secure session handling and role-based access controls.",
    highlights: [
      {
        title: "Secure access",
        detail:
          "Session hardening and role-aware redirects protect patient, supporter, and partner journeys.",
        Icon: ShieldCheck
      },
      {
        title: "Operational clarity",
        detail:
          "Concise recovery and error guidance helps users act without exposing sensitive account state.",
        Icon: CheckCircle2
      },
      {
        title: "Need help?",
        detail:
          "Use recovery or support pathways instead of retrying blindly when access issues occur.",
        Icon: HeartHandshake
      }
    ],
    companionLinks: [
      { label: "Recover Access", href: "/forgot-password" },
      { label: "Create Account", href: "/register" }
    ]
  },
  register: {
    headline: "Create your NelyoHealth account.",
    summary:
      "Start with the minimum account details, then continue into the right onboarding flow for patients, families, employers, and healthcare partners.",
    fields: [
      { label: "Full name", type: "text", placeholder: "Enter your full name", Icon: UserRound },
      { label: "Email address", type: "email", placeholder: "name@example.com", Icon: Mail },
      { label: "Phone number", type: "tel", placeholder: "+234 800 000 0000", Icon: Phone },
      { label: "Password", type: "password", placeholder: "Create a password", Icon: LockKeyhole }
    ],
    primaryCta: "Create Account",
    secondaryHref: "/login",
    secondaryLabel: "Already have an account? Sign in.",
    supportNote:
      "Registration continues into role-specific onboarding with privacy, consent, and boundary checks built in.",
    highlights: [
      {
        title: "Account setup",
        detail:
          "Collect only the essentials first, then move into the right guided onboarding path.",
        Icon: CheckCircle2
      },
      {
        title: "Role-aware journeys",
        detail:
          "Patients, supporters, employers, and partners each continue through the appropriate workflow.",
        Icon: BriefcaseBusiness
      },
      {
        title: "Privacy and consent",
        detail:
          "Boundaries are stated clearly before any sensitive data or care coordination actions continue.",
        Icon: ShieldCheck
      }
    ],
    companionLinks: [
      { label: "Use Existing Account", href: "/login" },
      { label: "Review Trust and Safety", href: "/trust-safety" }
    ]
  }
} as const;

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
          {routeKey === "home" ? (
            <>
              <section className="nh-marketing__hero nh-home-hero" aria-labelledby="screen-title">
                <div className="nh-home-hero__layout">
                  <div className="nh-home-hero__content">
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
                        href="/about"
                      >
                        Explore how it works
                      </Link>
                    </div>
                    <p className="nh-marketing__helper-link">
                      Returning user? <Link href="/login">Sign in</Link>
                    </p>
                  </div>

                  <div className="nh-home-hero__visual" aria-hidden="true">
                    <div className="nh-home-hero__orbital">
                      <div className="nh-home-hero__ring" />
                      <div className="nh-home-hero__ring nh-home-hero__ring--outer" />

                      <div className="nh-home-hero__center-photo">
                        <img src="/hero/family-center.svg" alt="" />
                      </div>

                      <div className="nh-home-hero__avatar nh-home-hero__avatar--top">
                        <img src="/hero/avatar-doctor.svg" alt="" />
                      </div>
                      <div className="nh-home-hero__avatar nh-home-hero__avatar--right">
                        <img src="/hero/avatar-nurse.svg" alt="" />
                      </div>
                      <div className="nh-home-hero__avatar nh-home-hero__avatar--bottom">
                        <img src="/hero/avatar-pharmacist.svg" alt="" />
                      </div>
                      <div className="nh-home-hero__avatar nh-home-hero__avatar--left">
                        <img src="/hero/avatar-clinician.svg" alt="" />
                      </div>

                      <div className="nh-home-hero__badge nh-home-hero__badge--heart">
                        <HeartPulse size={16} />
                      </div>
                      <div className="nh-home-hero__badge nh-home-hero__badge--record">
                        <ClipboardList size={16} />
                      </div>
                      <div className="nh-home-hero__badge nh-home-hero__badge--people">
                        <Users size={16} />
                      </div>
                      <div className="nh-home-hero__badge nh-home-hero__badge--shield">
                        <ShieldCheck size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="nh-home-trust-strip" aria-label="Trust commitments">
                <p className="nh-home-trust-strip__title">
                  Trusted by patients, families and organizations
                </p>
                {trustBarItems.map(({ title, detail, Icon }) => (
                  <div key={title} className="nh-home-trust-strip__item">
                    <Icon size={17} aria-hidden="true" />
                    <div>
                      <strong>{title}</strong>
                      <span>{detail}</span>
                    </div>
                  </div>
                ))}
              </section>

              <section
                aria-label="Primary audience segments"
                className="nh-marketing__segment-strip"
              >
                <h2>Choose your care pathway</h2>
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
            </>
          ) : (
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
            </section>
          )}

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

  if (routeKey === "login" || routeKey === "register") {
    const authContent = authPageContent[routeKey];

    return (
      <>
        <MarketingSiteHeader />
        <main className="nh-auth" data-screen-id={route.id}>
          <section className="nh-auth__layout" aria-labelledby="screen-title">
            <div className="nh-auth__hero">
              <h1 id="screen-title">{authContent.headline}</h1>
              <p className="nh-auth__summary">{authContent.summary}</p>

              <div className="nh-auth__highlights" aria-label="Authentication page highlights">
                {authContent.highlights.map(({ title, detail, Icon }) => (
                  <article key={title} className="nh-auth__highlight-card">
                    <span className="nh-auth__highlight-icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <div>
                      <h2>{title}</h2>
                      <p>{detail}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="nh-auth__companion-links" aria-label="Authentication support links">
                {authContent.companionLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="nh-auth__companion-link">
                    <span>{item.label}</span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>

            <section className="nh-auth__panel" aria-label={`${route.title} form`}>
              <div className="nh-auth__panel-header">
                <p className="nh-auth__panel-label">Secure access</p>
                <h2>{route.title}</h2>
                <p>{route.purpose}</p>
              </div>

              <form className="nh-auth__form">
                {authContent.fields.map(({ label, type, placeholder, Icon }) => (
                  <label key={label} className="nh-auth__field">
                    <span>{label}</span>
                    <div className="nh-auth__input-wrap">
                      <span className="nh-auth__input-icon" aria-hidden="true">
                        <Icon size={18} />
                      </span>
                      <input type={type} placeholder={placeholder} />
                    </div>
                  </label>
                ))}

                {routeKey === "register" ? (
                  <label className="nh-auth__field">
                    <span>Primary role</span>
                    <div className="nh-auth__input-wrap nh-auth__input-wrap--select">
                      <span className="nh-auth__input-icon" aria-hidden="true">
                        <Users size={18} />
                      </span>
                      <select defaultValue="patient">
                        <option value="patient">Patient</option>
                        <option value="family">Family supporter</option>
                        <option value="employer">Employer or organization</option>
                        <option value="partner">Healthcare partner</option>
                      </select>
                    </div>
                  </label>
                ) : null}

                <button type="submit" className="nh-auth__submit">
                  <span>{authContent.primaryCta}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </form>

              <p className="nh-auth__support-note">{authContent.supportNote}</p>
              <p className="nh-auth__secondary-link">
                <Link href={authContent.secondaryHref}>{authContent.secondaryLabel}</Link>
              </p>
            </section>
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
