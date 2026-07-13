/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Popover } from "./Popover";

afterEach(cleanup);

describe("Popover", () => {
  it("renders only the trigger initially", () => {
    render(
      <Popover
        trigger={(props) => (
          <button type="button" {...props}>
            Details
          </button>
        )}
      >
        <p>Popover body</p>
      </Popover>
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens on click and marks the trigger expanded", () => {
    render(
      <Popover
        trigger={(props) => (
          <button type="button" {...props}>
            Details
          </button>
        )}
      >
        <p>Popover body</p>
      </Popover>
    );
    const trigger = screen.getByRole("button", { name: "Details" });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("closes on Escape", () => {
    render(
      <Popover
        trigger={(props) => (
          <button type="button" {...props}>
            Details
          </button>
        )}
      >
        <p>Popover body</p>
      </Popover>
    );
    fireEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on outside mousedown", () => {
    render(
      <div>
        <Popover
          trigger={(props) => (
            <button type="button" {...props}>
              Details
            </button>
          )}
        >
          <p>Popover body</p>
        </Popover>
        <button type="button">Outside</button>
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("supports controlled mode via open + onOpenChange", () => {
    const spy = vi.fn();
    render(
      <Popover
        open
        onOpenChange={spy}
        trigger={(props) => (
          <button type="button" {...props}>
            Details
          </button>
        )}
      >
        <p>Popover body</p>
      </Popover>
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(spy).toHaveBeenCalledWith(false);
  });
});
