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
                    <Input
                        name="email"
                        value=""
                        onChange={() => {}}
                        placeholder="Correo electrónico"
                    />
                    <Input
                        name="password"
                        value=""
                        onChange={() => {}}
                        placeholder="Contraseña"
                    />
                    <Button text={buttonText} onClick={onClickAction} fullWidth variant="tertiary" />
                    {isLogin && <a className="text-xs text-black underline font-bold cursor-pointer" onClick={callBackPassword}>Olvide mi contraseña</a>}
                    <hr className="h-[1px] w-full border-light-bgray" />
                    <p className="text-gray-500 text-sm">{footerText} <a className="text-blue text-[16px] font-bold cursor-pointer" onClick={callBackFooter}>{footerLinkText}</a></p>
                </div>
            </div>
        </Modal>
    )
};
