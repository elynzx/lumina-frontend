import locationIcon from "@/assets/icons/location_blue.svg"

interface Props {
  imgUrl: string
  title: string
  district: string
  details: string
  onClick?: () => void
}

export const VenuePreviewCard = ({
  imgUrl,
  title,
  district,
  details,
  onClick
}: Props) => {

  return (
    <div className="cursor-pointer w-[260px] h-[345px] flex flex-col shadow-xl rounded-lg overflow-hidden"
      onClick={onClick}
    >
      <div className="flex-shrink-0 h-[70%] w-full bg-gray flex items-center justify-center">
        <img src={imgUrl} alt={title} className="h-full w-full object-cover rounded-t-lg" />
      </div>
      <div className="flex-grow h-[30%] px-4 py-2 flex flex-col justify-center">
        <h3 className="font-bold text-center">{title}</h3>
        <p className="text-xs text-center">{details}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <img src={locationIcon} alt="Location Icon" className="h-4 w-4 inline-block" />
          <p className="text-sm text-center">{district}</p>
        </div>
      </div>
    </div>
  )
};
