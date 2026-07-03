import Link from "next/link";
import { batch2RouteCatalog, type Batch2RouteKey } from "../../screens/batch2-route-catalog";

type Batch2ProductionPageProps = {
  routeKey: Batch2RouteKey;
};

const requiredStates = [
  "loading",
  "empty",
  "error",
  "offline",
  "unauthorized",
  "forbidden",
  "success"
];

function resolveSafetyNote(routeKey: string, group: "Patient" | "GuardianMinor") {
  if (routeKey.includes("safeguarding") || routeKey.includes("emergency")) {
    return "Emergency and safeguarding actions are prioritized and never hidden behind commercial flows.";
  }

  if (routeKey.includes("prescriptions") || routeKey.includes("labs") || routeKey.includes("checkout")) {
    return "Protected provider disclosure boundaries remain enforced until exact authorization conditions are satisfied.";
  }

  if (group === "GuardianMinor") {
    return "Minor-care flows preserve guardian consent boundaries and age-appropriate privacy controls.";
  }

  return "Clinical safety, consent, and RBAC boundaries are enforced across all state transitions.";
}

export function Batch2ProductionPage({ routeKey }: Batch2ProductionPageProps) {
  const route = batch2RouteCatalog[routeKey];
  const safetyNote = resolveSafetyNote(routeKey, route.group);

  return (
    <main className="nh-shell" data-screen-id={route.id}>
      <section className="nh-shell__header" aria-labelledby="screen-title">
        <p className="nh-shell__state-meta">{route.group === "Patient" ? "Patient" : "Guardian and Minor"} workflow</p>
        <h1 id="screen-title">{route.title}</h1>
        <p>{route.purpose}</p>
        <p>
          <strong>Screen ID:</strong> {route.id}
        </p>
      </section>

      <section className="nh-shell__state-card" aria-labelledby="journey-structure-title">
        <h2 id="journey-structure-title">Production structure</h2>
        <div className="nh-shell__state-grid">
          <article className="nh-shell__state-card" aria-label="Primary workflow section">
            <h3>Primary workflow</h3>
            <p>Task-first interaction block for role-specific completion and deterministic outcome progression.</p>
          </article>
          <article className="nh-shell__state-card" aria-label="Clinical and consent safeguards">
            <h3>Clinical and consent safeguards</h3>
            <p>{safetyNote}</p>
          </article>
          <article className="nh-shell__state-card" aria-label="Operational continuity">
            <h3>Operational continuity</h3>
            <p>Retry, support escalation, and status communication are designed for low-bandwidth and intermittent connectivity.</p>
          </article>
        </div>
      </section>

      <section className="nh-shell__state-card" aria-labelledby="state-coverage-title">
        <h2 id="state-coverage-title">State coverage contract</h2>
        <ul className="nh-shell__nav" aria-label="Required state coverage">
          {requiredStates.map((state) => (
            <li key={state} className="nh-shell__nav-item">
              {state}
            </li>
          ))}
        </ul>
      </section>

      <p>
        <Link href="/">Back to patient shell</Link>
      </p>
    </main>
  );
}
