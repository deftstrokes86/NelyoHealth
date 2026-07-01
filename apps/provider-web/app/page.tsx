import { Alert, Stack, Surface } from "@nelyohealth/ui-foundation";
import { providerShellDescriptor } from "../src/shell";

export default function ProviderWebHomePage() {
  return (
    <main>
      <Surface as="section" aria-labelledby="provider-shell-title">
        <Stack gap="md">
          <h1 id="provider-shell-title">Provider Web Shell</h1>
          <p>
            This shell is synthetic-only and does not expose protected pharmacy or laboratory
            provider details before payment authorization.
          </p>
          <Alert tone="info" title="Phase 2 Foundation">
            {`Issue: ${providerShellDescriptor.issue} | App: ${providerShellDescriptor.appId}`}
          </Alert>
        </Stack>
      </Surface>
    </main>
  );
}
