/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Label } from "./Label";

afterEach(cleanup);

describe("Label", () => {
  it("renders label text with htmlFor association", () => {
    render(<Label htmlFor="synthetic-input">Synthetic patient name</Label>);
    const label = screen.getByText("Synthetic patient name");
    expect(label.closest("label")?.getAttribute("for")).toBe("synthetic-input");
  });

  it("does not render the required marker by default", () => {
    render(<Label htmlFor="opt">Synthetic email</Label>);
    expect(screen.queryByText("(required)")).toBeNull();
    expect(document.querySelector(".nh-label__required")).toBeNull();
  });

  it("marks required labels with visible marker and screen-reader text", () => {
    render(
      <Label htmlFor="required-field" required>
        Synthetic phone
      </Label>
    );
    expect(screen.getByText("*", { selector: ".nh-label__required" })).toBeTruthy();
    expect(screen.getByText(/\(required\)/)).toBeTruthy();
  });

  it("hides the required marker glyph from assistive tech", () => {
    render(
      <Label htmlFor="required-field" required>
        Synthetic phone
      </Label>
    );
    const marker = screen.getByText("*", { selector: ".nh-label__required" });
    expect(marker.getAttribute("aria-hidden")).toBe("true");
  });

  it("passes through custom className without discarding base class", () => {
    render(
      <Label htmlFor="c" className="custom">
        Synthetic address
      </Label>
    );
    const label = screen.getByText("Synthetic address").closest("label");
    expect(label?.className).toContain("nh-label");
    expect(label?.className).toContain("custom");
  });

  it("supports a custom required marker glyph", () => {
    render(
      <Label htmlFor="custom-marker" required requiredMarker="●">
        Synthetic dob
      </Label>
    );
    expect(screen.getByText("●", { selector: ".nh-label__required" })).toBeTruthy();
  });
});
