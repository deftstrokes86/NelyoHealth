import { Alert, Stack, Surface } from "@nelyohealth/ui-foundation";
import { adminShellDescriptor } from "../src/shell";

export default function AdminWebHomePage() {
  return (
    <main>
      <Surface as="section" aria-labelledby="admin-shell-title">
        <Stack gap="md">
          <h1 id="admin-shell-title">Admin Web Shell</h1>
          <p>
            This shell is synthetic-only and does not expose protected pharmacy or
            laboratory provider details before payment authorization.
          </p>
          <Alert tone="info" title="Phase 2 Foundation">
            {`Issue: ${adminShellDescriptor.issue} | App: ${adminShellDescriptor.appId}`}
          </Alert>
        </Stack>
      </Surface>
    </main>
  );
}
