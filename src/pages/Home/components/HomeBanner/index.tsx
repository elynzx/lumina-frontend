import bannerImage from "@/assets/images/banner-home.jpg";
import { SearchFilter } from "../SearchFilter";

export const HomeBanner = () => {
  return (
    <div className="relative w-full h-[820px] overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bannerImage})`
        }}
      />

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(0deg, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.7) 100%)"
        }}
      />

      <div className="absolute bottom-60 left-0 right-0 px-8">
        <SearchFilter />
      </div>
    </div>
  );
};