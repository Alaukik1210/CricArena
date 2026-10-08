export type Role = "PLAYER" | "OWNER" | "ADMIN";

export interface User {
    id: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    role: Role;
    state: string;
    city: string;
    profile?: { profilePhoto?: string };
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
}
