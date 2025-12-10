import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/atomic/Button';
import { PasswordInput } from '@/components/atomic/PasswordInput';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '@/utils/validations';
import { useChangePassword } from '@/hooks/api';
import { AlertCircle } from 'lucide-react';
import type { ChangePasswordRequest } from '@/api/interfaces/auth';
import type { ClipboardEvent } from 'react';

/**
 * Component for changing user password
 */
export const UpdatePassword = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { changePassword, loading: changingPassword } = useChangePassword();

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<ChangePasswordRequest>({
    mode: 'onChange',
  });

  const watchedNewPassword = watch('newPassword');

  const handlePreventCopyPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const onSubmit = async (data: ChangePasswordRequest) => {
    setMessage(null);
    try {
      await changePassword(data);
      setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
      reset();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al cambiar la contraseña' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Cambiar Contraseña</h2>
        <p className="text-xs text-gray-600">Actualiza tu contraseña para mantener tu cuenta segura</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
            }`}
        >
          <AlertCircle size={20} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full items-center sm:px-30">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Contraseña Actual
          </label>
          <Controller
            name="currentPassword"
            control={control}
            rules={VALIDATION_RULES.password}
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder="Ingresa tu contraseña actual"
                error={errors.currentPassword?.message}
                autoComplete="off"
                onPaste={handlePreventCopyPaste}
                onCopy={handlePreventCopyPaste}
                onCut={handlePreventCopyPaste}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Nueva Contraseña
          </label>
          <Controller
            name="newPassword"
            control={control}
            rules={VALIDATION_RULES.password}
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder="Ingresa tu nueva contraseña"
                error={errors.newPassword?.message}
                autoComplete="new-password"
                onPaste={handlePreventCopyPaste}
                onCopy={handlePreventCopyPaste}
                onCut={handlePreventCopyPaste}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Confirmar Nueva Contraseña
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: VALIDATION_MESSAGES.required,
              validate: (value: string) =>
                value === watchedNewPassword || VALIDATION_MESSAGES.passwordMatch
            }}
            render={({ field }) => (
              <PasswordInput
                {...field}
                placeholder="Confirma tu nueva contraseña"
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                onPaste={handlePreventCopyPaste}
                onCopy={handlePreventCopyPaste}
                onCut={handlePreventCopyPaste}
              />
            )}
          />
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            text={changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
            variant="tertiary"
            disabled={changingPassword}
            fullWidth
          />
        </div>
      </form>
    </div>
  );
};
