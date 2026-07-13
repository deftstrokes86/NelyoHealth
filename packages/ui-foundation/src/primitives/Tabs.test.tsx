/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

afterEach(cleanup);

const TABS = [
  { id: "overview", label: "Overview", content: <p>Overview body</p> },
  { id: "history", label: "History", content: <p>History body</p> },
  {
    id: "coming",
    label: "Coming soon",
    content: <p>Later</p>,
    disabled: true
  },
  { id: "billing", label: "Billing", content: <p>Billing body</p> }
];

describe("Tabs", () => {
  it("renders a tablist with role=tab items and a role=tabpanel for the selected tab", () => {
    render(<Tabs tabs={TABS} label="Synthetic sections" />);
    expect(
      screen.getByRole("tablist", { name: "Synthetic sections" })
    ).toBeTruthy();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(4);
    expect(screen.getByRole("tabpanel").textContent).toContain("Overview body");
  });

  it("selects the default first non-disabled tab", () => {
    render(<Tabs tabs={TABS} label="Synthetic sections" />);
    const first = screen.getByRole("tab", { name: "Overview" });
    expect(first.getAttribute("aria-selected")).toBe("true");
    expect(first.getAttribute("tabindex")).toBe("0");
  });

  it("switches tab on click", () => {
    render(<Tabs tabs={TABS} label="Synthetic sections" />);
    fireEvent.click(screen.getByRole("tab", { name: "History" }));
    expect(screen.getByRole("tab", { name: "History" }).getAttribute("aria-selected")).toBe(
      "true"
    );
    expect(screen.getByRole("tabpanel").textContent).toContain("History body");
  });

  it("navigates with ArrowRight and skips disabled tabs", () => {
    render(<Tabs tabs={TABS} label="Synthetic sections" />);
    const first = screen.getByRole("tab", { name: "Overview" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "History" }).getAttribute("aria-selected")).toBe(
      "true"
    );
    const history = screen.getByRole("tab", { name: "History" });
    fireEvent.keyDown(history, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Billing" }).getAttribute("aria-selected")).toBe(
      "true"
    );
  });

  it("Home and End jump to first/last enabled tabs", () => {
    render(<Tabs tabs={TABS} label="Synthetic sections" defaultValue="billing" />);
    const billing = screen.getByRole("tab", { name: "Billing" });
    billing.focus();
    fireEvent.keyDown(billing, { key: "Home" });
    expect(screen.getByRole("tab", { name: "Overview" }).getAttribute("aria-selected")).toBe(
      "true"
    );
    fireEvent.keyDown(
      screen.getByRole("tab", { name: "Overview" }),
      { key: "End" }
    );
    expect(screen.getByRole("tab", { name: "Billing" }).getAttribute("aria-selected")).toBe(
      "true"
    );
  });

  it("supports controlled mode via value + onChange", () => {
    const spy = vi.fn();
    render(
      <Tabs tabs={TABS} label="Synthetic sections" value="history" onChange={spy} />
    );
    fireEvent.click(screen.getByRole("tab", { name: "Billing" }));
    expect(spy).toHaveBeenCalledWith("billing");
  });
});
