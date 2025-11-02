import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  idUsuario: number;
  email: string;
  nombreCompleto: string;
  rol: string;
}

interface AuthState {
  loading: boolean;
  setLoading: (value: boolean) => void;
  // Computed properties que leen directamente de cookies
  isAuthenticated: () => boolean;
  user: () => User | null;
  // Función para forzar re-render cuando cambian las cookies
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
  
  /**
   * Función para forzar re-render de componentes cuando cambian las cookies
   * Útil después de login/logout para actualizar la UI inmediatamente
   */
  refresh: () => {
    set({}); // Fuerza re-render sin cambiar estado
  },
}));
