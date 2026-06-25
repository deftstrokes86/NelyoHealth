import { syntheticPreviewContent } from "@nelyohealth/content-registry";
import { Alert, Button, SensitiveContentBoundary, Surface } from "@nelyohealth/ui-foundation";
import { syntheticProviderMatch } from "../synthetic-data";
export const ContentAndDisclosure = () => (
  <section className="section" aria-labelledby="content-title">
    <h2 id="content-title">Content registry and provider-disclosure boundary</h2>
    <div className="content-grid">
      {syntheticPreviewContent.map((entry) => (
        <Surface key={entry.id} tone="plain" className="content-card">
          <p className="eyebrow">
            {entry.id} / {entry.status}
          </p>
          <h3>{entry.title}</h3>
          <p>{entry.body}</p>
          {entry.cta ? <Button variant="secondary">{entry.cta}</Button> : null}
        </Surface>
      ))}
    </div>
    <Alert title="Pre-payment provider response" tone="warning">
      Visible before successful payment: {syntheticProviderMatch.providerDisplayName},{" "}
      {syntheticProviderMatch.price}, {syntheticProviderMatch.availability}. Protected location and
      contact details are not rendered, stored, or requested.
    </Alert>
    <SensitiveContentBoundary authorized={false}>
      <span>{syntheticProviderMatch.hiddenDetailSentinel}</span>
    </SensitiveContentBoundary>
  </section>
);
