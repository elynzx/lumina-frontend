import { useState, useCallback } from 'react';
import { useUserService } from '@/api/services/userService';
import { parseApiError } from '@/api/base';
import type { UserProfile } from '@/api/interfaces';
import type { ChangePasswordRequest } from '@/api/interfaces/auth';

/**
 * Hook para obtener el perfil del usuario
 */
export const useUserProfile = () => {
    const userService = useUserService();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getUserProfile();
            setProfile(data);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { profile, loading, error, refetch: fetchUserProfile };
};

/**
 * Hook para actualizar el perfil del usuario
 */
export const useUpdateUserProfile = () => {
    const userService = useUserService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUserProfile = useCallback(async (payload: Partial<UserProfile>) => {
        setLoading(true);
        setError(null);
        try {
            await userService.updateUserProfile(payload as any);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateUserProfile, loading, error };
};

/**
 * Hook para cambiar la contraseña del usuario
 */
export const useChangePassword = () => {
    const userService = useUserService();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const changePassword = useCallback(async (passwordData: ChangePasswordRequest) => {
        setLoading(true);
        setError(null);
        try {
            await userService.changePassword(passwordData);
        } catch (err) {
            const apiError = parseApiError(err as Error);
            setError(apiError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { changePassword, loading, error };
};