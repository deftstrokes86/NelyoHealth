/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

afterEach(cleanup);

describe("Skeleton", () => {
  it("renders a single text-shaped skeleton by default with role=status", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.getAttribute("role")).toBe("status");
    expect(skeleton.getAttribute("aria-busy")).toBe("true");
    expect(skeleton.getAttribute("data-shape")).toBe("text");
  });

  it("renders a multi-line text block when lines > 1", () => {
    render(<Skeleton lines={3} data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    const lines = skeleton.querySelectorAll(".nh-skeleton__line");
    expect(lines.length).toBe(3);
  });

  it("applies the circle shape class", () => {
    render(<Skeleton shape="circle" data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toContain("nh-skeleton--circle");
    expect(skeleton.getAttribute("data-shape")).toBe("circle");
  });

  it("passes numeric width/height through as pixel dimensions", () => {
    render(
      <Skeleton
        shape="rect"
        width={120}
        height={40}
        data-testid="skeleton"
      />
    );
    const skeleton = screen.getByTestId("skeleton") as HTMLElement;
    expect(skeleton.style.width).toBe("120px");
    expect(skeleton.style.height).toBe("40px");
  });
});
