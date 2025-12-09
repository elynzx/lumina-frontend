import { useNavigate } from "react-router-dom"
import locationIcon from "@/assets/icons/location_blue.svg"

interface Props {
  idLocal: number
  imgUrl: string
  title: string
  district: string
  details: string
  onClick?: () => void
}

export const VenuePreviewCard = ({
  idLocal,
  imgUrl,
  title,
  district,
  details,
  onClick: _onClick
}: Props) => {

  const navigate = useNavigate()

  const truncateText = (text: string, maxWords: number) => {
    return text.split(' ').slice(0, maxWords).join(' ') + '...';
  };

  const handleNavigate = () => {
    navigate(`/producto/${idLocal}`)
  }

  return (
    <div className="cursor-pointer w-[260px] h-[345px] flex flex-col shadow-xl rounded-lg overflow-hidden"
      onClick={handleNavigate}
    >
      <div className="shrink-0 h-[60%] w-full bg-gray flex items-center justify-center">
        <img src={imgUrl} alt={title} className="h-full w-full object-cover rounded-t-lg" />
      </div>
      <div className="grow h-[40%] px-4 py-2 flex flex-col justify-center">
        <h3 className="font-bold text-center">{title}</h3>
        <div className="flex items-center justify-center gap-2 mt-1 px-1">
          <p className="text-xs text-center text-gray-600 leading-relaxed flex-1">
            {truncateText(details, 8)}<button
              onClick={(e) => {
                e.stopPropagation()
                handleNavigate()
              }}
              className="text-xs text-bgray hover:text-blue whitespace-nowrap"
            >
              Ver más
            </button>
          </p>

        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          <img src={locationIcon} alt="Location Icon" className="h-4 w-4 inline-block" />
          <p className="text-sm text-center">{district}</p>
        </div>
      </div>
    </div>
  )
};
