import store, { persistor } from "../redux/store";
import { queryClient } from "../lib/queryClient";
import { clearUser } from "../redux/userSlice";

type Loc = Pick<Location, "pathname" | "search">;

/**
 * Runs on every 401 from the API client.
 *
 * Location and redirect are injectable so this is testable without stubbing
 * window.location, which jsdom does not allow reassigning.
 */
export function handleUnauthorized(
    location: Loc = window.location,
    redirect: (url: string) => void = (url) => window.location.assign(url),
): void {
    store.dispatch(clearUser());
    queryClient.clear();
    void persistor.purge();

    // Redirecting while already on /login would loop.
    if (location.pathname !== "/login") {
        const next = encodeURIComponent(location.pathname + location.search);
        redirect(`/login?next=${next}`);
    }
}
