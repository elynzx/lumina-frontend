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

  const images = imgUrls.length >= 3 ? imgUrls.slice(0, 3) : [...imgUrls, ...Array(3 - imgUrls.length).fill(imgUrls[0] || '')];

  return (
    <div className="w-full px-3 md:px-12 py-6 md:py-10">
      <div className="flex gap-8 max-w-6xl mx-auto h-[550px]">

        <div className="w-[70%] h-full">
          <img 
            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
            src={images[0]} 
            alt={description} 
            onClick={onClick} 
          />
        </div>

        <div className="w-[30%] h-full flex flex-col">

          <div className="h-[calc(50%-8px)]">
            <img 
              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
              src={images[1]} 
              alt={description} 
              onClick={onClick} 
            />
          </div>

          <div className="h-[16px]"></div>

          <div className="h-[calc(50%-8px)]">
            <img 
              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity" 
              src={images[2]} 
              alt={description} 
              onClick={onClick} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};