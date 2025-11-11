import { apiClient } from '@/api/base';
import type { LoginRequest, RegisterRequest, AuthResponse, BackendResponse } from '@/api/interfaces/auth';
import Cookies from 'js-cookie';

// Configuración de cookies seguras
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict' as const, // Previene CSRF
  expires: 7, // 7 días
};

const USER_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // Más flexible para datos menos sensibles
  expires: 7,
};

export const useAuthService = () => {
  /**
   * Iniciar sesión
   */
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendResponse<AuthResponse>>('/auth/login', credentials);
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
   * Registrar nuevo usuario
   */
  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendResponse<AuthResponse>>('/auth/register', userData);
      const authData = response.data;

      if (authData?.token) {
        // Guardar token en cookie segura
        Cookies.set('auth_token', authData.token, COOKIE_OPTIONS);
        
        // Guardar datos de usuario en cookie (menos sensible)
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
   */
  const logout = (): void => {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = (): boolean => {
    return !!Cookies.get('auth_token');
  };

  /**
   * Obtener token actual
   */
  const getToken = (): string | null => {
    return Cookies.get('auth_token') || null;
  };
  
  /**
   * Obtener usuario actual
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
   * Login de administrador
   */
  const adminLogin = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendResponse<AuthResponse>>('/admin/auth/login', credentials);
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

  return { login, register, logout, isAuthenticated, getToken, getCurrentUser, adminLogin };

};
