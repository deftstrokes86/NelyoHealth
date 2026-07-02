import { Alert, Stack, Surface } from "@nelyohealth/ui-foundation";
import { CalendarClock } from "lucide-react";
import { Button } from "../src/components/ui/button";
import { MotionShell } from "../src/components/ui/motion-shell";
import {
  patientShellDescriptor,
  patientShellNavigation,
  patientShellStateScaffolds
} from "../src/shell";

export default function PatientWebHomePage() {
  return (
    <MotionShell>
      <main className="nh-shell">
        <Surface as="section" aria-labelledby="patient-shell-title" className="nh-shell__header">
          <Stack gap="md">
            <h1 id="patient-shell-title">Patient Web Shell</h1>
            <p>
              This shell is synthetic-only and does not expose protected pharmacy or laboratory
              provider details before payment authorization.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">
                <CalendarClock className="mr-2 h-4 w-4" aria-hidden="true" />
                Continue Care Workflow
              </Button>
              <Button variant="secondary">Review Current Status</Button>
            </div>
            <nav aria-label="Patient shell navigation scaffold">
              <ul className="nh-shell__nav">
                {patientShellNavigation.map((item) => (
                  <li key={item} className="nh-shell__nav-item">
                    {item}
                  </li>
                ))}
              </ul>
            </nav>
            <Alert tone="info" title="Phase 2 Foundation">
              {`Issue: ${patientShellDescriptor.issue} | App: ${patientShellDescriptor.appId}`}
            </Alert>
            <Alert tone="success" title="Phase 5 Foundation">
              {`Issue: ${patientShellDescriptor.phase5Issue} | State scaffolds: ${patientShellStateScaffolds.length}`}
            </Alert>
          </Stack>
        </Surface>

        <section aria-labelledby="patient-shell-state-title">
          <Stack gap="sm">
            <h2 id="patient-shell-state-title">Patient shell state scaffolds</h2>
            <div className="nh-shell__state-grid">
              {patientShellStateScaffolds.map((state) => (
                <Surface
                  key={state.key}
                  as="article"
                  tone="raised"
                  className="nh-shell__state-card"
                  aria-label={`Patient shell ${state.title} state`}
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
    </MotionShell>
  );
}
