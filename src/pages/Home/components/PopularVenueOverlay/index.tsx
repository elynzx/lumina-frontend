interface Props {
  title: string;
  description: string;
  currentItemTitle?: string;
  children?: React.ReactNode;
}

export const PopularVenueOverlay = ({
  title,
  description,
  currentItemTitle,
  children
}: Props) => {
  return (
    <div className="bg-gradient-radial opacity-90 absolute right-0 top-0 h-full w-[45%] flex flex-col justify-center items-center px-12 py-16">
      <h2 className="text-xl font-bold text-white mb-6">
        {title}
      </h2>

      <p className="text-white text-sm leading-relaxed text-center mb-8 w-2/3">
        {description}
      </p>

      <div className="w-full flex flex-col items-center">
        {currentItemTitle && (
          <h3 className="font-semibold text-white mb-6">
            {currentItemTitle}
          </h3>
        )}
        {children}
      </div>
    </div>
  )
};