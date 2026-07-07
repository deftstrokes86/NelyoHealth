/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

afterEach(cleanup);

describe("Spinner", () => {
  it("renders with role=status and default label", () => {
    render(<Spinner />);
    const status = screen.getByRole("status", { name: "Loading" });
    expect(status.getAttribute("aria-busy")).toBe("true");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.getAttribute("data-size")).toBe("md");
  });

  it("supports a custom accessible label", () => {
    render(<Spinner label="Fetching appointments" />);
    const status = screen.getByRole("status", { name: "Fetching appointments" });
    expect(status).toBeTruthy();
  });

  it("applies size variant", () => {
    render(<Spinner size="lg" label="Slow load" />);
    const status = screen.getByRole("status", { name: "Slow load" });
    expect(status.getAttribute("data-size")).toBe("lg");
    expect(status.className).toContain("nh-spinner--lg");
  });

  it("hides the ring from assistive tech", () => {
    render(<Spinner label="Loading records" />);
    const ring = screen
      .getByRole("status", { name: "Loading records" })
      .querySelector(".nh-spinner__ring");
    expect(ring?.getAttribute("aria-hidden")).toBe("true");
  });
});
