/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Select } from "./Select";

afterEach(cleanup);

describe("Select", () => {
  it("renders a native select with options", () => {
    render(
      <Select aria-label="Synthetic role">
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </Select>
    );
    const select = screen.getByRole("combobox", { name: "Synthetic role" });
    expect(select.tagName).toBe("SELECT");
    expect(screen.getByRole("option", { name: "Patient" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Doctor" })).toBeTruthy();
  });

  it("renders a hidden placeholder as the first option", () => {
    render(
      <Select aria-label="Synthetic placeholder" placeholder="Choose a role">
        <option value="patient">Patient</option>
      </Select>
    );
    const select = screen.getByRole("combobox", { name: "Synthetic placeholder" });
    const options = select.querySelectorAll("option");
    const placeholderOption = options[0] as HTMLOptionElement;
    expect(placeholderOption.textContent).toBe("Choose a role");
    expect(placeholderOption.disabled).toBe(true);
    expect(placeholderOption.hidden).toBe(true);
    expect(placeholderOption.value).toBe("");
  });

  it("sets aria-invalid on the error variant", () => {
    render(
      <Select aria-label="Synthetic error" variant="error">
        <option value="a">A</option>
      </Select>
    );
    const select = screen.getByRole("combobox", { name: "Synthetic error" });
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.closest(".nh-select")?.className).toContain("nh-select--error");
  });

  it("marks the disabled state on both the wrapper and the input", () => {
    render(
      <Select aria-label="Synthetic disabled" disabled>
        <option value="a">A</option>
      </Select>
    );
    const select = screen.getByRole("combobox", {
      name: "Synthetic disabled"
    }) as HTMLSelectElement;
    expect(select.disabled).toBe(true);
    expect(select.closest(".nh-select")?.className).toContain("nh-select--disabled");
  });

  it("forwards refs to the underlying select element", () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select aria-label="Synthetic ref" ref={ref}>
        <option value="a">A</option>
      </Select>
    );
    expect(ref.current?.tagName).toBe("SELECT");
  });
});
