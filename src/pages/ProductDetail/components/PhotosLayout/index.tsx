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
    <div className="w-full px-3 md:px-12 py-6 md:py-10">
      <div className="flex gap-8 max-w-6xl mx-auto h-[550px]">

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