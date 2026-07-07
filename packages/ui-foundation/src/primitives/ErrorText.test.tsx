/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ErrorText } from "./ErrorText";

afterEach(cleanup);

describe("ErrorText", () => {
  it("renders as a polite live region so validation changes announce", () => {
    render(<ErrorText id="err-1">Please enter a valid synthetic email.</ErrorText>);
    const p = screen.getByRole("alert");
    expect(p.getAttribute("aria-live")).toBe("polite");
    expect(p.id).toBe("err-1");
    expect(p.textContent).toBe("Please enter a valid synthetic email.");
  });

  it("preserves base class alongside consumer className", () => {
    render(
      <ErrorText id="err-2" className="mt-2">
        Field is required.
      </ErrorText>
    );
    const p = screen.getByRole("alert");
    expect(p.className).toContain("nh-error-text");
    expect(p.className).toContain("mt-2");
  });
});
