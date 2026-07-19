/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { PasswordInput } from "./PasswordInput";

afterEach(cleanup);

function ControlledPasswordInput(props: { showStrength?: boolean }) {
  const [value, setValue] = useState("");
  return (
    <PasswordInput
      label="Password"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      showStrength={props.showStrength}
    />
  );
}

describe("PasswordInput", () => {
  it("renders as a password field by default", () => {
    render(<ControlledPasswordInput />);
    const input = screen.getByLabelText("Password");
    expect((input as HTMLInputElement).type).toBe("password");
  });

  it("toggles to plain text when the show/hide button is clicked", () => {
    render(<ControlledPasswordInput />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    const toggle = screen.getByRole("button", { name: "Show password" });

    fireEvent.click(toggle);
    expect(input.type).toBe("text");
    expect(screen.getByRole("button", { name: "Hide password" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input.type).toBe("password");
  });

  it("does not render a strength meter when showStrength is false", () => {
    render(<ControlledPasswordInput />);
    const input = screen.getByLabelText("Password");
    fireEvent.change(input, { target: { value: "whatever123" } });
    expect(screen.queryByText(/Password strength/)).toBeNull();
  });

  it("renders and updates the strength meter as the user types", () => {
    render(<ControlledPasswordInput showStrength />);
    const input = screen.getByLabelText("Password");

    fireEvent.change(input, { target: { value: "a" } });
    expect(screen.getByText("Weak")).toBeTruthy();

    fireEvent.change(input, { target: { value: "Correct-Horse-Battery-9!" } });
    expect(screen.getByText("Strong")).toBeTruthy();
  });

  it("shows no strength meter for an empty value even with showStrength enabled", () => {
    render(<ControlledPasswordInput showStrength />);
    expect(screen.queryByText(/Password strength/)).toBeNull();
  });
});
