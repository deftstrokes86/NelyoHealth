/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Progress } from "./Progress";

afterEach(cleanup);

describe("Progress", () => {
  it("renders as a determinate progressbar when value is provided", () => {
    render(<Progress value={40} label="Synthetic upload" />);
    const bar = screen.getByRole("progressbar", { name: "Synthetic upload" });
    expect(bar.getAttribute("aria-valuenow")).toBe("40");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("supports a custom max value", () => {
    render(<Progress value={5} max={10} label="Synthetic steps" />);
    const bar = screen.getByRole("progressbar", { name: "Synthetic steps" });
    expect(bar.getAttribute("aria-valuenow")).toBe("5");
    expect(bar.getAttribute("aria-valuemax")).toBe("10");
  });

  it("clamps values above max and below zero", () => {
    render(<Progress value={999} max={100} label="Synthetic overshoot" />);
    const bar = screen.getByRole("progressbar", { name: "Synthetic overshoot" });
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
  });

  it("renders indeterminate progressbar when value is undefined", () => {
    render(<Progress label="Synthetic indeterminate" />);
    const bar = screen.getByRole("progressbar", { name: "Synthetic indeterminate" });
    expect(bar.getAttribute("aria-valuenow")).toBeNull();
    expect(bar.className).toContain("nh-progress--indeterminate");
  });

  it("applies tone class", () => {
    render(<Progress value={20} tone="danger" label="Synthetic danger" />);
    const bar = screen.getByRole("progressbar", { name: "Synthetic danger" });
    expect(bar.className).toContain("nh-progress--danger");
  });

  it("hides the bar element from assistive tech", () => {
    render(<Progress value={20} label="Synthetic hidden bar" />);
    const inner = screen
      .getByRole("progressbar", { name: "Synthetic hidden bar" })
      .querySelector(".nh-progress__bar");
    expect(inner?.getAttribute("aria-hidden")).toBe("true");
  });
});
