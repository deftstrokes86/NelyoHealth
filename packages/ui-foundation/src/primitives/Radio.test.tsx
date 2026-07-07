/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Radio } from "./Radio";

afterEach(cleanup);

describe("Radio", () => {
  it("renders a native radio input", () => {
    render(<Radio aria-label="Synthetic option A" name="synthetic-group" value="a" />);
    const input = screen.getByRole("radio", { name: "Synthetic option A" });
    expect(input.tagName).toBe("INPUT");
    expect((input as HTMLInputElement).type).toBe("radio");
  });

  it("renders inline label text when children are provided", () => {
    render(
      <Radio name="synthetic-group" value="option-1">
        Adult
      </Radio>
    );
    const input = screen.getByRole("radio", { name: "Adult" });
    expect(input.closest("label")?.textContent).toContain("Adult");
  });

  it("sets aria-invalid on the error variant", () => {
    render(
      <Radio aria-label="Synthetic error radio" name="err-group" variant="error" />
    );
    const input = screen.getByRole("radio", { name: "Synthetic error radio" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.closest(".nh-radio")?.className).toContain("nh-radio--error");
  });

  it("marks the disabled state on both the wrapper and the input", () => {
    render(
      <Radio aria-label="Synthetic disabled radio" name="dis-group" disabled />
    );
    const input = screen.getByRole("radio", { name: "Synthetic disabled radio" });
    expect((input as HTMLInputElement).disabled).toBe(true);
    expect(input.closest(".nh-radio")?.className).toContain("nh-radio--disabled");
  });

  it("groups radios by shared name attribute", () => {
    render(
      <>
        <Radio name="age-group" value="a">
          Adult
        </Radio>
        <Radio name="age-group" value="b">
          Adolescent
        </Radio>
      </>
    );
    const adult = screen.getByRole("radio", { name: "Adult" }) as HTMLInputElement;
    const adolescent = screen.getByRole("radio", {
      name: "Adolescent"
    }) as HTMLInputElement;
    expect(adult.name).toBe("age-group");
    expect(adolescent.name).toBe("age-group");
  });

  it("forwards refs to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Radio aria-label="Synthetic ref" ref={ref} name="ref-group" />);
    expect(ref.current?.tagName).toBe("INPUT");
    expect(ref.current?.type).toBe("radio");
  });
});
