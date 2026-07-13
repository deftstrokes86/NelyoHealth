/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Menu } from "./Menu";

afterEach(cleanup);

const buildItems = (selectSpy?: (id: string) => void) => [
  { id: "profile", label: "Profile", onSelect: () => selectSpy?.("profile") },
  { id: "settings", label: "Settings", onSelect: () => selectSpy?.("settings") },
  {
    id: "disabled",
    label: "Suspended",
    disabled: true,
    onSelect: () => selectSpy?.("disabled")
  },
  { id: "signout", label: "Sign out", onSelect: () => selectSpy?.("signout") }
];

describe("Menu", () => {
  it("wires the trigger with correct ARIA relationships", () => {
    render(
      <Menu
        items={buildItems()}
        trigger={(props) => (
          <button type="button" {...props}>
            Account
          </button>
        )}
      />
    );
    const trigger = screen.getByRole("button", { name: "Account" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens on click and renders items with role=menuitem", () => {
    render(
      <Menu
        items={buildItems()}
        trigger={(props) => (
          <button type="button" {...props}>
            Account
          </button>
        )}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    const items = screen.getAllByRole("menuitem");
    expect(items.length).toBe(4);
    expect(items[0].textContent).toBe("Profile");
  });

  it("calls onSelect and closes when an item is clicked", () => {
    const selectSpy = vi.fn();
    render(
      <Menu
        items={buildItems(selectSpy)}
        trigger={(props) => (
          <button type="button" {...props}>
            Account
          </button>
        )}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
    expect(selectSpy).toHaveBeenCalledWith("settings");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("does not select a disabled item", () => {
    const selectSpy = vi.fn();
    render(
      <Menu
        items={buildItems(selectSpy)}
        trigger={(props) => (
          <button type="button" {...props}>
            Account
          </button>
        )}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Suspended" }));
    expect(selectSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  it("closes on Escape", () => {
    render(
      <Menu
        items={buildItems()}
        trigger={(props) => (
          <button type="button" {...props}>
            Account
          </button>
        )}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(screen.getByRole("menu")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
