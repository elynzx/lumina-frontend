import { Modal } from "../Modal";
import { Input } from "@/components/atomic/Input";
import { Button } from "@/components/atomic/Button";

interface Props {
    title: string
    subtitle?: string
    onClickAction: () => void
    isLogin?: boolean
    buttonText: string
    callBackPassword?: () => void    
    footerText: string
    footerLinkText: string
    callBackFooter: () => void
}

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
    return (
        <Modal>
            <div className="flex flex-col items-center">
                <h2 className="text-title mb-8">{title}</h2>
                {subtitle && <p className="text-blue text-[16px] mb-8">{subtitle}</p>}
                <div className="flex flex-col gap-5 w-full items-center">
                    {!isLogin && 
                        <>
                            <div className="w-full flex justify-between gap-4">
                                <Input
                                    name="firstName"
                                    value=""
                                    onChange={() => {}}
                                    placeholder="Nombres"
                                />
                                <Input
                                    name="lastName"
                                    value=""
                                    onChange={() => {}}
                                    placeholder="Apellidos"
                                />
                            </div>
                            <div className="w-full flex justify-between gap-4">
                                <Input
                                    name="documentNumber"
                                    value=""
                                    onChange={() => {}}
                                    placeholder="DNI"
                                />
                                <Input
                                    name="phone"
                                    value=""
                                    onChange={() => {}}
                                    placeholder="Celular"
                                />
                            </div>                            
                        </>
                    }
                    <Input
                        name="email"
                        value=""
                        onChange={() => {}}
                        placeholder="Correo electrónico"
                    />
                    {isLogin && 
                        <Input
                            name="password"
                            value=""
                            onChange={() => {}}
                            placeholder="Contraseña"
                        />
                    }
                    {!isLogin &&
                        <div className="w-full flex justify-between gap-4">
                            <Input
                                name="newPassword"
                                value=""
                                onChange={() => {}}
                                placeholder="Crear contraseña"
                            />
                            <Input
                                name="confirmPassword"
                                value=""
                                onChange={() => {}}
                                placeholder="Repetir contraseña"
                            />
                        </div>
                    }
                    <Button text={buttonText} onClick={onClickAction} fullWidth variant="tertiary" />
                    {isLogin && <a className="text-xs text-black underline font-bold cursor-pointer" onClick={callBackPassword}>Olvide mi contraseña</a>}
                    <hr className="h-[1px] w-full border-light-bgray" />
                    <p className="text-gray-500 text-xs">{footerText} <a className="text-blue font-bold cursor-pointer" onClick={callBackFooter}>{footerLinkText}</a></p>
                </div>
            </div>
        </Modal>
    )
};
