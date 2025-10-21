import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "../Modal";
import { Input } from "@/components/atomic/Input";
import { PasswordInput } from "@/components/atomic/PasswordInput";
import { Button } from "@/components/atomic/Button";
import { VALIDATION_RULES, VALIDATION_MESSAGES } from "@/utils/validations";

interface LoginFormData {
    email: string;
    password: string;
}

interface RegisterFormData {
    firstName: string;
    lastName: string;
    documentNumber: string;
    phone: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
}

interface Props {
    title: string
    subtitle?: string
    onClickAction: (data: LoginFormData | RegisterFormData) => void | Promise<void>
    isLogin?: boolean
    buttonText: string
    callBackPassword?: () => void    
    footerText: string
    footerLinkText: string
    callBackFooter: () => void
}

const LoginForm = ({ 
    onSubmit, 
    buttonText, 
    callBackPassword, 
    isSubmitting 
}: {
    onSubmit: (data: LoginFormData) => void;
    buttonText: string;
    callBackPassword?: () => void;
    isSubmitting: boolean;
}) => {
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        mode: 'onChange',
        defaultValues: { email: '', password: '' }
    });

    return (
        <>
            <Controller
                name="email"
                control={control}
                rules={VALIDATION_RULES.email}
                render={({ field }) => (
                    <Input
                        {...field}
                        placeholder="Correo electrónico"
                        type="email"
                        error={errors.email?.message}
                    />
                )}
            />
            <Controller
                name="password"
                control={control}
                rules={VALIDATION_RULES.password}
                render={({ field }) => (
                    <PasswordInput
                        {...field}
                        placeholder="Contraseña"
                        error={errors.password?.message}
                    />
                )}
            />
            <Button 
                text={buttonText} 
                type="submit" 
                fullWidth 
                variant="tertiary" 
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
            />
            {callBackPassword && (
                <a 
                    className="text-xs text-black underline font-bold cursor-pointer" 
                    onClick={callBackPassword}
                >
                    Olvide mi contraseña
                </a>
            )}
        </>
    );
};

const RegisterForm = ({ 
    onSubmit, 
    buttonText, 
    isSubmitting 
}: {
    onSubmit: (data: RegisterFormData) => void;
    buttonText: string;
    isSubmitting: boolean;
}) => {
    const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
        mode: 'onChange',
        defaultValues: { 
            firstName: '', 
            lastName: '', 
            documentNumber: '', 
            phone: '', 
            email: '', 
            newPassword: '', 
            confirmPassword: '' 
        }
    });

    const watchedPassword = watch('newPassword');

    return (
        <>
            <div className="w-full flex justify-between gap-4">
                <Controller
                    name="firstName"
                    control={control}
                    rules={VALIDATION_RULES.firstName}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Nombres"
                            error={errors.firstName?.message}
                        />
                    )}
                />
                <Controller
                    name="lastName"
                    control={control}
                    rules={VALIDATION_RULES.lastName}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Apellidos"
                            error={errors.lastName?.message}
                        />
                    )}
                />
            </div>
            <div className="w-full flex justify-between gap-4">
                <Controller
                    name="documentNumber"
                    control={control}
                    rules={VALIDATION_RULES.dni}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="DNI"
                            error={errors.documentNumber?.message}
                        />
                    )}
                />
                <Controller
                    name="phone"
                    control={control}
                    rules={VALIDATION_RULES.phone}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Celular"
                            error={errors.phone?.message}
                        />
                    )}
                />
            </div>
            <Controller
                name="email"
                control={control}
                rules={VALIDATION_RULES.email}
                render={({ field }) => (
                    <Input
                        {...field}
                        placeholder="Correo electrónico"
                        type="email"
                        error={errors.email?.message}
                    />
                )}
            />
            <div className="w-full flex justify-between gap-4">
                <Controller
                    name="newPassword"
                    control={control}
                    rules={VALIDATION_RULES.password}
                    render={({ field }) => (
                        <PasswordInput
                            {...field}
                            placeholder="Crear contraseña"
                            error={errors.newPassword?.message}
                        />
                    )}
                />
                <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                        required: VALIDATION_MESSAGES.required,
                        validate: (value: string) => 
                            value === watchedPassword || VALIDATION_MESSAGES.passwordMatch
                    }}
                    render={({ field }) => (
                        <PasswordInput
                            {...field}
                            placeholder="Repetir contraseña"
                            error={errors.confirmPassword?.message}
                        />
                    )}
                />
            </div>
            <Button 
                text={buttonText} 
                type="submit" 
                fullWidth 
                variant="tertiary" 
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
            />
        </>
    );
};

export const UserModal = ({
    title,
    subtitle,
    onClickAction,
    isLogin = false,
    buttonText,
    callBackPassword,
    footerText,
    footerLinkText,
    callBackFooter
}: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: LoginFormData | RegisterFormData) => {
        setIsSubmitting(true);
        try {
            await onClickAction(data);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Modal>
            <div className="flex flex-col items-center">
                <h2 className="text-title mb-8">{title}</h2>
                {subtitle && <p className="text-blue text-[16px] mb-8">{subtitle}</p>}
                <div className="flex flex-col gap-5 w-full items-center">
                    {isLogin ? (
                        <LoginForm
                            onSubmit={handleSubmit}
                            buttonText={buttonText}
                            callBackPassword={callBackPassword}
                            isSubmitting={isSubmitting}
                        />
                    ) : (
                        <RegisterForm
                            onSubmit={handleSubmit}
                            buttonText={buttonText}
                            isSubmitting={isSubmitting}
                        />
                    )}
                    <hr className="h-[1px] w-full border-light-bgray" />
                    <p className="text-gray-500 text-xs">
                        {footerText}{' '}
                        <a className="text-blue font-bold cursor-pointer" onClick={callBackFooter}>
                            {footerLinkText}
                        </a>
                    </p>
                </div>
            </div>
        </Modal>
    )
};
