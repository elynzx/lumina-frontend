export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    tokenType: string;
    user: User;
}

export interface BackendResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roleName: string;
}

export interface ApiError {
    mensaje: string;
    estado: string;
    datos?: unknown;
}