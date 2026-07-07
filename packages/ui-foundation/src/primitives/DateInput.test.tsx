/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { DateInput } from "./DateInput";

afterEach(cleanup);

describe("DateInput", () => {
  it("renders a native date input", () => {
    render(<DateInput aria-label="Synthetic date of birth" />);
    const input = screen.getByLabelText("Synthetic date of birth") as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
    expect(input.type).toBe("date");
    expect(input.closest(".nh-input")?.getAttribute("data-primitive")).toBe("date");
  });

  it("sets aria-invalid on the error variant", () => {
    render(<DateInput aria-label="Synthetic date error" variant="error" />);
    const input = screen.getByLabelText("Synthetic date error");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.closest(".nh-input")?.className).toContain("nh-input--error");
  });

  it("marks the disabled state on both the wrapper and the input", () => {
    render(<DateInput aria-label="Synthetic disabled date" disabled />);
    const input = screen.getByLabelText("Synthetic disabled date") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.closest(".nh-input")?.className).toContain("nh-input--disabled");
  });

  it("forwards refs to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<DateInput aria-label="Synthetic ref" ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("date");
  });
});
