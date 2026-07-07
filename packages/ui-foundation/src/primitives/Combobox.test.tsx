/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Combobox } from "./Combobox";

afterEach(cleanup);

const OPTIONS = [
  { value: "adult", label: "Adult primary care" },
  { value: "peds", label: "Pediatrics" },
  { value: "ob", label: "Obstetrics" }
];

const Controlled = ({
  initial = "",
  spy
}: {
  initial?: string;
  spy?: (value: string) => void;
}) => {
  const [value, setValue] = useState(initial);
  return (
    <Combobox
      options={OPTIONS}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        spy?.(next);
      }}
      aria-label="Synthetic care line"
    />
  );
};

describe("Combobox", () => {
  it("renders an input with the combobox role and correct ARIA relationships", () => {
    render(<Controlled />);
    const input = screen.getByRole("combobox", { name: "Synthetic care line" });
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens the listbox on focus and shows all options initially", () => {
    render(<Controlled />);
    const input = screen.getByRole("combobox", { name: "Synthetic care line" });
    fireEvent.focus(input);
    expect(input.getAttribute("aria-expanded")).toBe("true");
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeTruthy();
    expect(screen.getAllByRole("option").length).toBe(OPTIONS.length);
  });

  it("filters options by input text", () => {
    render(<Controlled />);
    const input = screen.getByRole("combobox", { name: "Synthetic care line" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "ped" } });
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(1);
    expect(options[0].textContent).toBe("Pediatrics");
  });

  it("selects an option on ArrowDown + Enter and reports via onValueChange", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} />);
    const input = screen.getByRole("combobox", { name: "Synthetic care line" });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(spy).toHaveBeenCalledWith("peds");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape", () => {
    render(<Controlled />);
    const input = screen.getByRole("combobox", { name: "Synthetic care line" });
    fireEvent.focus(input);
    expect(input.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });

  it("renders an empty state when there are no matches", () => {
    render(<Controlled />);
    const input = screen.getByRole("combobox", { name: "Synthetic care line" });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(screen.getByText("No matches")).toBeTruthy();
  });

  it("sets aria-invalid on the error variant", () => {
    render(
      <Combobox
        options={OPTIONS}
        variant="error"
        aria-label="Synthetic error combobox"
      />
    );
    const input = screen.getByRole("combobox", { name: "Synthetic error combobox" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });
});
