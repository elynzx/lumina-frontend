import { useState, useRef } from "react";
import leftArrowIcon from "@/assets/icons/left-arrow.svg";
import rightArrowIcon from "@/assets/icons/right-arrow.svg";

interface Props {
  children: React.ReactNode;
  autoScroll?: boolean;
  scrollSpeed?: number;
}

export const ScrollableSection = ({
  children,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = 250;
      const scrollAmount = cardWidth * 1; 
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = 250;
      const scrollAmount = cardWidth * 1;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden">

      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full shadow-lg transition-all bg-white hover:bg-gray-100 border border-gray-200 hover-scale"
        >
          <img src={leftArrowIcon} alt="Scroll left" className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-8 py-6 sm:py-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflowY: 'visible'
        }}
      >
        {children}
      </div>

      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full shadow-lg transition-all bg-white hover:bg-gray-100 border border-gray-200 hover-scale"
        >
          <img src={rightArrowIcon} alt="Scroll right" className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
};