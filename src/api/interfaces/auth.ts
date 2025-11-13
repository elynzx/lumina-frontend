// ============================================
// AUTH DTOs (Backend DTOs)
// ============================================

// LoginRequestDTO (POST /api/auth/login)
export interface LoginRequest {
    email: string;
    password: string;
}

// AdminLoginRequestDTO (POST /api/admin/auth/login)
export interface AdminLoginRequest {
    email: string;
    password: string;
}

// RegisterRequestDTO - Registro de cliente (POST /api/auth/register)
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
    password: string;
}

// AuthResponseDTO - Respuesta login/register
export interface AuthResponse {
    token: string;
    tokenType: string;
    user: UserProfile;
}

// UserProfileDTO - Información del perfil de usuario (GET /api/users/me)
export interface UserProfile {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roleName: string;
}

// UserDTO - Alias para información del usuario
export type User = UserProfile;

// UpdateUserProfileDTO - Para actualizar perfil de usuario (PUT /api/users/me)
export interface UpdateUserProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

// ChangePasswordDTO - Para cambiar contraseña (PUT /api/users/me/change-password)
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// CreateAdminDTO - Para crear usuario admin (solo admin)
export interface CreateAdminRequest {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
    password: string;
}

export type { BackendResponse, ApiError } from './common';