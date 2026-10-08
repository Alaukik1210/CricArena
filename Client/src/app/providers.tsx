import { type ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import axios from "axios";

import store, { persistor } from "../redux/store";
import { queryClient } from "../lib/queryClient";
import { onUnauthorized } from "../lib/auth-events";
import { clearUser } from "../redux/userSlice";

// DEPRECATED - 14 legacy components still call raw axios and rely on this
// global to send the auth cookie. They migrate to the typed `api` client in
// Tasks 9-13; Task 13 removes this line once none remain. Do not add new
// raw-axios callers.
axios.defaults.withCredentials = true;

function UnauthorizedListener() {
    useEffect(
        () =>
            onUnauthorized(() => {
                store.dispatch(clearUser());
                queryClient.clear();
                void persistor.purge();
                const { pathname, search } = window.location;
                if (pathname !== "/login") {
                    const next = encodeURIComponent(pathname + search);
                    window.location.assign(`/login?next=${next}`);
                }
            }),
        [],
    );
    return null;
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <UnauthorizedListener />
                    {children}
                    <Toaster position="top-right" richColors />
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    );
}
