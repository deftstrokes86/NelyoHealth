import { Field, Stack, Surface } from "@nelyohealth/ui-foundation";
import { syntheticPatient } from "../synthetic-data";
export const ResponsiveAccessibility = () => (
  <section className="section" aria-labelledby="accessibility-title">
    <h2 id="accessibility-title">Responsive and accessibility foundation</h2>
    <div className="responsive-grid">
      <Surface tone="raised">
        <h3>Keyboard and focus</h3>
        <Stack>
          <Field label="Synthetic patient" defaultValue={syntheticPatient.name} />
          <Field label="Synthetic sponsor" defaultValue={syntheticPatient.sponsor} />
        </Stack>
      </Surface>
      <Surface tone="raised">
        <h3>Layouts</h3>
        <p>
          Mobile, tablet, and desktop tests exercise this grid without external assets, fonts, or
          network calls.
        </p>
      </Surface>
      <Surface tone="raised">
        <h3>Reduced motion</h3>
        <p>
          Motion profiles respect user reduced-motion preferences and safety-critical states use
          immediate transitions.
        </p>
      </Surface>
    </div>
  </section>
);
