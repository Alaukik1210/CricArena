import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { emitUnauthorized } from "./auth-events";

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export interface ApiErrorShape {
    success: false;
    message: string;
    details?: Array<{ path: string; message: string }>;
    error?: string;
}

export class ApiError extends Error {
    public readonly status: number;
    public readonly details?: ApiErrorShape["details"];
    /**
     * Axios error code, e.g. "ECONNABORTED" for a timeout or "ERR_NETWORK".
     * Carried through so callers can branch on the failure kind without
     * string-matching the human-readable message.
     */
    public readonly code?: string;

    constructor(message: string, status: number, details?: ApiErrorShape["details"], code?: string) {
        super(message);
        this.status = status;
        this.details = details;
        this.code = code;
    }
}

const createClient = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError<ApiErrorShape>) => {
            const status = error.response?.status ?? 0;
            const data = error.response?.data;
            const message =
                data?.message ||
                error.message ||
                "Something went wrong. Please try again.";

            if (status === 401) {
                emitUnauthorized();
            }

            return Promise.reject(new ApiError(message, status, data?.details, error.code));
        },
    );

    return instance;
};

export const api = createClient();

export const showApiError = (err: unknown) => {
    if (err instanceof ApiError) {
        if (err.details?.length) {
            err.details.forEach((d) => toast.error(`${d.path}: ${d.message}`));
            return;
        }
        toast.error(err.message);
        return;
    }
    if (err instanceof Error) {
        toast.error(err.message);
        return;
    }
    toast.error("Unexpected error");
};
