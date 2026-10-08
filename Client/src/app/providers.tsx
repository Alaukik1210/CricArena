import { type ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import axios from "axios";

import store, { persistor } from "../redux/store";
import { queryClient } from "../lib/queryClient";
import { onUnauthorized } from "../lib/auth-events";
import { handleUnauthorized } from "./handle-unauthorized";

// DEPRECATED - 14 legacy components still call raw axios and rely on this
// global to send the auth cookie. They migrate to the typed `api` client in
// Tasks 9-13; Task 13 removes this line once none remain. Do not add new
// raw-axios callers.
axios.defaults.withCredentials = true;

function UnauthorizedListener() {
    useEffect(() => onUnauthorized(() => handleUnauthorized()), []);
    return null;
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <UnauthorizedListener />
                    {children}
                    <Toaster theme="light" position="top-right" richColors />
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    );
}
