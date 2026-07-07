/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Checkbox } from "./Checkbox";

afterEach(cleanup);

describe("Checkbox", () => {
  it("renders a native checkbox with default variant", () => {
    render(<Checkbox aria-label="Synthetic consent" />);
    const input = screen.getByRole("checkbox", { name: "Synthetic consent" });
    expect(input.tagName).toBe("INPUT");
    expect((input as HTMLInputElement).type).toBe("checkbox");
    expect(input.closest(".nh-checkbox")?.getAttribute("data-variant")).toBe("default");
  });

  it("renders inline label text when children are provided", () => {
    render(<Checkbox>Remember this browser</Checkbox>);
    const input = screen.getByRole("checkbox", { name: "Remember this browser" });
    expect(input.closest("label")?.textContent).toContain("Remember this browser");
  });

  it("sets aria-invalid on the error variant", () => {
    render(<Checkbox aria-label="Synthetic terms" variant="error" />);
    const input = screen.getByRole("checkbox", { name: "Synthetic terms" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.closest(".nh-checkbox")?.className).toContain("nh-checkbox--error");
  });

  it("marks the disabled state on both the wrapper and the input", () => {
    render(<Checkbox aria-label="Synthetic disabled" disabled />);
    const input = screen.getByRole("checkbox", { name: "Synthetic disabled" });
    expect((input as HTMLInputElement).disabled).toBe(true);
    expect(input.closest(".nh-checkbox")?.className).toContain("nh-checkbox--disabled");
  });

  it("applies indeterminate DOM state when the prop is set", () => {
    render(<Checkbox aria-label="Synthetic indeterminate" indeterminate />);
    const input = screen.getByRole("checkbox", { name: "Synthetic indeterminate" });
    expect((input as HTMLInputElement).indeterminate).toBe(true);
  });

  it("does not set indeterminate when the prop is false", () => {
    render(<Checkbox aria-label="Synthetic determinate" />);
    const input = screen.getByRole("checkbox", { name: "Synthetic determinate" });
    expect((input as HTMLInputElement).indeterminate).toBe(false);
  });

  it("forwards refs to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox aria-label="Synthetic ref" ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("checkbox");
  });

  it("hides the visual indicator from assistive tech", () => {
    render(<Checkbox aria-label="Synthetic hidden indicator" />);
    const indicator = screen
      .getByRole("checkbox", { name: "Synthetic hidden indicator" })
      .closest(".nh-checkbox")
      ?.querySelector(".nh-checkbox__indicator");
    expect(indicator?.getAttribute("aria-hidden")).toBe("true");
  });
});
