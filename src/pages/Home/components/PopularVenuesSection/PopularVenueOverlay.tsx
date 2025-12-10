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
    <div className="bg-gradient-radial opacity-90 absolute right-0 top-0 h-full w-full sm:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 py-8 sm:py-16">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
        {title}
      </h2>

      <p className="text-white text-xs sm:text-sm leading-relaxed text-center mb-6 sm:mb-8 w-full sm:w-2/3">
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