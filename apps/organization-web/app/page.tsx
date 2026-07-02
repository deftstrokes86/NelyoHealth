import { Alert, Stack, Surface } from "@nelyohealth/ui-foundation";
import {
  organizationShellDescriptor,
  organizationShellNavigation,
  organizationShellStateScaffolds
} from "../src/shell";

export default function OrganizationWebHomePage() {
  return (
    <main className="nh-shell">
      <Surface as="section" aria-labelledby="organization-shell-title" className="nh-shell__header">
        <Stack gap="md">
          <h1 id="organization-shell-title">Organization Web Shell</h1>
          <p>
            This shell is synthetic-only and does not expose protected pharmacy or laboratory
            provider details before payment authorization.
          </p>
          <nav aria-label="Organization shell navigation scaffold">
            <ul className="nh-shell__nav">
              {organizationShellNavigation.map((item) => (
                <li key={item} className="nh-shell__nav-item">
                  {item}
                </li>
              ))}
            </ul>
          </nav>
          <Alert tone="info" title="Phase 2 Foundation">
            {`Issue: ${organizationShellDescriptor.issue} | App: ${organizationShellDescriptor.appId}`}
          </Alert>
          <Alert tone="success" title="Phase 5 Foundation">
            {`Issue: ${organizationShellDescriptor.phase5Issue} | State scaffolds: ${organizationShellStateScaffolds.length}`}
          </Alert>
        </Stack>
      </Surface>

      <section aria-labelledby="organization-shell-state-title">
        <Stack gap="sm">
          <h2 id="organization-shell-state-title">Organization shell state scaffolds</h2>
          <div className="nh-shell__state-grid">
            {organizationShellStateScaffolds.map((state) => (
              <Surface
                key={state.key}
                as="article"
                tone="raised"
                className="nh-shell__state-card"
                aria-label={`Organization shell ${state.title} state`}
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
