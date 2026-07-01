import { Alert, Stack, Surface } from "@nelyohealth/ui-foundation";
import { organizationShellDescriptor } from "../src/shell";

export default function OrganizationWebHomePage() {
  return (
    <main>
      <Surface as="section" aria-labelledby="organization-shell-title">
        <Stack gap="md">
          <h1 id="organization-shell-title">Organization Web Shell</h1>
          <p>
            This shell is synthetic-only and does not expose protected pharmacy or laboratory
            provider details before payment authorization.
          </p>
          <Alert tone="info" title="Phase 2 Foundation">
            {`Issue: ${organizationShellDescriptor.issue} | App: ${organizationShellDescriptor.appId}`}
          </Alert>
        </Stack>
      </Surface>
    </main>
  );
}
