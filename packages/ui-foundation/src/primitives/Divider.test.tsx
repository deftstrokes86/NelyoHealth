/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Divider } from "./Divider";

afterEach(cleanup);

describe("Divider", () => {
  it("renders as decorative (aria-hidden, no role) when no label is provided", () => {
    render(<Divider data-testid="divider" />);
    const divider = screen.getByTestId("divider");
    expect(divider.getAttribute("aria-hidden")).toBe("true");
    expect(divider.getAttribute("role")).toBeNull();
    expect(divider.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("renders as a semantic separator when a label is provided", () => {
    render(<Divider>OR</Divider>);
    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
    expect(separator.textContent).toContain("OR");
  });

  it("supports vertical orientation", () => {
    render(<Divider orientation="vertical" data-testid="divider" />);
    const divider = screen.getByTestId("divider");
    expect(divider.getAttribute("data-orientation")).toBe("vertical");
    expect(divider.className).toContain("nh-divider--vertical");
  });
});
