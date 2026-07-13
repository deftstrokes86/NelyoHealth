import type { HTMLAttributes, ReactNode, TableHTMLAttributes } from "react";

export type TableDensity = "comfortable" | "compact";
export type TableVariant = "default" | "bordered" | "striped";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  variant?: TableVariant;
  caption?: ReactNode;
  children: ReactNode;
}

export const Table = ({
  density = "comfortable",
  variant = "default",
  caption,
  children,
  className = "",
  ...props
}: TableProps) => (
  <div className="nh-table-wrap">
    <table
      className={
        `nh-table nh-table--${density} nh-table--${variant}` +
        (className ? ` ${className}` : "")
      }
      data-density={density}
      data-variant={variant}
      {...props}
    >
      {caption ? <caption className="nh-table__caption">{caption}</caption> : null}
      {children}
    </table>
  </div>
);

export interface TableSectionProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableHeader = ({ children, ...props }: TableSectionProps) => (
  <thead className="nh-table__header" {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, ...props }: TableSectionProps) => (
  <tbody className="nh-table__body" {...props}>
    {children}
  </tbody>
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  selected?: boolean;
}

export const TableRow = ({
  children,
  selected = false,
  className = "",
  ...props
}: TableRowProps) => (
  <tr
    className={
      "nh-table__row" +
      (selected ? " nh-table__row--selected" : "") +
      (className ? ` ${className}` : "")
    }
    aria-selected={selected || undefined}
    {...props}
  >
    {children}
  </tr>
);

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  as?: "th" | "td";
  align?: "start" | "center" | "end";
  numeric?: boolean;
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  children: ReactNode;
}

export const TableCell = ({
  as = "td",
  align = "start",
  numeric = false,
  scope,
  children,
  className = "",
  ...props
}: TableCellProps) => {
  const Component = as;
  return (
    <Component
      className={
        `nh-table__cell nh-table__cell--${align}` +
        (numeric ? " nh-table__cell--numeric" : "") +
        (as === "th" ? " nh-table__cell--head" : "") +
        (className ? ` ${className}` : "")
      }
      scope={scope}
      data-align={align}
      {...props}
    >
      {children}
    </Component>
  );
};
