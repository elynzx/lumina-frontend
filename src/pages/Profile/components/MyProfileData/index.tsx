import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Button } from '@/components/atomic/Button';
import { VALIDATION_RULES } from '@/utils/validations';
import { useUserProfile, useUpdateUserProfile } from '@/hooks/api';
import { AlertCircle } from 'lucide-react';

interface MyDataForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Component for managing user profile data
 */
export const MyProfileData = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userDni, setUserDni] = useState<string>('');

  const { profile, loading: loadingProfile, refetch } = useUserProfile();
  const { updateUserProfile } = useUpdateUserProfile();

  const { control, handleSubmit, reset } = useForm<MyDataForm>({
    mode: 'onChange',
  });

  useEffect(() => {
    refetch();
    
    const userDataCookie = Cookies.get('user_data');
    if (userDataCookie) {
      try {
        const parsedData = JSON.parse(userDataCookie);
        setUserDni(parsedData.dni || parsedData.documentNumber || '');
      } catch (err) {
        console.error('Error al parsear datos del usuario:', err);
      }
    }
  }, [refetch]);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: MyDataForm) => {
    setMessage(null);
    try {
      await updateUserProfile(data);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setIsEditing(false);
      refetch();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
      });
    }
    setIsEditing(false);
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Mis Datos</h2>
        <p className="text-gray-600">Actualiza tus datos para continuar</p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          <AlertCircle size={20} />
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex justify-center items-start gap-6 mt-4">
        <form className="flex flex-col gap-6 w-full max-w-xl">
          {/* Nombres - Apellidos */}
          <div className="grid grid-cols-2 gap-6">
            <Controller
              name="firstName"
              control={control}
              rules={VALIDATION_RULES.firstName}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-4">
                    <label className=" w-20 shrink-0">Nombres:</label>
                    <input
                      {...field}
                      className={`flex-1 font-semibold pb-1 focus:outline-none focus:border-blue disabled:bg-transparent ${isEditing ? 'border-b border-gray-300' : 'border-b border-transparent'}`}
                      type="text"
                      disabled={!isEditing}
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  {error && <span className="text-xs text-red-500 ml-24">{error.message}</span>}
                </div>
              )}
            />

            <Controller
              name="lastName"
              control={control}
              rules={VALIDATION_RULES.lastName}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-4">
                    <label className=" w-20 shrink-0">Apellidos:</label>
                    <input
                      {...field}
                      className={`flex-1 font-semibold pb-1 focus:outline-none focus:border-blue disabled:bg-transparent ${isEditing ? 'border-b border-gray-300' : 'border-b border-transparent'}`}
                      type="text"
                      disabled={!isEditing}
                      placeholder="Ingresa tu apellido"
                    />
                  </div>
                  {error && <span className="text-xs text-red-500 ml-24">{error.message}</span>}
                </div>
              )}
            />
          </div>

          {/* Correo - Full Width */}
          <Controller
            name="email"
            control={control}
            rules={VALIDATION_RULES.email}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <label className=" w-20 shrink-0">Correo:</label>
                  <input
                    {...field}
                    className={`flex-1 font-semibold pb-1 focus:outline-none focus:border-blue disabled:bg-transparent ${isEditing ? 'border-b border-gray-300' : 'border-b border-transparent'}`}
                    type="email"
                    disabled={!isEditing}
                    placeholder="usuario@example.com"
                  />
                </div>
                {error && <span className="text-xs text-red-500 ml-24">{error.message}</span>}
              </div>
            )}
          />

          {/* DNI - Celular */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <label className=" w-20 shrink-0">DNI:</label>
              <input
                className="flex-1 font-semibold pb-1 bg-transparent text-gray-500 border-b border-transparent"
                type="text"
                value={userDni}
                disabled
                placeholder="12345678"
              />
            </div>

            <Controller
              name="phone"
              control={control}
              rules={VALIDATION_RULES.phone}
              render={({ field, fieldState: { error } }) => (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-4">
                    <label className=" w-20 shrink-0">Celular:</label>
                    <input
                      {...field}
                      className={`flex-1 font-semibold pb-1 focus:outline-none focus:border-blue disabled:bg-transparent ${isEditing ? 'border-b border-gray-300' : 'border-b border-transparent'}`}
                      type="text"
                      disabled={!isEditing}
                      placeholder="Ingresa tu celular"
                    />
                  </div>
                  {error && <span className="text-xs text-red-500 ml-24">{error.message}</span>}
                </div>
              )}
            />
          </div>

          {/* Botones */}
          <div className="pt-6 flex gap-4 w-full">
            {!isEditing ? (
              <Button
                text="Editar"
                onClick={() => setIsEditing(true)}
                variant="primary"
                fullWidth
              />
            ) : (
              <>
                <div className="w-1/2">
                  <Button
                    text="Cancelar"
                    onClick={handleCancel}
                    variant="secondary"
                    fullWidth
                  />
                </div>
                <div className="w-1/2">
                  <Button
                    text="Guardar cambios"
                    onClick={handleSubmit(onSubmit)}
                    variant="primary"
                    fullWidth
                  />
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
