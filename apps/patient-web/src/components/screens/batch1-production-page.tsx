import Link from "next/link";
import { batch1RouteCatalog, type Batch1RouteKey } from "../../screens/batch1-route-catalog";

type Batch1ProductionPageProps = {
  routeKey: Batch1RouteKey;
};

const readinessStates = ["loading", "empty", "error", "offline", "forbidden", "success"];

export function Batch1ProductionPage({ routeKey }: Batch1ProductionPageProps) {
  const route = batch1RouteCatalog[routeKey];

  return (
    <main className="nh-shell" data-screen-id={route.id}>
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <p className="nh-shell__state-meta">{route.category} screen</p>
        <h1 id="screen-title">{route.title}</h1>
        <p>{route.purpose}</p>
        <p>
          <strong>Screen ID:</strong> {route.id}
        </p>
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
            <article key={section.heading} className="nh-shell__state-card" aria-label={section.heading}>
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
          This page contract is designed for direct business-logic integration without structural rewrite.
        </p>
      </section>

      <p>
        <Link href="/">Back to patient shell</Link>
      </p>
    </main>
  );
}
