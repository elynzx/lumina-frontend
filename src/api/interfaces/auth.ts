export interface LoginRequest {
    email: string;
    contrasena: string;
}

export interface RegisterRequest {
    nombre: string;
    apellido: string;
    dni: string;
    celular: string;
    email: string;
    contrasena: string;
}

export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    idUsuario: number;
    email: string;
    nombreCompleto: string;
    rol: string;
}

export interface BackendResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface User {
    idUsuario: number;
    nombre: string;
    apellido: string;
    dni: string;
    celular: string;
    email: string;
    rol: string;
}

export interface ApiError {
    mensaje: string;
    estado: string;
    datos?: unknown;
}