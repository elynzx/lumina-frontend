import { apiClient } from '@/api/base';
import { ENDPOINTS } from '@/api/config/endpoints';
import type {
  UserProfile,
  UpdateUserProfileRequest,
  ChangePasswordRequest,
} from '@/api/interfaces/auth';

/**
 * Servicio para gestionar el perfil de usuario
 */
export const useUserService = () => {
  /**
   * Obtener el perfil del usuario actual
   * @returns Perfil del usuario
   */
  const getUserProfile = async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(ENDPOINTS.USERS.ME);
    return response.data;
  };

  /**
   * Actualizar el perfil del usuario
   * @param updateData - Datos para actualizar el perfil
   * @returns Perfil actualizado
   */
  const updateUserProfile = async (
    updateData: UpdateUserProfileRequest
  ): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>(
      ENDPOINTS.USERS.UPDATE_PROFILE,
      updateData
    );
    return response.data;
  };

  /**
   * Cambiar la contraseña del usuario
   * @param passwordData - Datos para cambiar la contraseña
   * @returns void
   */
  const changePassword = async (
    passwordData: ChangePasswordRequest
  ): Promise<void> => {
    await apiClient.put(ENDPOINTS.USERS.CHANGE_PASSWORD, passwordData);
  };

  return {
    getUserProfile,
    updateUserProfile,
    changePassword,
  };
};
