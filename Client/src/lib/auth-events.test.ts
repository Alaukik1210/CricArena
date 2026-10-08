import { describe, it, expect, vi } from "vitest";
import { AUTH_UNAUTHORIZED_EVENT, onUnauthorized } from "./auth-events";

describe("auth events", () => {
    it("invokes the handler when the event fires", () => {
        const handler = vi.fn();
        const off = onUnauthorized(handler);
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
        expect(handler).toHaveBeenCalledOnce();
        off();
    });

    it("stops invoking after unsubscribe", () => {
        const handler = vi.fn();
        const off = onUnauthorized(handler);
        off();
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
        expect(handler).not.toHaveBeenCalled();
    });

    it("supports multiple subscribers", () => {
        const a = vi.fn();
        const b = vi.fn();
        const offA = onUnauthorized(a);
        const offB = onUnauthorized(b);
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
        expect(a).toHaveBeenCalledOnce();
        expect(b).toHaveBeenCalledOnce();
        offA();
        offB();
    });
});
