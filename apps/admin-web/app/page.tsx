import { Alert, Stack, Surface } from "@nelyohealth/ui-foundation";
import { adminShellDescriptor, adminShellNavigation, adminShellStateScaffolds } from "../src/shell";

export default function AdminWebHomePage() {
  return (
    <main className="nh-shell">
      <Surface as="section" aria-labelledby="admin-shell-title" className="nh-shell__header">
        <Stack gap="md">
          <h1 id="admin-shell-title">Admin Web Shell</h1>
          <p>
            This shell is synthetic-only and does not expose protected pharmacy or laboratory
            provider details before payment authorization.
          </p>
          <nav aria-label="Admin shell navigation scaffold">
            <ul className="nh-shell__nav">
              {adminShellNavigation.map((item) => (
                <li key={item} className="nh-shell__nav-item">
                  {item}
                </li>
              ))}
            </ul>
          </nav>
          <Alert tone="info" title="Phase 2 Foundation">
            {`Issue: ${adminShellDescriptor.issue} | App: ${adminShellDescriptor.appId}`}
          </Alert>
          <Alert tone="success" title="Phase 5 Foundation">
            {`Issue: ${adminShellDescriptor.phase5Issue} | State scaffolds: ${adminShellStateScaffolds.length}`}
          </Alert>
        </Stack>
      </Surface>

      <section aria-labelledby="admin-shell-state-title">
        <Stack gap="sm">
          <h2 id="admin-shell-state-title">Admin shell state scaffolds</h2>
          <div className="nh-shell__state-grid">
            {adminShellStateScaffolds.map((state) => (
              <Surface
                key={state.key}
                as="article"
                tone="raised"
                className="nh-shell__state-card"
                aria-label={`Admin shell ${state.title} state`}
                data-shell-state={state.key}
              >
                <h3>{state.title}</h3>
                <p>{state.message}</p>
                <p className="nh-shell__state-meta">Tone: {state.stateTone}</p>
              </Surface>
            ))}
          </div>
        </Stack>
      </section>
    </main>
  );
}
