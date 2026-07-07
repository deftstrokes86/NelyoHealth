/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge } from "./Badge";

afterEach(cleanup);

describe("Badge", () => {
  it("renders a span with the default tone and size", () => {
    render(<Badge>Active</Badge>);
    const label = screen.getByText("Active");
    const badge = label.closest(".nh-badge");
    expect(badge?.getAttribute("data-tone")).toBe("neutral");
    expect(badge?.getAttribute("data-size")).toBe("md");
  });

  it("applies tone and size variants", () => {
    render(
      <Badge tone="danger" size="sm">
        Critical
      </Badge>
    );
    const badge = screen.getByText("Critical").closest(".nh-badge");
    expect(badge?.className).toContain("nh-badge--danger");
    expect(badge?.className).toContain("nh-badge--sm");
  });

  it("hides the leading icon from assistive tech", () => {
    render(
      <Badge leadingIcon={<span data-testid="icon">●</span>}>Warning</Badge>
    );
    const icon = screen.getByTestId("icon");
    expect(icon.closest(".nh-badge__icon")?.getAttribute("aria-hidden")).toBe(
      "true"
    );
  });
});
