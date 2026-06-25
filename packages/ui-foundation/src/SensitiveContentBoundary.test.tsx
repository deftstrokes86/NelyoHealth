/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SensitiveContentBoundary } from "./SensitiveContentBoundary";
describe("SensitiveContentBoundary", () => {
  it("removes unauthorized sensitive content from the DOM rather than hiding it", () => {
    render(
      <SensitiveContentBoundary authorized={false}>
        <span>Pharmacy address sentinel</span>
      </SensitiveContentBoundary>
    );
    expect(screen.queryByText(/Pharmacy address sentinel/i)).toBeNull();
    expect(document.body.innerHTML).not.toMatch(/Pharmacy address sentinel/i);
  });
  it("renders authorized content", () => {
    render(
      <SensitiveContentBoundary authorized>
        <span>Authorized detail</span>
      </SensitiveContentBoundary>
    );
    expect(screen.getByText("Authorized detail")).toBeTruthy();
  });
});
