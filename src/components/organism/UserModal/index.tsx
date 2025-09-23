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
                {subtitle && <p className="text-[16px] mb-8">{subtitle}</p>}
                <div className="flex flex-col gap-5 w-full items-center">
                    <Input placeholder="Correo electrónico" />
                    <Input placeholder="Contraseña" />
                    <Button text={buttonText} onClick={onClickAction} fullWidth />
                    {isLogin && <a className="text-xs text-black underline font-bold cursor-pointer" onClick={callBackPassword}>Olvide mi contraseña</a>}
                    <hr className="h-[1px] w-full" />
                    <p className="text-xs">{footerText} <a className="font-bold text-black cursor-pointer" onClick={callBackFooter}>{footerLinkText}</a></p>
                </div>
            </div>
        </Modal>
    )
};
