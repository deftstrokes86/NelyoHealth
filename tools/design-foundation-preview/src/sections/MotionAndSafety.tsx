import {
  Alert,
  Button,
  MotionPresence,
  MotionReveal,
  Stack,
  Surface
} from "@nelyohealth/ui-foundation";
import { useState } from "react";
export const MotionAndSafety = () => {
  const [visible, setVisible] = useState(false);
  return (
    <section className="section" aria-labelledby="motion-title">
      <h2 id="motion-title">Motion profiles and safety immediacy</h2>
      <div className="motion-grid">
        <MotionReveal profile="SUBTLE">
          <Surface tone="raised">SUBTLE: orientation and light emphasis</Surface>
        </MotionReveal>
        <MotionReveal profile="STANDARD">
          <Surface tone="raised">STANDARD: default foundation reveal</Surface>
        </MotionReveal>
        <MotionReveal profile="EMPHASIZED">
          <Surface tone="raised">EMPHASIZED: bounded launch moment</Surface>
        </MotionReveal>
      </div>
      <Stack direction="row">
        <Button variant="danger" onClick={() => setVisible((value) => !value)}>
          Toggle emergency panel
        </Button>
      </Stack>
      <MotionPresence present={visible} profile="SAFETY-IMMEDIATE">
        <Alert title="Emergency escalation" tone="danger">
          Emergency escalation remains independent of payment, registration, plan authorization, and
          marketplace comparison.
        </Alert>
      </MotionPresence>
    </section>
  );
};
