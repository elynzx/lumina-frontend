interface Props {
  imgUrls: string[]
  description?: string
  onClick?: () => void
}

export const PhotosLayout = ({ 
  imgUrls, 
  description, 
  onClick
}: Props) => {

  const images = imgUrls.length >= 3 ? imgUrls.slice(0, 3) : [...imgUrls, ...Array(3 - imgUrls.length).fill(null)];

  return (
    <div className="w-full px-3 sm:px-6 md:px-12 py-4 sm:py-6 md:py-10">

      <div className="md:hidden flex flex-col gap-3 max-w-2xl mx-auto">
        {images[0] && (
          <div className="w-full h-[250px] sm:h-[300px]">
            <img 
              className="w-full h-full object-cover rounded-lg cursor-pointer" 
              src={images[0]} 
              alt={description} 
              onClick={onClick} 
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {images[1] && (
            <div className="h-[150px] sm:h-[180px]">
              <img 
                className="w-full h-full object-cover rounded-lg cursor-pointer" 
                src={images[1]} 
                alt={description} 
                onClick={onClick} 
              />
            </div>
          )}
          {images[2] && (
            <div className="h-[150px] sm:h-[180px]">
              <img 
                className="w-full h-full object-cover rounded-lg cursor-pointer" 
                src={images[2]} 
                alt={description} 
                onClick={onClick} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Original */}
      <div className="hidden md:flex gap-8 max-w-6xl mx-auto h-[550px]">
        <div className="w-[60%] h-full">
          {images[0] ? (
            <img 
              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
              src={images[0]} 
              alt={description} 
              onClick={onClick} 
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>

        <div className="w-[40%] h-full flex flex-col">
          <div className="h-[calc(50%-8px)]">
            {images[1] ? (
              <img 
                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                src={images[1]} 
                alt={description} 
                onClick={onClick} 
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>

          <div className="h-[16px]"></div>

          <div className="h-[calc(50%-8px)]">
            {images[2] ? (
              <img 
                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
                src={images[2]} 
                alt={description} 
                onClick={onClick} 
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};