import { useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthService } from '@/api/services/authService';
import type { LoginRequest, RegisterRequest } from '@/api/interfaces/auth';

/**
 * Hook personalizado para manejar operaciones de autenticación.
 * 
 * @description Este hook proporciona funciones optimizadas para login, registro y logout.
 * Después de cada operación, actualiza automáticamente la UI llamando refresh() del store.
 * El store lee los datos directamente de cookies, manteniendo una sola fuente de verdad.
 */
export const useAuth = () => {
  const { refresh } = useAuthStore();
  const authService = useAuthService();

  /**
   * Inicia sesión de usuario
   * @param {LoginRequest} credentials - Email y contraseña del usuario
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      await authService.login(credentials);
      // El authService ya guardó en cookies, solo necesitamos refrescar la UI
      refresh();
    } catch (error) {
      // Si hay error, también refrescamos para limpiar cualquier estado inconsistente
      refresh();
      throw error;
    }
  }, [authService, refresh]);

  /**
   * Registra un nuevo usuario
   * @param {RegisterRequest} userData - Datos del nuevo usuario
   */
  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      await authService.register(userData);
      // El authService ya guardó en cookies, solo necesitamos refrescar la UI
      refresh();
    } catch (error) {
      // Si hay error, también refrescamos para limpiar cualquier estado inconsistente
      refresh();
      throw error;
    }
  }, [authService, refresh]);

  /**
   * Cierra la sesión del usuario
   */
  const logout = useCallback(() => {
    authService.logout();
    // El authService ya eliminó las cookies, solo necesitamos refrescar la UI
    refresh();
  }, [authService, refresh]);

  return {
    login,
    register,
    logout
  };
};
