/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HelperText } from "./HelperText";

afterEach(cleanup);

describe("HelperText", () => {
  it("renders helper text with the required id for aria-describedby linkage", () => {
    render(<HelperText id="helper-1">Use your work email if you have one.</HelperText>);
    const p = screen.getByText("Use your work email if you have one.");
    expect(p.tagName).toBe("P");
    expect(p.id).toBe("helper-1");
    expect(p.className).toContain("nh-helper-text");
  });

  it("does not carry any assertive live-region role", () => {
    render(<HelperText id="helper-2">Optional context.</HelperText>);
    const p = screen.getByText("Optional context.");
    expect(p.getAttribute("role")).toBeNull();
    expect(p.getAttribute("aria-live")).toBeNull();
  });
});
