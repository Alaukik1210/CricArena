import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/redux/store";
import Layout from "./Layout";

// Layout renders Navbar, which calls useAppSelector. Without a Provider the
// render throws on missing react-redux context and the test would go red for
// a reason that has nothing to do with the skip link - which would make the
// RED step prove nothing.
function renderLayout() {
    return render(
        <Provider store={store}>
            <MemoryRouter>
                <Layout />
            </MemoryRouter>
        </Provider>,
    );
}

describe("Layout", () => {
    it("renders a skip link targeting the main region", () => {
        renderLayout();
        const skip = screen.getByRole("link", { name: /skip to main content/i });
        expect(skip).toHaveAttribute("href", "#main-content");
    });

    it("renders a main landmark with the matching id", () => {
        renderLayout();
        expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    });

    it("puts the skip link before the navbar in tab order", () => {
        const { container } = renderLayout();
        const focusable = container.querySelectorAll("a[href], button");
        expect(focusable[0]).toHaveAccessibleName(/skip to main content/i);
    });
});
