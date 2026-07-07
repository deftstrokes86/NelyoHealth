/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OtpInput } from "./OtpInput";

afterEach(cleanup);

const ControlledOtp = ({
  initial = "",
  length = 6,
  onChangeSpy
}: {
  initial?: string;
  length?: number;
  onChangeSpy?: (value: string) => void;
}) => {
  const [value, setValue] = useState(initial);
  return (
    <OtpInput
      value={value}
      length={length}
      onChange={(next) => {
        setValue(next);
        onChangeSpy?.(next);
      }}
      aria-label="Synthetic OTP"
    />
  );
};

describe("OtpInput", () => {
  it("renders one cell per digit slot with an accessible group name", () => {
    render(<ControlledOtp length={4} />);
    const group = screen.getByRole("group", { name: "Synthetic OTP" });
    expect(group).toBeTruthy();
    const cells = screen.getAllByLabelText(/Digit \d of 4/);
    expect(cells.length).toBe(4);
  });

  it("accepts a digit and advances focus to the next cell", () => {
    render(<ControlledOtp length={4} />);
    const first = screen.getByLabelText("Digit 1 of 4") as HTMLInputElement;
    first.focus();
    fireEvent.change(first, { target: { value: "3" } });
    const second = screen.getByLabelText("Digit 2 of 4");
    expect(document.activeElement).toBe(second);
  });

  it("ignores non-digit characters", () => {
    const onChangeSpy = vi.fn();
    render(<ControlledOtp length={4} onChangeSpy={onChangeSpy} />);
    const first = screen.getByLabelText("Digit 1 of 4");
    fireEvent.change(first, { target: { value: "a" } });
    expect(onChangeSpy).not.toHaveBeenCalled();
  });

  it("handles paste of a numeric string and distributes across cells", () => {
    render(<ControlledOtp length={6} />);
    const first = screen.getByLabelText("Digit 1 of 6") as HTMLInputElement;
    first.focus();
    fireEvent.paste(first, {
      clipboardData: {
        getData: () => "482910"
      }
    });
    expect((screen.getByLabelText("Digit 1 of 6") as HTMLInputElement).value).toBe("4");
    expect((screen.getByLabelText("Digit 6 of 6") as HTMLInputElement).value).toBe("0");
  });

  it("moves focus backward on Backspace and clears the previous cell when empty", () => {
    render(<ControlledOtp initial="12" length={4} />);
    const third = screen.getByLabelText("Digit 3 of 4") as HTMLInputElement;
    third.focus();
    fireEvent.keyDown(third, { key: "Backspace" });
    const second = screen.getByLabelText("Digit 2 of 4");
    expect(document.activeElement).toBe(second);
  });

  it("supports ArrowLeft/ArrowRight navigation", () => {
    render(<ControlledOtp length={4} />);
    const second = screen.getByLabelText("Digit 2 of 4") as HTMLInputElement;
    second.focus();
    fireEvent.keyDown(second, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(screen.getByLabelText("Digit 1 of 4"));
    const first = screen.getByLabelText("Digit 1 of 4") as HTMLInputElement;
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByLabelText("Digit 2 of 4"));
  });

  it("sets aria-invalid on every cell when the error variant is set", () => {
    render(
      <OtpInput
        value=""
        onChange={() => undefined}
        variant="error"
        aria-label="Synthetic OTP error"
      />
    );
    const cells = screen.getAllByLabelText(/Digit \d of 6/);
    cells.forEach((cell) => expect(cell.getAttribute("aria-invalid")).toBe("true"));
  });
});
