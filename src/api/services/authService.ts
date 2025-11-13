import { apiClient } from '@/api/base';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/api/interfaces';
import Cookies from 'js-cookie';

/**
 * Configuración de cookies para el token de autenticación
 * - secure: Solo HTTPS en producción
 * - sameSite: 'strict' para prevenir ataques CSRF
 * - expires: 7 días de duración
 */
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  expires: 7,
};

/**
 * Configuración de cookies para datos de usuario
 * - sameSite: 'lax' para mayor flexibilidad
 */
const USER_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  expires: 7,
};

/**
 * Servicio de autenticación para clientes y administradores
 * Maneja login, registro, logout y gestión de sesiones mediante cookies seguras
 */
export const useAuthService = () => {
  /**
   * Iniciar sesión de cliente
   * @param credentials - Email y contraseña del usuario
   * @returns Datos de autenticación (token, usuario)
   */
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const authData = response.data;

      if (authData?.token) {
        Cookies.set('auth_token', authData.token, COOKIE_OPTIONS);        
        Cookies.set(
          'user_data',
          JSON.stringify(authData.user),
          USER_COOKIE_OPTIONS
        );
      }

      return authData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  /**
   * Registrar nuevo usuario cliente
   * @param userData - Datos del nuevo usuario (nombre, email, dni, teléfono, contraseña)
   * @returns Datos de autenticación del usuario registrado
   */
  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      const authData = response.data;

      if (authData?.token) {
        Cookies.set('auth_token', authData.token, COOKIE_OPTIONS);
        Cookies.set(
          'user_data',
          JSON.stringify(authData.user),
          USER_COOKIE_OPTIONS
        );
      }

      return authData;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  /**
   * Cerrar sesión
   * Elimina el token y datos del usuario de las cookies
   */
  const logout = (): void => {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
  };

  /**
   * Verificar si el usuario está autenticado
   * @returns true si existe un token válido
   */
  const isAuthenticated = (): boolean => {
    return !!Cookies.get('auth_token');
  };

  /**
   * Obtener token de autenticación actual
   * @returns Token JWT o null si no existe
   */
  const getToken = (): string | null => {
    return Cookies.get('auth_token') || null;
  };
  
  /**
   * Obtener datos del usuario actual desde la cookie
   * @returns Perfil del usuario o null si no está autenticado
   */
  const getCurrentUser = () => {
    const userStr = Cookies.get('user_data');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  /**
   * Iniciar sesión de administrador
   * Utiliza endpoint /admin/auth/login para autenticar administradores
   * @param credentials - Email y contraseña del administrador
   * @returns Datos de autenticación (token, usuario con rol ADMIN)
   */
  const adminLogin = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/admin/auth/login', credentials);
      const authData = response.data;

      if (authData?.token) {
        Cookies.set('auth_token', authData.token, COOKIE_OPTIONS);        
        Cookies.set(
          'user_data',
          JSON.stringify(authData.user),
          USER_COOKIE_OPTIONS
        );
      }

      return authData;
    } catch (error) {
      console.error('Error en login de administrador:', error);
      throw error;
    }
  };

  return { 
    login, 
    register, 
    logout, 
    isAuthenticated, 
    getToken, 
    getCurrentUser, 
    adminLogin 
  };
};
