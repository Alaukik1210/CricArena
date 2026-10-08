import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable, type Column } from "./data-table";

type Room = { id: string; name: string; distanceKm: number; spots: string };

const columns: Column<Room>[] = [
    { key: "name", header: "Room", render: (r) => r.name },
    { key: "dist", header: "Dist", align: "right", numeric: true, render: (r) => `${r.distanceKm.toFixed(1)}km` },
    { key: "spots", header: "Spots", align: "right", numeric: true, render: (r) => r.spots },
];

const rows: Room[] = [
    { id: "1", name: "Saturday Powerplay", distanceKm: 7, spots: "4/11" },
    { id: "2", name: "Need 2 Finishers", distanceKm: 9.2, spots: "2/11" },
];

describe("DataTable", () => {
    it("renders headers", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        expect(screen.getByRole("columnheader", { name: "Room" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Dist" })).toBeInTheDocument();
    });

    it("renders a row per item", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2
    });

    it("formats numeric cells with the data font and tabular figures", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        const cell = screen.getByText("7.0km");
        expect(cell).toHaveClass("font-data");
        expect(cell).toHaveClass("tabular-nums");
    });

    it("leaves non-numeric cells in the body font", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        // Guards against slapping font-data on every cell, which would make
        // the numeric/non-numeric distinction meaningless.
        expect(screen.getByText("Saturday Powerplay")).not.toHaveClass("font-data");
    });

    it("right-aligns numeric columns and left-aligns the rest", () => {
        render(<DataTable columns={columns} rows={rows} getRowId={(r) => r.id} />);
        expect(screen.getByText("7.0km")).toHaveClass("text-right");
        expect(screen.getByText("Saturday Powerplay")).not.toHaveClass("text-right");
    });

    it("right-aligns a numeric column even when align is omitted", () => {
        const cols: Column<Room>[] = [
            { key: "dist", header: "Dist", numeric: true, render: (r) => `${r.distanceKm.toFixed(1)}km` },
        ];
        render(<DataTable columns={cols} rows={rows} getRowId={(r) => r.id} />);
        expect(screen.getByText("7.0km")).toHaveClass("text-right");
    });

    it("shows the empty message when there are no rows", () => {
        render(
            <DataTable
                columns={columns}
                rows={[]}
                getRowId={(r) => r.id}
                emptyMessage="No rooms within 10km. Widen to 25km, or start one."
            />,
        );
        expect(screen.getByText(/No rooms within 10km/)).toBeInTheDocument();
    });

    it("renders skeleton rows while loading", () => {
        render(<DataTable columns={columns} rows={[]} getRowId={(r) => r.id} loading skeletonRows={3} />);
        expect(screen.getAllByTestId("skeleton-row")).toHaveLength(3);
    });

    it("prefers skeletons over the empty message while loading", () => {
        render(
            <DataTable columns={columns} rows={[]} getRowId={(r) => r.id} loading emptyMessage="nothing here" />,
        );
        expect(screen.queryByText("nothing here")).not.toBeInTheDocument();
    });
});
