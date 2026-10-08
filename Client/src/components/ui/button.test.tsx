import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
    it("renders its children", () => {
        render(<Button>Join room</Button>);
        expect(screen.getByRole("button", { name: "Join room" })).toBeInTheDocument();
    });

    it("applies the urgent variant", () => {
        render(<Button variant="urgent">Closing</Button>);
        expect(screen.getByRole("button")).toHaveClass("bg-urgent");
    });

    it("merges a caller className", () => {
        render(<Button className="w-full">Wide</Button>);
        expect(screen.getByRole("button")).toHaveClass("w-full");
    });

    it("uses no banned radius utility", () => {
        render(<Button>Flat</Button>);
        const cls = screen.getByRole("button").className;
        expect(cls).not.toMatch(/rounded-(2xl|3xl|full)/);
    });
});
