/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Accordion } from "./Accordion";

afterEach(cleanup);

const ITEMS = [
  { id: "billing", title: "Billing", content: <p>Billing body</p> },
  { id: "privacy", title: "Privacy", content: <p>Privacy body</p> },
  {
    id: "closed",
    title: "Closed FAQ",
    content: <p>Closed</p>,
    disabled: true
  }
];

describe("Accordion", () => {
  it("renders triggers with aria-expanded and hides panels by default", () => {
    render(<Accordion items={ITEMS} />);
    const billing = screen.getByRole("button", { name: "Billing" });
    expect(billing.getAttribute("aria-expanded")).toBe("false");
    const panel = document.getElementById(billing.getAttribute("aria-controls") ?? "");
    expect(panel?.hasAttribute("hidden")).toBe(true);
  });

  it("expands and collapses in single mode", () => {
    render(<Accordion items={ITEMS} />);
    const billing = screen.getByRole("button", { name: "Billing" });
    fireEvent.click(billing);
    expect(billing.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Billing body")).toBeTruthy();

    const privacy = screen.getByRole("button", { name: "Privacy" });
    fireEvent.click(privacy);
    expect(privacy.getAttribute("aria-expanded")).toBe("true");
    expect(billing.getAttribute("aria-expanded")).toBe("false");
  });

  it("allows multiple open items in multiple mode", () => {
    render(<Accordion items={ITEMS} type="multiple" />);
    const billing = screen.getByRole("button", { name: "Billing" });
    const privacy = screen.getByRole("button", { name: "Privacy" });
    fireEvent.click(billing);
    fireEvent.click(privacy);
    expect(billing.getAttribute("aria-expanded")).toBe("true");
    expect(privacy.getAttribute("aria-expanded")).toBe("true");
  });

  it("does not toggle a disabled item", () => {
    render(<Accordion items={ITEMS} />);
    const closed = screen.getByRole("button", { name: "Closed FAQ" });
    fireEvent.click(closed);
    expect(closed.getAttribute("aria-expanded")).toBe("false");
  });

  it("emits onChange with the open id set", () => {
    const spy = vi.fn();
    render(<Accordion items={ITEMS} onChange={spy} />);
    fireEvent.click(screen.getByRole("button", { name: "Billing" }));
    expect(spy).toHaveBeenCalledWith(["billing"]);
  });
});
