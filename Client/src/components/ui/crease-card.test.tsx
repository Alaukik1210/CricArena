import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CreaseCard, creaseFill } from "./crease-card";

describe("creaseFill", () => {
    it("returns the plain ratio", () => {
        expect(creaseFill(7, 11)).toBeCloseTo(0.6364, 3);
    });

    it("returns 1 when the squad is full", () => {
        expect(creaseFill(11, 11)).toBe(1);
    });

    it("clamps above full", () => {
        expect(creaseFill(14, 11)).toBe(1);
    });

    it("returns 0 for an empty squad", () => {
        expect(creaseFill(0, 11)).toBe(0);
    });

    it("returns 0 rather than NaN when required is 0", () => {
        expect(creaseFill(3, 0)).toBe(0);
    });

    it("treats negative current as 0", () => {
        expect(creaseFill(-2, 11)).toBe(0);
    });
});

describe("CreaseCard", () => {
    it("renders title and meta", () => {
        render(<CreaseCard title="Saturday Powerplay" meta="South Delhi · 7.0km" current={7} required={11} />);
        expect(screen.getByText("Saturday Powerplay")).toBeInTheDocument();
        expect(screen.getByText("South Delhi · 7.0km")).toBeInTheDocument();
    });

    it("exposes squad state to assistive tech", () => {
        render(<CreaseCard title="Room" meta="m" current={7} required={11} />);
        expect(screen.getByRole("group")).toHaveAttribute("aria-label", "Room — 7 of 11 players");
    });

    it("marks a full squad as complete", () => {
        render(<CreaseCard title="Full" meta="m" current={11} required={11} />);
        expect(screen.getByRole("group")).toHaveAttribute("data-complete", "true");
    });

    it("marks an incomplete squad", () => {
        render(<CreaseCard title="Partial" meta="m" current={7} required={11} />);
        expect(screen.getByRole("group")).toHaveAttribute("data-complete", "false");
    });

    it("inks the crease in exact proportion to the squad", () => {
        render(<CreaseCard title="Room" meta="m" current={7} required={11} />);
        // 7/11 = 63.64% of the perimeter, normalised by pathLength=100
        expect(screen.getByTestId("crease-stroke")).toHaveAttribute("stroke-dasharray", "63.64 100");
    });

    it("closes the crease for a full squad", () => {
        render(<CreaseCard title="Full" meta="m" current={11} required={11} />);
        expect(screen.getByTestId("crease-stroke")).toHaveAttribute("stroke-dasharray", "100.00 100");
    });

    it("leaves the crease unmarked for an empty squad", () => {
        render(<CreaseCard title="Empty" meta="m" current={0} required={11} />);
        expect(screen.getByTestId("crease-stroke")).toHaveAttribute("stroke-dasharray", "0.00 100");
    });
});
