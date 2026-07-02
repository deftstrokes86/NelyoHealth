import { Alert, Stack, Surface } from "@nelyohealth/ui-foundation";
import {
  providerShellDescriptor,
  providerShellNavigation,
  providerShellStateScaffolds
} from "../src/shell";

export default function ProviderWebHomePage() {
  return (
    <main className="nh-shell">
      <Surface as="section" aria-labelledby="provider-shell-title" className="nh-shell__header">
        <Stack gap="md">
          <h1 id="provider-shell-title">Provider Web Shell</h1>
          <p>
            This shell is synthetic-only and does not expose protected pharmacy or laboratory
            provider details before payment authorization.
          </p>
          <nav aria-label="Provider shell navigation scaffold">
            <ul className="nh-shell__nav">
              {providerShellNavigation.map((item) => (
                <li key={item} className="nh-shell__nav-item">
                  {item}
                </li>
              ))}
            </ul>
          </nav>
          <Alert tone="info" title="Phase 2 Foundation">
            {`Issue: ${providerShellDescriptor.issue} | App: ${providerShellDescriptor.appId}`}
          </Alert>
          <Alert tone="success" title="Phase 5 Foundation">
            {`Issue: ${providerShellDescriptor.phase5Issue} | State scaffolds: ${providerShellStateScaffolds.length}`}
          </Alert>
        </Stack>
      </Surface>

      <section aria-labelledby="provider-shell-state-title">
        <Stack gap="sm">
          <h2 id="provider-shell-state-title">Provider shell state scaffolds</h2>
          <div className="nh-shell__state-grid">
            {providerShellStateScaffolds.map((state) => (
              <Surface
                key={state.key}
                as="article"
                tone="raised"
                className="nh-shell__state-card"
                aria-label={`Provider shell ${state.title} state`}
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
