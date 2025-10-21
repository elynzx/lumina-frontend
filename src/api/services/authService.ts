import { apiClient } from '@/api/base';
import type { LoginRequest, RegisterRequest, AuthResponse, BackendResponse } from '@/api/interfaces/auth';

export const useAuthService = () => {
  /**
   * Iniciar sesión
   */
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<BackendResponse<AuthResponse>>('/auth/login', credentials);
      const authData = response.data;

      if (authData?.accessToken) {
        localStorage.setItem('token', authData.accessToken);
        localStorage.setItem(
          'user',
          JSON.stringify({
            idUsuario: authData.idUsuario,
            email: authData.email,
            nombreCompleto: authData.nombreCompleto,
            rol: authData.rol,
          })
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

      if (authData?.accessToken) {
        localStorage.setItem('token', authData.accessToken);
        localStorage.setItem(
          'user',
          JSON.stringify({
            idUsuario: authData.idUsuario,
            email: authData.email,
            nombreCompleto: authData.nombreCompleto,
            rol: authData.rol,
          })
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
  };

  /**
   * Obtener token actual
   */
  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };
  
  /**
   * Obtener usuario actual
   */
  const getCurrentUser = (): { idUsuario: number; email: string; nombreCompleto: string; rol: string } | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  return { login, register, logout, isAuthenticated, getToken, getCurrentUser };

};
