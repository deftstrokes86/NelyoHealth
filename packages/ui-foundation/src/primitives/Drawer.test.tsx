/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Drawer } from "./Drawer";

afterEach(cleanup);

const Harness = ({
  initialOpen = true,
  closeSpy
}: {
  initialOpen?: boolean;
  closeSpy?: () => void;
}) => {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <button type="button" data-testid="outside">
        Outside
      </button>
      <Drawer
        open={open}
        onClose={() => {
          closeSpy?.();
          setOpen(false);
        }}
        title="Synthetic drawer"
      >
        <button type="button">Inside primary</button>
        <button type="button">Inside secondary</button>
      </Drawer>
    </div>
  );
};

describe("Drawer", () => {
  it("does not render when closed", () => {
    render(<Harness initialOpen={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders as a modal dialog with the passed title as accessible name", () => {
    render(<Harness />);
    const dialog = screen.getByRole("dialog", { name: "Synthetic drawer" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("data-side")).toBe("right");
  });

  it("closes on Escape", () => {
    const spy = vi.fn();
    render(<Harness closeSpy={spy} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on outside mousedown when dismissOnBackdropClick is enabled", () => {
    render(<Harness />);
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("focuses the first focusable element in the panel when opened", () => {
    render(<Harness />);
    const first = screen.getByRole("button", { name: "Inside primary" });
    expect(document.activeElement).toBe(first);
  });
});
