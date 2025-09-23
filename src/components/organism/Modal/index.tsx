interface Props {
    children: React.ReactNode;
}

export const Modal = ({ children }: Props) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-modal-overlay flex items-center justify-center">
            <div className="bg-white py-[64px] px-[48px] min-w-[484px] rounded-2xl shadow-lg">
                {children}
            </div>
        </div>
    )
};
