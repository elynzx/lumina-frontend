import { Button } from "@/components/atomic/Button";
import locationIcon from "@/assets/icons/location.svg"
import capacityIcon from "@/assets/icons/capacity.svg"
import { memo } from "react"

interface Props {
  imgUrl: string
  onClick?: () => void
  title: string
  district: string
  address: string
  capacity: number
  pricePerHour: number
  buttonText: string
  onClickAction: () => void
}

export const ProductCard =memo( ({
  imgUrl,
  onClick,
  title,
  district,
  address,
  capacity,
  pricePerHour,
  buttonText,
  onClickAction,
}: Props) => {

  return (
    <div className="cursor-pointer w-[340px] h-[400px] flex flex-col shadow-xl rounded-lg overflow-hidden"
      onClick={onClick}
    >
      <div className="flex-shrink-0 h-[55%] w-full bg-gray flex items-center justify-center">
        <img src={imgUrl} alt={title} className="h-full w-full object-cover rounded-t-lg" />
      </div>
      <div className="flex-grow h-[45%] gap-0.5 flex flex-col justify-center px-6">
        <h3 className="font-bold text-left mb-2">{title}</h3>
        <div className="flex items-center gap-2">
          <img src={locationIcon} alt="location icon" className="w-5" /><p className="text-xs text-left">{address}</p>
        </div>
        <div className="flex items-center gap-2">
          <img src={capacityIcon} alt="capacity icon" className="w-5" /><p className="text-xs text-left">{capacity} personas</p>
        </div>
        <div className="flex justify-between items-center gap-2 mt-2">
          <p className="text-xs text-left">
            <span className="font-bold text-2xl">s/.{pricePerHour}</span> por hora</p>
          <div onClick={(e) => e.stopPropagation()}>
            <Button 
              text={buttonText} 
              onClick={onClickAction} 
            />
          </div>
        </div>
      </div>
    </div>
  )
});
