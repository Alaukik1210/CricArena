import * as React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
    key: string;
    header: string;
    align?: "left" | "right";
    /** Renders in the tabular mono face with tabular-nums. */
    numeric?: boolean;
    render: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    getRowId: (row: T) => string;
    emptyMessage?: React.ReactNode;
    loading?: boolean;
    skeletonRows?: number;
    className?: string;
}

export function DataTable<T>({
    columns,
    rows,
    getRowId,
    emptyMessage = "Nothing here yet.",
    loading = false,
    skeletonRows = 5,
    className,
}: DataTableProps<T>) {
    const cellClass = (col: Column<T>) =>
        cn(
            "px-3 py-2.5 text-sm",
            col.align === "right" && "text-right",
            col.numeric && "font-data tabular-nums",
        );

    return (
        <div className={cn("w-full overflow-x-auto border border-rule bg-surface", className)}>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-rule">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className={cn(
                                    "px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft",
                                    col.align === "right" ? "text-right" : "text-left",
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading
                        ? Array.from({ length: skeletonRows }, (_, i) => (
                              <tr key={i} data-testid="skeleton-row" className="border-b border-rule-soft">
                                  {columns.map((col) => (
                                      <td key={col.key} className={cellClass(col)}>
                                          <span className="inline-block h-3 w-16 bg-surface-sunk" aria-hidden="true" />
                                          <span className="sr-only">Loading</span>
                                      </td>
                                  ))}
                              </tr>
                          ))
                        : rows.length === 0
                          ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-ink-soft">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )
                          : rows.map((row) => (
                                <tr key={getRowId(row)} className="border-b border-rule-soft last:border-b-0">
                                    {columns.map((col) => (
                                        // cellClass already carries font-data / text-right;
                                        // an inner <span> repeating them would be duplication.
                                        <td key={col.key} className={cellClass(col)}>
                                            {col.render(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                </tbody>
            </table>
        </div>
    );
}
