/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

afterEach(cleanup);

describe("Textarea", () => {
  it("renders a textarea with default variant and configurable rows", () => {
    render(<Textarea aria-label="Synthetic notes" rows={6} />);
    const textarea = screen.getByRole("textbox", { name: "Synthetic notes" });
    expect(textarea.tagName).toBe("TEXTAREA");
    expect((textarea as HTMLTextAreaElement).rows).toBe(6);
    expect(textarea.getAttribute("data-variant")).toBe("default");
  });

  it("defaults rows to 4 when not specified", () => {
    render(<Textarea aria-label="Synthetic notes default rows" />);
    const textarea = screen.getByRole("textbox", { name: "Synthetic notes default rows" });
    expect((textarea as HTMLTextAreaElement).rows).toBe(4);
  });

  it("sets aria-invalid for the error variant", () => {
    render(<Textarea aria-label="Synthetic notes error" variant="error" />);
    const textarea = screen.getByRole("textbox", { name: "Synthetic notes error" });
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect(textarea.className).toContain("nh-textarea--error");
  });

  it("marks the success variant without aria-invalid", () => {
    render(<Textarea aria-label="Synthetic notes success" variant="success" />);
    const textarea = screen.getByRole("textbox", { name: "Synthetic notes success" });
    expect(textarea.getAttribute("aria-invalid")).toBeNull();
    expect(textarea.className).toContain("nh-textarea--success");
  });

  it("marks the disabled state on the element", () => {
    render(<Textarea aria-label="Synthetic notes disabled" disabled />);
    const textarea = screen.getByRole("textbox", { name: "Synthetic notes disabled" });
    expect((textarea as HTMLTextAreaElement).disabled).toBe(true);
    expect(textarea.className).toContain("nh-textarea--disabled");
  });

  it("forwards refs to the underlying textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Synthetic ref" ref={ref} />);
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });
});
