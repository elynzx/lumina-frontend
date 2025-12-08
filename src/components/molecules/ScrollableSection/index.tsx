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
  autoScroll = false,
  scrollSpeed = 2000,
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
    <div className="relative w-full max-w-[1200px] mx-auto">

      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full shadow-lg transition-all bg-white hover:bg-gray-100 border border-gray-200 hover-scale"
        >
          <img src={leftArrowIcon} alt="Scroll left" className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-8 py-8"
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
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full shadow-lg transition-all bg-white hover:bg-gray-100 border border-gray-200 hover-scale"
        >
          <img src={rightArrowIcon} alt="Scroll right" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};