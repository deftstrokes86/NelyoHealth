import { tokenAuditSummary, tokens } from "@nelyohealth/design-tokens";
import { Surface } from "@nelyohealth/ui-foundation";
export const TokenGallery = () => (
  <section className="section" aria-labelledby="tokens-title">
    <h2 id="tokens-title">Token system</h2>
    <div className="token-grid">
      {tokenAuditSummary.map((item) => (
        <Surface key={item.category} tone="raised" className="metric-card">
          <span>{item.category}</span>
          <strong>{item.count}</strong>
        </Surface>
      ))}
    </div>
    <div className="swatches" aria-label="Color swatches">
      {Object.entries(tokens.color)
        .slice(0, 12)
        .map(([name, token]) => (
          <div key={name} className="swatch">
            <span style={{ background: token.value }} aria-hidden="true" />
            <code>{name}</code>
          </div>
        ))}
    </div>
  </section>
);
