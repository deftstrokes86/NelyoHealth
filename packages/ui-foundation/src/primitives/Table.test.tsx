/* @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./Table";

afterEach(cleanup);

describe("Table", () => {
  it("renders a semantic table with a caption and header cells with scope=col", () => {
    render(
      <Table caption="Synthetic pricing" aria-label="Synthetic pricing table">
        <TableHeader>
          <TableRow>
            <TableCell as="th" scope="col">
              Plan
            </TableCell>
            <TableCell as="th" scope="col" numeric>
              Amount
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Household</TableCell>
            <TableCell numeric>NGN 15,000</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const table = screen.getByRole("table", { name: "Synthetic pricing table" });
    expect(table.tagName).toBe("TABLE");
    const caption = table.querySelector("caption");
    expect(caption?.textContent).toBe("Synthetic pricing");
    const header = screen.getByRole("columnheader", { name: "Plan" });
    expect(header.getAttribute("scope")).toBe("col");
  });

  it("marks selected rows with aria-selected", () => {
    render(
      <Table aria-label="Synthetic selected">
        <TableBody>
          <TableRow selected>
            <TableCell>Row A</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Row B</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const rows = screen.getAllByRole("row");
    expect(rows[0].getAttribute("aria-selected")).toBe("true");
    expect(rows[1].getAttribute("aria-selected")).toBeNull();
  });

  it("applies density and variant data attributes", () => {
    render(
      <Table density="compact" variant="striped" aria-label="Synthetic dv">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const table = screen.getByRole("table", { name: "Synthetic dv" });
    expect(table.getAttribute("data-density")).toBe("compact");
    expect(table.getAttribute("data-variant")).toBe("striped");
  });

  it("aligns numeric cells to the end", () => {
    render(
      <Table aria-label="Synthetic numeric">
        <TableBody>
          <TableRow>
            <TableCell numeric>42</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const cell = screen.getByRole("cell", { name: "42" });
    expect(cell.className).toContain("nh-table__cell--numeric");
  });
});
