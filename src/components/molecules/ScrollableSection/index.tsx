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
    <div className="relative w-full max-w-[1400px] mx-auto sm:px-8 lg:px-16">
      {/* Botón izquierdo */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full shadow-lg transition-all bg-white hover:bg-gray-100 border border-gray-200"
          style={{ transform: 'translateY(-50%) translateX(-50%)' }}
        >
          <img src={leftArrowIcon} alt="Scroll left" className="w-5 h-5" />
        </button>
      )}

      {/* Contenedor de scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-8 overflow-x-auto scrollbar-hide justify-center"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {children}
      </div>

      {/* Botón derecho */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full shadow-lg transition-all bg-white hover:bg-gray-100 border border-gray-200"
          style={{ transform: 'translateY(-50%) translateX(50%)' }}
        >
          <img src={rightArrowIcon} alt="Scroll right" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};