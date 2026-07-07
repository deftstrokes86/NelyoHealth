/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { FileInput } from "./FileInput";

afterEach(cleanup);

describe("FileInput", () => {
  it("renders a native file input with visible button label", () => {
    render(<FileInput aria-label="Synthetic upload" />);
    const input = screen.getByLabelText("Synthetic upload") as HTMLInputElement;
    expect(input.tagName).toBe("INPUT");
    expect(input.type).toBe("file");
    expect(screen.getByText("Choose file")).toBeTruthy();
  });

  it("associates the button label with the input via htmlFor", () => {
    render(<FileInput aria-label="Synthetic upload htmlFor" id="upload-1" />);
    const button = screen
      .getByText("Choose file")
      .closest("label") as HTMLLabelElement;
    expect(button.htmlFor).toBe("upload-1");
  });

  it("supports a custom button label and helper text", () => {
    render(
      <FileInput
        aria-label="Synthetic upload custom"
        buttonLabel="Upload document"
        helperText="Accepted formats: pdf, jpg"
      />
    );
    expect(screen.getByText("Upload document")).toBeTruthy();
    expect(screen.getByText("Accepted formats: pdf, jpg")).toBeTruthy();
  });

  it("sets aria-invalid on the error variant", () => {
    render(<FileInput aria-label="Synthetic file error" variant="error" />);
    const input = screen.getByLabelText("Synthetic file error");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.closest(".nh-file")?.className).toContain("nh-file--error");
  });

  it("marks the disabled state on the wrapper and input", () => {
    render(<FileInput aria-label="Synthetic file disabled" disabled />);
    const input = screen.getByLabelText("Synthetic file disabled") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.closest(".nh-file")?.className).toContain("nh-file--disabled");
  });

  it("announces helper text via aria-live polite", () => {
    render(
      <FileInput aria-label="Synthetic upload live" helperText="No file chosen" />
    );
    const helper = screen.getByText("No file chosen");
    expect(helper.getAttribute("aria-live")).toBe("polite");
  });

  it("forwards refs to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileInput aria-label="Synthetic ref" ref={ref} />);
    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("file");
  });
});
