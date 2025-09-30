import { SummaryForm } from "@/components/organism/SummaryForm";
import { data } from "@/constants/data";
import { PhotosLayout } from "./PhotosLayout";

export const ProductDetail = () => {
    return (
        <div className="flex flex-col px-16 py-6  gap-6 justify-center items-center">
            <PhotosLayout imgUrls={data.fotosLocales.filter(_ => _.idLocal === 1).map(_ => _.urlFoto)} description="Local para eventos" />
            <div className="w-full max-w-[440px] flex flex-col p-8">
                <SummaryForm />
            </div>
        </div>
    )
};