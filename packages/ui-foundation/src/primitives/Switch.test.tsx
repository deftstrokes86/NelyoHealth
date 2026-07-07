/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Switch } from "./Switch";

afterEach(cleanup);

describe("Switch", () => {
  it("renders with role=switch and default variant", () => {
    render(<Switch aria-label="Synthetic notifications" />);
    const control = screen.getByRole("switch", { name: "Synthetic notifications" });
    expect(control.tagName).toBe("INPUT");
    expect((control as HTMLInputElement).type).toBe("checkbox");
    expect(control.closest(".nh-switch")?.getAttribute("data-variant")).toBe("default");
  });

  it("renders inline label text when children are provided", () => {
    render(<Switch>Enable dark mode</Switch>);
    const control = screen.getByRole("switch", { name: "Enable dark mode" });
    expect(control.closest("label")?.textContent).toContain("Enable dark mode");
  });

  it("sets aria-invalid on the error variant", () => {
    render(<Switch aria-label="Synthetic error switch" variant="error" />);
    const control = screen.getByRole("switch", { name: "Synthetic error switch" });
    expect(control.getAttribute("aria-invalid")).toBe("true");
    expect(control.closest(".nh-switch")?.className).toContain("nh-switch--error");
  });

  it("marks the disabled state on both the wrapper and the input", () => {
    render(<Switch aria-label="Synthetic disabled switch" disabled />);
    const control = screen.getByRole("switch", { name: "Synthetic disabled switch" });
    expect((control as HTMLInputElement).disabled).toBe(true);
    expect(control.closest(".nh-switch")?.className).toContain("nh-switch--disabled");
  });

  it("reflects checked state through defaultChecked", () => {
    render(<Switch aria-label="Synthetic checked switch" defaultChecked />);
    const control = screen.getByRole("switch", {
      name: "Synthetic checked switch"
    }) as HTMLInputElement;
    expect(control.checked).toBe(true);
  });

  it("hides the visual track from assistive tech", () => {
    render(<Switch aria-label="Synthetic hidden track" />);
    const track = screen
      .getByRole("switch", { name: "Synthetic hidden track" })
      .closest(".nh-switch")
      ?.querySelector(".nh-switch__track");
    expect(track?.getAttribute("aria-hidden")).toBe("true");
  });

  it("forwards refs to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch aria-label="Synthetic ref" ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("checkbox");
  });
});
