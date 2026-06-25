/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, Button, Field, Stack, Surface } from "./index";
describe("UI primitives", () => {
  it("renders accessible primitives with labels and roles", () => {
    render(
      <Stack>
        <Button>Continue</Button>
        <Field label="Synthetic patient name" />
        <Alert tone="danger" title="Emergency">
          Immediate escalation remains available.
        </Alert>
        <Surface aria-label="Foundation surface">Surface</Surface>
      </Stack>
    );
    expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
    expect(screen.getByLabelText("Synthetic patient name")).toBeTruthy();
    expect(screen.getByRole("alert", { name: "Emergency" })).toBeTruthy();
    expect(screen.getByLabelText("Foundation surface")).toBeTruthy();
  });
});
