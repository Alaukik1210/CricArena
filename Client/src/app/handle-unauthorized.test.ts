import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleUnauthorized } from "./handle-unauthorized";
import store from "../redux/store";
import { setUser } from "../redux/userSlice";
import { queryClient } from "../lib/queryClient";

describe("handleUnauthorized", () => {
    beforeEach(() => {
        queryClient.clear();
    });

    it("clears the user from the store", () => {
        store.dispatch(setUser({ id: "u1" } as never));
        expect(store.getState().user.user).not.toBeNull();

        handleUnauthorized({ pathname: "/discover", search: "" }, () => {});

        expect(store.getState().user.user).toBeNull();
    });

    it("clears the query cache", () => {
        queryClient.setQueryData(["rooms"], [{ id: "r1" }]);
        expect(queryClient.getQueryData(["rooms"])).toBeDefined();

        handleUnauthorized({ pathname: "/discover", search: "" }, () => {});

        expect(queryClient.getQueryData(["rooms"])).toBeUndefined();
    });

    it("redirects to login carrying the current path as next", () => {
        const redirect = vi.fn();
        handleUnauthorized({ pathname: "/rooms", search: "?radius=10" }, redirect);
        expect(redirect).toHaveBeenCalledWith("/login?next=%2Frooms%3Fradius%3D10");
    });

    it("does not redirect when already on the login page", () => {
        const redirect = vi.fn();
        handleUnauthorized({ pathname: "/login", search: "" }, redirect);
        expect(redirect).not.toHaveBeenCalled();
    });
});
