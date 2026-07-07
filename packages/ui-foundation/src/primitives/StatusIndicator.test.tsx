/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StatusIndicator } from "./StatusIndicator";

afterEach(cleanup);

describe("StatusIndicator", () => {
  it("renders with role=status and polite live region by default", () => {
    render(<StatusIndicator>Connected</StatusIndicator>);
    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toBe("Connected");
    expect(status.getAttribute("data-tone")).toBe("neutral");
  });

  it("applies tone data attribute and class", () => {
    render(<StatusIndicator tone="emergency">Escalated</StatusIndicator>);
    const status = screen.getByRole("status");
    expect(status.className).toContain("nh-status--emergency");
    expect(status.getAttribute("data-tone")).toBe("emergency");
  });

  it("enables pulse animation via className flag when pulse=true", () => {
    render(
      <StatusIndicator tone="warning" pulse>
        Retrying
      </StatusIndicator>
    );
    expect(screen.getByRole("status").className).toContain("nh-status--pulse");
  });

  it("omits aria-live when live=off (still exposes role=status)", () => {
    render(<StatusIndicator live="off">Idle</StatusIndicator>);
    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-live")).toBeNull();
  });

  it("hides the dot from assistive tech", () => {
    render(<StatusIndicator>Loading</StatusIndicator>);
    const dot = screen.getByRole("status").querySelector(".nh-status__dot");
    expect(dot?.getAttribute("aria-hidden")).toBe("true");
  });
});
