import { useAuthStore } from '@/store/useAuthStore';
import { useAuthService } from '@/api/services/authService';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/api/interfaces/auth';

export const useAuth = () => {
  const { setAuthenticated, setUser, setLoading } = useAuthStore();
  const authService = useAuthService();

  const checkAuth = () => {
    setLoading(true);
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();
    setAuthenticated(authenticated);
    setUser(currentUser);
    setLoading(false);
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response: AuthResponse = await authService.login(credentials);
      setAuthenticated(true);
      setUser({
        idUsuario: response.idUsuario,
        email: response.email,
        nombreCompleto: response.nombreCompleto,
        rol: response.rol
      });
    } catch (error) {
      setAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response: AuthResponse = await authService.register(userData);
      setAuthenticated(true);
      setUser({
        idUsuario: response.idUsuario,
        email: response.email,
        nombreCompleto: response.nombreCompleto,
        rol: response.rol
      });
    } catch (error) {
      setAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthenticated(false);
    setUser(null);
  };

  return {
    login,
    register,
    logout,
    checkAuth
  };
};
