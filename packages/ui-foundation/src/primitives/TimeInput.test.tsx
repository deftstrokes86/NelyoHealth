/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { TimeInput } from "./TimeInput";

afterEach(cleanup);

describe("TimeInput", () => {
  it("renders a native time input", () => {
    render(<TimeInput aria-label="Synthetic appointment time" />);
    const input = screen.getByLabelText("Synthetic appointment time") as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
    expect(input.type).toBe("time");
    expect(input.closest(".nh-input")?.getAttribute("data-primitive")).toBe("time");
  });

  it("sets aria-invalid on the error variant", () => {
    render(<TimeInput aria-label="Synthetic time error" variant="error" />);
    const input = screen.getByLabelText("Synthetic time error");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.closest(".nh-input")?.className).toContain("nh-input--error");
  });

  it("marks the disabled state on both the wrapper and the input", () => {
    render(<TimeInput aria-label="Synthetic disabled time" disabled />);
    const input = screen.getByLabelText("Synthetic disabled time") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.closest(".nh-input")?.className).toContain("nh-input--disabled");
  });

  it("forwards refs to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TimeInput aria-label="Synthetic ref" ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("time");
  });
});
