import { Alert, Stack, Surface } from "@nelyohealth/ui-foundation";
import { patientShellDescriptor } from "../src/shell";

export default function PatientWebHomePage() {
  return (
    <main>
      <Surface as="section" aria-labelledby="patient-shell-title">
        <Stack gap="md">
          <h1 id="patient-shell-title">Patient Web Shell</h1>
          <p>
            This shell is synthetic-only and does not expose protected pharmacy or laboratory
            provider details before payment authorization.
          </p>
          <Alert tone="info" title="Phase 2 Foundation">
            {`Issue: ${patientShellDescriptor.issue} | App: ${patientShellDescriptor.appId}`}
          </Alert>
        </Stack>
      </Surface>
    </main>
  );
}
