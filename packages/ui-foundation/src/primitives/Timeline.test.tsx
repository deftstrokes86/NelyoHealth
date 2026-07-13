/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Timeline } from "./Timeline";

afterEach(cleanup);

const STEPS = [
  {
    id: "intake",
    title: "Intake",
    description: "Concerns captured",
    status: "complete" as const,
    timestamp: "09:12"
  },
  {
    id: "consult",
    title: "Consultation",
    description: "In progress",
    status: "current" as const
  },
  {
    id: "prescription",
    title: "Prescription",
    status: "upcoming" as const
  }
];

describe("Timeline", () => {
  it("renders an ordered list with an accessible label", () => {
    render(<Timeline steps={STEPS} label="Care progress" />);
    const list = screen.getByRole("list", { name: "Care progress" });
    expect(list.tagName).toBe("OL");
    expect(list.getAttribute("data-orientation")).toBe("vertical");
  });

  it("renders each step with a status data attribute", () => {
    render(<Timeline steps={STEPS} />);
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(3);
    expect(items[0].getAttribute("data-status")).toBe("complete");
    expect(items[1].getAttribute("data-status")).toBe("current");
    expect(items[2].getAttribute("data-status")).toBe("upcoming");
  });

  it("marks the current step with aria-current=step", () => {
    render(<Timeline steps={STEPS} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0].getAttribute("aria-current")).toBeNull();
    expect(items[1].getAttribute("aria-current")).toBe("step");
    expect(items[2].getAttribute("aria-current")).toBeNull();
  });

  it("renders titles, descriptions, and timestamps when provided", () => {
    render(<Timeline steps={STEPS} />);
    expect(screen.getByText("Intake")).toBeTruthy();
    expect(screen.getByText("Concerns captured")).toBeTruthy();
    expect(screen.getByText("09:12")).toBeTruthy();
  });

  it("supports horizontal orientation", () => {
    render(<Timeline steps={STEPS} orientation="horizontal" />);
    const list = screen.getByRole("list");
    expect(list.className).toContain("nh-timeline--horizontal");
    expect(list.getAttribute("data-orientation")).toBe("horizontal");
  });
});
