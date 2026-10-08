export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

/** Subscribe to global 401s. Returns an unsubscribe function. */
export function onUnauthorized(handler: () => void): () => void {
    const listener = () => handler();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
}

export function emitUnauthorized(): void {
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
}
