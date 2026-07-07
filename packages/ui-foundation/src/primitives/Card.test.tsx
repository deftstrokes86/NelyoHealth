/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card } from "./Card";

afterEach(cleanup);

describe("Card", () => {
  it("renders a <section> element by default with default tone and md padding", () => {
    render(
      <Card aria-label="Synthetic card">
        <p>Body</p>
      </Card>
    );
    const card = screen.getByLabelText("Synthetic card");
    expect(card.tagName).toBe("SECTION");
    expect(card.getAttribute("data-tone")).toBe("default");
    expect(card.getAttribute("data-padding")).toBe("md");
  });

  it("applies tone and padding variants", () => {
    render(
      <Card aria-label="Synthetic critical" tone="critical" padding="lg">
        <p>Body</p>
      </Card>
    );
    const card = screen.getByLabelText("Synthetic critical");
    expect(card.className).toContain("nh-card--critical");
    expect(card.className).toContain("nh-card--pad-lg");
  });

  it("can render as a custom element via the as prop", () => {
    render(
      <Card as="article" aria-label="Synthetic article">
        <p>Body</p>
      </Card>
    );
    const card = screen.getByLabelText("Synthetic article");
    expect(card.tagName).toBe("ARTICLE");
  });
});
