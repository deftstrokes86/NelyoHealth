/* @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "./Toast";

afterEach(cleanup);

const Harness = ({ toast }: { toast: Parameters<ReturnType<typeof useToast>["push"]>[0] }) => {
  const { push } = useToast();
  return (
    <button type="button" onClick={() => push(toast)}>
      Notify
    </button>
  );
};

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the notifications region with role=region", () => {
    render(
      <ToastProvider>
        <p>App</p>
      </ToastProvider>
    );
    expect(screen.getByRole("region", { name: "Notifications" })).toBeTruthy();
  });

  it("pushes a toast and renders it with role=status by default", () => {
    render(
      <ToastProvider>
        <Harness toast={{ title: "Saved", description: "Draft saved" }} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    const status = screen.getByRole("status");
    expect(status.textContent).toContain("Saved");
    expect(status.textContent).toContain("Draft saved");
  });

  it("uses role=alert for danger tone", () => {
    render(
      <ToastProvider>
        <Harness toast={{ title: "Failed", tone: "danger" }} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByRole("alert").textContent).toContain("Failed");
  });

  it("auto-dismisses after the configured duration", () => {
    render(
      <ToastProvider defaultDurationMs={2000}>
        <Harness toast={{ title: "Ephemeral" }} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByText("Ephemeral")).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(screen.queryByText("Ephemeral")).toBeNull();
  });

  it("does not auto-dismiss when durationMs is 0", () => {
    render(
      <ToastProvider>
        <Harness toast={{ title: "Persistent", durationMs: 0 }} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.getByText("Persistent")).toBeTruthy();
  });

  it("dismisses via the close button", () => {
    render(
      <ToastProvider>
        <Harness toast={{ title: "Dismissable" }} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Dismissable")).toBeNull();
  });
});
