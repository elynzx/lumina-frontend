import leftArrowIcon from "@/assets/icons/left-arrow.svg";
import rightArrowIcon from "@/assets/icons/right-arrow.svg";

interface Props {
  onPrev: () => void;
  onNext: () => void;
  currentSlide: number;
  totalSlides: number;
}

export const SlideNavigation = ({ 
  onPrev, 
  onNext, 
  currentSlide, 
  totalSlides 
}: Props) => {
  return (
  <div className="flex items-center justify-between w-full max-w-[200px]">
    <button
      onClick={onPrev}
      className="p-3 rounded-full bg-white hover:bg-white/60 transition-all"
    >
      <img src={leftArrowIcon} alt="Anterior" className="w-4 h-4" />
    </button>

    <span className="text-white font-medium text-lg">
      {currentSlide + 1} / {totalSlides}
    </span>

    <button
      onClick={onNext}
      className="p-3 rounded-full bg-white hover:bg-white/60 transition-all"
    >
      <img src={rightArrowIcon} alt="Siguiente" className="w-4 h-4" />
    </button>
  </div>
  )
};