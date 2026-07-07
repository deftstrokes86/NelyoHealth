/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { Link } from "./Link";

afterEach(cleanup);

describe("Link", () => {
  it("renders an anchor with the default variant", () => {
    render(<Link href="/patients">Patients</Link>);
    const anchor = screen.getByRole("link", { name: "Patients" });
    expect(anchor.tagName).toBe("A");
    expect(anchor.getAttribute("href")).toBe("/patients");
    expect(anchor.className).toContain("nh-link--default");
  });

  it("adds noopener and screen-reader hint when external", () => {
    render(
      <Link href="https://example.com" external>
        External resource
      </Link>
    );
    const anchor = screen.getByRole("link", { name: /External resource/ });
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    expect(anchor.textContent).toContain("(opens in a new tab)");
  });

  it("honors explicit rel and target overrides even when external", () => {
    render(
      <Link href="https://example.com" external rel="me" target="_self">
        Author
      </Link>
    );
    const anchor = screen.getByRole("link", { name: /Author/ });
    expect(anchor.getAttribute("rel")).toBe("me");
    expect(anchor.getAttribute("target")).toBe("_self");
  });

  it("supports variant styling", () => {
    render(
      <Link href="#" variant="muted">
        Muted
      </Link>
    );
    expect(screen.getByRole("link", { name: "Muted" }).className).toContain(
      "nh-link--muted"
    );
  });

  it("forwards refs to the underlying anchor", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link href="#" ref={ref}>
        Ref
      </Link>
    );
    expect(ref.current?.tagName).toBe("A");
  });
});
