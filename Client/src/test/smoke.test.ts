import { describe, it, expect } from "vitest";

describe("test infrastructure", () => {
    it("runs and has jest-dom matchers registered", () => {
        const el = document.createElement("div");
        el.textContent = "ok";
        document.body.appendChild(el);
        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent("ok");
    });
});
