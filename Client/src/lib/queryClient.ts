import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: (failureCount, error) => {
                if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                    return false;
                }
                return failureCount < 2;
            },
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false,
        },
    },
});
