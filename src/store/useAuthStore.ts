import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { User } from '@/api/interfaces/auth';

interface AuthState {
  loading: boolean;
  setLoading: (value: boolean) => void;
  isAuthenticated: () => boolean;
  user: () => User | null;
  refresh: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  loading: true,
  setLoading: (value) => set({ loading: value }),
  
  /**
   * Computed property que verifica autenticación leyendo directamente de cookies
   * @returns {boolean} true si existe token en cookies
   */
  isAuthenticated: () => {
    return !!Cookies.get('auth_token');
  },
  
  /**
   * Computed property que obtiene usuario leyendo directamente de cookies
   * @returns {User | null} Datos del usuario o null si no existe
   */
  user: () => {
    const userStr = Cookies.get('user_data');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  refresh: () => {
    set({}); // Fuerza re-render sin cambiar estado
  },
}));