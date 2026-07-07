/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

afterEach(cleanup);

describe("Avatar", () => {
  it("renders the image with alt text when src is provided", () => {
    render(
      <Avatar
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%2F%3E"
        alt="Synthetic patient photo"
      />
    );
    const image = screen.getByAltText("Synthetic patient photo") as HTMLImageElement;
    expect(image.tagName).toBe("IMG");
  });

  it("falls back to initials when src is not provided", () => {
    render(<Avatar alt="Ada Lovelace" />);
    expect(screen.getByText("AL")).toBeTruthy();
    expect(screen.getByText("Ada Lovelace")).toBeTruthy();
  });

  it("uses custom initials when provided", () => {
    render(<Avatar alt="Synthetic account" initials="NH" />);
    expect(screen.getByText("NH")).toBeTruthy();
  });

  it("applies size data attribute", () => {
    render(<Avatar alt="Synthetic size" size="xl" />);
    const label = screen.getByText("SS");
    const avatar = label.closest(".nh-avatar");
    expect(avatar?.getAttribute("data-size")).toBe("xl");
    expect(avatar?.className).toContain("nh-avatar--xl");
  });

  it("renders a presence indicator when specified", () => {
    render(<Avatar alt="Online user" presence="online" />);
    const label = screen.getByText("OU");
    const presence = label
      .closest(".nh-avatar")
      ?.querySelector(".nh-avatar__presence");
    expect(presence?.getAttribute("data-presence")).toBe("online");
    expect(presence?.getAttribute("aria-hidden")).toBe("true");
  });
});
