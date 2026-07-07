/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Input } from "./Input";

afterEach(cleanup);

describe("Input", () => {
  it("renders a text input with tokenized styling and default variant", () => {
    render(<Input aria-label="Synthetic search" placeholder="Search patients" />);
    const input = screen.getByRole("textbox", { name: "Synthetic search" });
    expect(input.tagName).toBe("INPUT");
    expect(input.closest(".nh-input")?.getAttribute("data-variant")).toBe("default");
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("sets aria-invalid when variant is error", () => {
    render(<Input aria-label="Synthetic email" variant="error" />);
    const input = screen.getByRole("textbox", { name: "Synthetic email" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.closest(".nh-input")?.className).toContain("nh-input--error");
  });

  it("marks the success variant on the wrapper without aria-invalid", () => {
    render(<Input aria-label="Synthetic phone" variant="success" />);
    const input = screen.getByRole("textbox", { name: "Synthetic phone" });
    expect(input.getAttribute("aria-invalid")).toBeNull();
    expect(input.closest(".nh-input")?.className).toContain("nh-input--success");
  });

  it("marks the disabled state on both the wrapper and the input", () => {
    render(<Input aria-label="Synthetic disabled" disabled />);
    const input = screen.getByRole("textbox", { name: "Synthetic disabled" });
    expect((input as HTMLInputElement).disabled).toBe(true);
    expect(input.closest(".nh-input")?.className).toContain("nh-input--disabled");
  });

  it("renders leading and trailing slots as decorative (aria-hidden)", () => {
    render(
      <Input
        aria-label="Synthetic amount"
        leading={<span data-testid="leading">₦</span>}
        trailing={<span data-testid="trailing">.00</span>}
      />
    );
    const leading = screen.getByTestId("leading");
    const trailing = screen.getByTestId("trailing");
    expect(leading.closest(".nh-input__leading")?.getAttribute("aria-hidden")).toBe("true");
    expect(trailing.closest(".nh-input__trailing")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("forwards refs to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Synthetic ref" ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
  });
});
