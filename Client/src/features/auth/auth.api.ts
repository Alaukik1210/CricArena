import { api } from "../../lib/api";
import type { Role, User } from "../../types/user";

export interface LoginRequest {
    email: string;
    password: string;
    role: Role;
}

export interface RegisterRequest extends LoginRequest {
    fullname: string;
    phoneNumber: string;
    state: string;
    city: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>("/user/login", data);
        return res.data;
    },
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>("/user/register", data);
        return res.data;
    },
    logout: async (): Promise<{ success: boolean; message: string }> => {
        const res = await api.post("/user/logout");
        return res.data;
    },
};
