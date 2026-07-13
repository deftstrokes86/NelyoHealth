/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Tooltip } from "./Tooltip";

afterEach(cleanup);

describe("Tooltip", () => {
  it("does not render the tooltip until the trigger is hovered or focused", () => {
    render(
      <Tooltip content="Synthetic hint">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows the tooltip on hover with role=tooltip and links aria-describedby", () => {
    render(
      <Tooltip content="Synthetic hint">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    fireEvent.mouseEnter(trigger);
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.textContent).toBe("Synthetic hint");
    expect(trigger.getAttribute("aria-describedby")).toContain(tooltip.id);
  });

  it("hides the tooltip on mouse leave", () => {
    render(
      <Tooltip content="Synthetic hint">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole("tooltip")).toBeTruthy();
    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows and hides on focus and blur for keyboard users", () => {
    render(
      <Tooltip content="Synthetic hint">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeTruthy();
    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("applies the placement data attribute", () => {
    render(
      <Tooltip content="Synthetic hint" placement="right">
        <button type="button">Trigger</button>
      </Tooltip>
    );
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Trigger" }));
    expect(screen.getByRole("tooltip").getAttribute("data-placement")).toBe(
      "right"
    );
  });
});
